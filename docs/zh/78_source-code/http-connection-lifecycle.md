# HTTP 请求与连接生命周期

一次请求的业务处理完成与网络发送完成是两个不同的时刻。框架通过按连接排序的业务队列和串行发送队列，把普通响应、文件响应以及 TLS 写入串联起来，使连接关闭与实际发送状态保持一致。

## 请求到响应

```text
接收字节
  → 请求解码（半包继续累积，完整请求进入处理）
  → 同一连接上的业务请求按顺序执行
  → 路由、拦截器和 Handler 生成响应
  → 确定连接策略并加入发送队列
  → 编码响应头和响应体
  → 异步写入，未写完继续发送
  → 全部发送完成，触发发送完成通知
  → 保持连接等待下次请求，或关闭连接
```

Handler 返回、`Tio.send` 返回以及 `onAfterHandled` 都不能当作“响应已经发完”。发送完成表示本次数据已交给网络传输层，也不等于客户端业务代码已经读取或处理了响应。

## 连接策略

| 场景 | 行为 |
| --- | --- |
| HTTP/1.1 未要求关闭 | 默认保持连接 |
| 请求 Connection 包含 close | 最终响应发送完成后关闭 |
| HTTP/1.0 开启兼容且包含 keep-alive，没有 close | 保持连接 |
| HTTP/1.0 未满足保持条件 | 响应完成后关闭 |
| 响应显式设置 Connection: close | 同步内部关闭标志，完整发送后关闭 |
| 响应调用 setKeepConnection(false) | 编码时输出 Connection: close，完整发送后关闭 |

Connection 的选项以逗号分隔，匹配时忽略大小写和两侧空白；重复的 Connection 请求头合并解析。多个选项同时出现时，close 优先。

编码前统一检查响应头、请求关闭要求与内部标志。关闭响应只输出一个 Connection: close，并移除 Keep-Alive 提示。CORS 工具只处理跨域响应头，不改变连接是否保持。WebSocket 的 Upgrade 响应在没有关闭要求时保留原有升级头。

普通 HTTP 响应确定关闭后，发送队列先完成当前响应，再结束连接；后续流水线请求停止进入业务处理。应用通过响应的连接策略即可协调发送与关闭。

## 主动关闭示例

```java
import nexus.io.tio.boot.http.TioRequestContext;
import nexus.io.tio.http.common.HttpRequest;
import nexus.io.tio.http.common.HttpResponse;
import nexus.io.model.body.RespBodyVo;

public class CloseAfterResponseHandler {
  public HttpResponse handle(HttpRequest request) {
    HttpResponse response = TioRequestContext.getResponse();
    response.setKeepConnection(false);
    return response.respond(RespBodyVo.ok("处理完成"));
  }
}
```

该 Handler 正常返回响应即可，不需要在调用 `Tio.send` 后立即调用 `Tio.close` 或 `Tio.remove`。不支持的 HTTP 方法同样通过“错误响应设置关闭标志 → 入队发送 → 完成后关闭”的流程结束连接；在错误响应发送期间不继续解码新的业务请求。

## 空闲超时与发送进度

服务器空闲检测使用最近接收字节、发送字节及发送完整消息包时间中的最大值。普通分段写入、TLS 加密后写入和文件传输在取得正向发送进度时更新发送字节时间，因此正在传输的大响应不会仅因“整个包尚未完成”而被当成空闲。

零字节写入重试不刷新活动时间；连续没有发送或接收进度的连接仍受空闲超时约束。空闲检测按周期运行，关闭时刻可能晚于配置阈值。HTTP Keep-Alive 响应头是协议提示，不应当作框架定时器的配置来源。

业务长时间计算但没有网络活动，与持续发送数据不同。此类接口应结合服务器超时、业务超时和流式输出需求设置策略，不能依靠业务线程仍在运行来无限延长连接。

协议参考：[Connection 选项](https://www.rfc-editor.org/rfc/rfc9110.html#section-7.6.1)、[HTTP/1.1 连接关闭](https://www.rfc-editor.org/rfc/rfc9112.html#section-9.6)。
