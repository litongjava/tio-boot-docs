# UniChatClient 原始 HTTP 传输

`UniChatClient.execute(client, request)` 接收调用方构造的 OkHttp 请求，保留协议扩展字段、请求方法和请求体，返回原始 HTTP 响应。适合需要读取状态码、响应头、二进制内容或逐块消费 SSE 的集成场景。

`UniChatClient.newCall(client, request)` 返回可取消的 `Call`，调用方可以执行同步调用、异步回调或取消。两个入口复用传入客户端的连接池、代理、超时和重定向策略，不额外添加鉴权或业务重试。

## WebSocket 双向传输

`UniChatClient.newWebSocket(client, request, listener)` 复用调用方的连接策略，适合双向事件、音频和实时会话。连接建立、文本消息、二进制消息与异常通过 `WebSocketListener` 回调处理。调用方持有返回的连接，在会话结束时调用 `close()`，需要立即中止时调用 `cancel()`。

```java
import nexus.io.chat.UniChatClient;
import nexus.io.tio.utils.environment.EnvUtils;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;

public class RealtimeTransport {
  public WebSocket connect(OkHttpClient client) {
    Request request = new Request.Builder()
        .url(EnvUtils.get("ai.websocket-url"))
        .header("Authorization", "Bearer " + EnvUtils.get("ai.api-key"))
        .build();
    return UniChatClient.newWebSocket(client, request, new WebSocketListener() {
      @Override
      public void onOpen(WebSocket socket, Response response) {
        socket.send("{\"type\":\"session.update\",\"session\":{}}");
      }

      @Override
      public void onMessage(WebSocket socket, String text) {
        System.out.println(text);
      }
    });
  }
}
```

## 读取状态码与响应头

```java
import java.io.IOException;
import java.util.concurrent.TimeUnit;
import nexus.io.chat.UniChatClient;
import nexus.io.tio.utils.environment.EnvUtils;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class RawChatTransport {
  private final OkHttpClient client = new OkHttpClient.Builder()
      .connectTimeout(20, TimeUnit.SECONDS)
      .readTimeout(60, TimeUnit.SECONDS)
      .retryOnConnectionFailure(false)
      .followRedirects(false)
      .build();

  public String generate(String validatedJson) throws IOException {
    Request request = new Request.Builder()
        .url(EnvUtils.get("ai.base-url") + "/chat/completions")
        .header("Authorization", "Bearer " + EnvUtils.get("ai.api-key"))
        .post(RequestBody.create(validatedJson, MediaType.get("application/json")))
        .build();
    try (Response response = UniChatClient.execute(client, request)) {
      if (!response.isSuccessful()) {
        throw new IOException("Upstream status: " + response.code());
      }
      if (response.body() == null) {
        return "";
      }
      return response.body().string();
    }
  }
}
```

原始入口不自动选择平台地址、不转换 JSON，也不会因非成功 HTTP 状态而自动抛出业务异常。调用方根据 `response.code()` 和 `response.headers()` 判断结果；网络错误仍通过 `IOException` 返回。

## 原样消费流并支持取消

```java
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import nexus.io.chat.UniChatClient;
import okhttp3.Call;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class RawStreamTransport {
  public Call prepare(OkHttpClient client, Request request) {
    return UniChatClient.newCall(client, request);
  }

  public void copy(Call call, OutputStream destination) throws IOException {
    try (Response response = call.execute()) {
      if (!response.isSuccessful() || response.body() == null) {
        throw new IOException("Upstream status: " + response.code());
      }
      try (InputStream source = response.body().byteStream()) {
        byte[] buffer = new byte[8192];
        int count;
        while ((count = source.read(buffer)) != -1) {
          destination.write(buffer, 0, count);
          destination.flush();
        }
      }
    }
  }
}
```

流式读取保留 SSE 的事件名、事件 ID、多行数据和结束标记。网络读取块可能切开 UTF-8 字符或事件边界；只做转发时直接复制字节，需要解释事件时使用持续缓冲的解析器。

调用方负责关闭 `Response`，并在下游断开或用户取消时调用 `Call.cancel()`。超时和重试由传入客户端配置；发送后连接中断时应先核对原请求结果。日志或诊断界面显示请求头时应隐藏访问凭证。
