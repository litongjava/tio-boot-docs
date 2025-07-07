# 使用tio-boot搭建多模型LLM代理服务

本文档介绍如何基于[tio-boot](https://github.com/litongjava/tio-boot)框架快速搭建一个支持多模型的大语言模型代理服务。该代理服务将接收来自客户端的请求（包括流式和非流式模式），并通过统一接口将请求转发至OpenAI、Anthropic Claude和Google Gemini等API，同时负责将返回结果以HTTP响应或SSE（Server-Sent Events）流的形式返回给客户端。

---

## 1. 概述

* **使用场景**：当需要统一接入多个LLM服务时，可通过本代理服务解决以下问题：
  1. 网络策略限制（如无法直连API域名）
  2. 统一认证和密钥管理
  3. 多模型路由转发
  4. 流式/非流式响应格式转换

* **核心功能**：
  1. 前端请求发送至本地tio-boot服务（如`http://127.0.0.1/***`）
  2. 根据请求路径自动路由到对应API服务（OpenAI/Anthropic/Google）
  3. 根据请求体中的`stream`字段自动选择SSE流式或同步HTTP响应
  4. 将API返回结果（JSON或SSE流）适配返回给客户端

---

## 2. 环境准备

1. **JDK**：Java 8或更高版本

2. **构建工具**：Maven或Gradle

3. **核心依赖**（pom.xml示例）：
```xml
<dependency>
  <groupId>com.litongjava</groupId>
  <artifactId>tio-boot-admin</artifactId>
  <version>1.0.4</version>
</dependency>
<dependency>
  <groupId>com.alibaba.fastjson2</groupId>
  <artifactId>fastjson2</artifactId>
  <version>2.0.30</version>
</dependency>
<dependency>
  <groupId>org.projectlombok</groupId>
  <artifactId>lombok</artifactId>
  <version>1.18.26</version>
  <scope>provided</scope>
</dependency>
```

---

## 3. 项目结构

```
llm-proxy-app/
├─ src/
│  ├─ main/
│  │  ├─ java/
│  │  │  ├─ com/litongjava/llm/proxy/
│  │  │  │  ├─ LLMProxyApp.java          # 应用入口
│  │  │  ├─ com/litongjava/llm/proxy/config/
│  │  │  │  └─ LLMProxyConfig.java       # 路由配置
│  │  │  ├─ com/litongjava/llm/proxy/handler/
│  │  │  │  └─ LLMProxyHandler.java  # 核心处理器
│  │  │  ├─ com/litongjava/llm/proxy/callback/
│  │  │  │  └─ SSEProxyCallback...java   # SSE回调处理
│  │  └─ resources/
│  │     └─ app.properties               # 配置文件
└─ pom.xml
```

---

## 4. 关键实现

### 4.1 LLMProxyHandler.java - 请求路由处理器

```java
package com.litongjava.llm.proxy.handler;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import com.alibaba.fastjson2.JSONObject;
import com.litongjava.claude.ClaudeClient;
import com.litongjava.gemini.GeminiClient;
import com.litongjava.llm.proxy.callback.SSEProxyCallbackEventSourceListener;
import com.litongjava.model.body.RespBodyVo;
import com.litongjava.openai.client.OpenAiClient;
import com.litongjava.proxy.AiChatProxyClient;
import com.litongjava.tio.boot.http.TioRequestContext;
import com.litongjava.tio.core.ChannelContext;
import com.litongjava.tio.http.common.HttpRequest;
import com.litongjava.tio.http.common.HttpResponse;
import com.litongjava.tio.http.common.utils.HttpIpUtils;
import com.litongjava.tio.http.server.util.CORSUtils;
import com.litongjava.tio.utils.environment.EnvUtils;
import com.litongjava.tio.utils.hutool.StrUtil;
import com.litongjava.tio.utils.json.FastJson2Utils;

import lombok.extern.slf4j.Slf4j;
import okhttp3.Response;
import okhttp3.sse.EventSourceListener;

@Slf4j
public class LLMProxyHandler  {

  public HttpResponse completions(HttpRequest httpRequest) {
    long start = System.currentTimeMillis();
    HttpResponse httpResponse = TioRequestContext.getResponse();
    CORSUtils.enableCORS(httpResponse);

    String requestURI = httpRequest.getRequestURI();

    String bodyString = httpRequest.getBodyString();

    if (StrUtil.isBlank(bodyString)) {
      return httpResponse.setJson(RespBodyVo.fail("empty body"));
    }

    String realIp = HttpIpUtils.getRealIp(httpRequest);
    log.info("from:{},requestURI:{}", realIp, requestURI);
    Boolean stream = false;
    String url = null;
    Map<String, String> headers = new HashMap<>();
    if (requestURI.startsWith("/openai")) {
      url = OpenAiClient.OPENAI_API_URL + "/chat/completions";
      headers.put("authorization", httpRequest.getAuthorization());

      JSONObject openAiRequestVo = null;

      if (bodyString != null) {
        openAiRequestVo = FastJson2Utils.parseObject(bodyString);
        stream = openAiRequestVo.getBoolean("stream");
      }
      
    } else if (requestURI.startsWith("/anthropic")) {
      url = ClaudeClient.CLAUDE_API_URL + "/messages";
      headers.put("x-api-key", httpRequest.getHeader("x-api-key"));
      headers.put("anthropic-version", httpRequest.getHeader("anthropic-version"));

      JSONObject openAiRequestVo = null;

      if (bodyString != null) {
        openAiRequestVo = FastJson2Utils.parseObject(bodyString);
        stream = openAiRequestVo.getBoolean("stream");
      }
      
    } else if (requestURI.startsWith("/google")) {
      String key = httpRequest.getParam("key");
      String modelName1 = requestURI.substring(requestURI.lastIndexOf('/') + 1, requestURI.indexOf(':'));
      if (requestURI.endsWith("streamGenerateContent")) {
        url = GeminiClient.GEMINI_API_URL + modelName1 + ":streamGenerateContent?alt=sse&key=" + key;
        stream = true;
      } else {
        url = GeminiClient.GEMINI_API_URL + modelName1 + ":generateContent?key=" + key;
      }
    }

    //String authorization = httpRequest.getHeader("authorization");

    if (stream != null && stream) {
      // 告诉默认的处理器不要将消息体发送给客户端,因为后面会手动发送
      httpResponse.setSend(false);
      ChannelContext channelContext = httpRequest.getChannelContext();
      EventSourceListener openAIProxyCallback = new SSEProxyCallbackEventSourceListener(channelContext, httpResponse, start);
      AiChatProxyClient.stream(url, headers, bodyString, openAIProxyCallback);
    } else {
      try (Response response = AiChatProxyClient.generate(url, headers, bodyString)) {
        //OkHttpResponseUtils.toTioHttpResponse(response, httpResponse);
        try {
          String string = response.body().string();
          httpResponse.setString(string, "utf-8", "application/json");
          if (EnvUtils.getBoolean("app.debug", false)) {
            log.info("chat:{},{}", bodyString, string);
          }

        } catch (IOException e) {
          e.printStackTrace();
        }
        long end = System.currentTimeMillis();
        log.info("finish llm in {} (ms):", (end - start));
      }
    }

    return httpResponse;
  }
}
```

**功能说明**：
1. **多模型路由**：根据URL前缀`/openai`、`/anthropic`、`/google`自动路由到对应服务
2. **头部处理**：提取并转换各平台特有的认证头（Authorization/x-api-key）
3. **流式检测**：解析请求体中的`stream`字段决定响应模式
4. **响应转换**：非流式模式直接返回JSON，流式模式通过SSE回调处理

---

### 4.2 SSEProxyCallbackEventSourceListener.java - SSE回调处理器

```java
package com.litongjava.llm.proxy.callback;

import java.io.IOException;

import com.jfinal.kit.StrKit;
import com.litongjava.tio.core.ChannelContext;
import com.litongjava.tio.core.Tio;
import com.litongjava.tio.http.common.HttpResponse;
import com.litongjava.tio.http.common.sse.SsePacket;
import com.litongjava.tio.utils.SystemTimer;

import lombok.extern.slf4j.Slf4j;
import okhttp3.Response;
import okhttp3.sse.EventSource;
import okhttp3.sse.EventSourceListener;

@Slf4j
public class SSEProxyCallbackEventSourceListener extends EventSourceListener {

  private ChannelContext channelContext;
  private HttpResponse httpResponse;
  private long start;
  private boolean continueSend = true;

  public SSEProxyCallbackEventSourceListener(ChannelContext channelContext, HttpResponse httpResponse, long start) {
    this.channelContext = channelContext;
    this.httpResponse = httpResponse;
    this.start = start;
  }

  @Override
  public void onOpen(EventSource eventSource, Response response) {
    httpResponse.addServerSentEventsHeader();
    httpResponse.setSend(true);
    Tio.send(channelContext, httpResponse);
  }

  @Override
  public void onEvent(EventSource eventSource, String id, String type, String data) {
    if (StrKit.notBlank(data)) {
      sendPacket(new SsePacket(type, data.getBytes()));
      // [DONE] 是open ai的数据标识 
      if ("[DONE]".equals(data)) {
        finish(eventSource);
        return;
      }
    }

  }

  @Override
  public void onClosed(EventSource eventSource) {
    finish(eventSource);
  }

  @Override
  public void onFailure(EventSource eventSource, Throwable t, Response response) {
    log.error(t.getMessage(), t);
    try {
      int code = response.code();
      String string = response.body().string();
      httpResponse.status(code);
      httpResponse.body(string);

      httpResponse.setSend(true);
      Tio.send(channelContext, httpResponse);
    } catch (IOException e) {
      e.printStackTrace();
    } finally {
      response.close();
    }

    finish(eventSource);
  }

  private void finish(EventSource eventSource) {
    log.info("elapse:{}", SystemTimer.currTime - start);
    eventSource.cancel();
    Tio.close(channelContext, "finish");
  }

  /** 三次重试发送 SSE，遇断就放弃 */
  private void sendPacket(SsePacket packet) {
    if (!continueSend)
      return;
    if (!Tio.bSend(channelContext, packet)) {
      if (!Tio.bSend(channelContext, packet)) {
        if (!Tio.bSend(channelContext, packet)) {
          continueSend = false;
        }
      }
    }
  }
}
```

**核心机制**：
1. **SSE初始化**：`onOpen`设置`Content-Type: text/event-stream`并建立连接
2. **数据流式转发**：`onEvent`将收到的数据块实时转发给客户端
3. **终止信号处理**：识别`[DONE]`标记并关闭连接
4. **错误处理**：API错误时返回原始错误信息和状态码

---

### 4.3 LLMProxyConfig.java - 路由配置

```java
package com.litongjava.llm.proxy.config;

import com.litongjava.context.BootConfiguration;
import com.litongjava.llm.proxy.handler.LLMProxyHandler;
import com.litongjava.tio.boot.server.TioBootServer;
import com.litongjava.tio.http.server.router.HttpRequestRouter;

public class LLMProxyConfig implements BootConfiguration {

  public void config() {

    TioBootServer server = TioBootServer.me();
    HttpRequestRouter requestRouter = server.getRequestRouter();

    LLMProxyHandler LLMProxyHandler = new LLMProxyHandler();
    requestRouter.add("/openai/v1/chat/completions", LLMProxyHandler::completions);
    requestRouter.add("/anthropic/v1/messages", LLMProxyHandler::completions);
    requestRouter.add("/google/v1beta/models/*", LLMProxyHandler::completions);
  }
}
```

**配置说明**：
1. 统一入口：不同API路径使用相同的处理方法
2. 通配符支持：Google模型路径支持`*`通配符
3. 自动装配：通过`BootConfiguration`接口实现启动时自动注册

---

### 4.4 LLMProxyApp.java - 应用入口

```java
package com.litongjava.llm.proxy;

import com.litongjava.llm.proxy.config.LLMProxyConfig;
import com.litongjava.tio.boot.TioApplication;

public class LLMProxyApp {
  public static void main(String[] args) {
    long start = System.currentTimeMillis();
    TioApplication.run(LLMProxyApp.class, new LLMProxyConfig(), args);
    long end = System.currentTimeMillis();
    System.out.println((end - start) + "ms");
  }
}
```

---

## 5. 服务启动与测试

### 5.1 启动服务
```bash
mvn clean package -DskipTests
java -jar target/llm-proxy-app-1.0.0.jar
```

### 5.2 多模型测试示例

**OpenAI非流式测试**：
```bash
curl -X POST http://localhost/openai/v1/chat/completions \
  -H "Authorization: Bearer sk-proj-o" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role":"system","content":"Just say hi"}],
    "model": "gpt-3.5-turbo",
    "stream": false
  }'
```

**Google Gemini流式测试**：
```bash
curl -X POST 'http://localhost/google/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=API_KEY' \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{"role": "user", "parts": [{"text": "hi"}]}]
  }'
```

**Anthropic Claude流式测试**：
```bash
curl -X POST http://localhost/anthropic/v1/messages \
  -H "x-api-key: YOUR_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "messages": [{"role": "user", "content": "Just say hi"}],
    "stream": true,
    "model":"claude-3-7-sonnet-20250219"
  }'
```

---

## 6. 注意事项

1. **响应体单次读取**：
   - 在非流式模式中，`response.body().string()`会自动读取并关闭流
   - 流式模式中避免重复读取响应体

2. **连接管理**：
   - OkHttpClient应全局复用以保证连接池效率
   - SSE连接结束时需显式关闭通道

3. **错误处理**：
   - API错误时透传原始错误码和消息体
   - 网络异常时记录日志并关闭连接

4. **性能优化**：
   - 开启DEBUG日志：`app.properties`中设置`app.debug=true`
   - 监控请求处理时间：关键节点记录时间戳

---

## 7. 技术总结

本代理服务基于tio-boot框架实现以下核心功能：

1. **多模型统一接入**：
   - OpenAI：标准ChatCompletions接口
   - Anthropic Claude：Messages API
   - Google Gemini：generateContent/streamGenerateContent

2. **双模式响应支持**：
   - 同步模式：直接返回完整JSON响应
   - 流式模式：通过SSE实时传输数据块

3. **高效路由机制**：
   - 路径前缀匹配不同API服务
   - 通配符处理模型动态路径
   - 统一请求处理方法

通过本方案，可快速构建支持多主流语言模型的统一代理服务，有效解决API访问限制问题，并提供一致的开发体验。