# HTTP、WebSocket 与 TCP 的缓冲区复用

t-io 为 HTTP、WebSocket 和 TCP 提供统一的读取缓冲区管理，并通过 `EncodedBuffer` 将编码输出和回收责任一同交给异步发送任务。接收侧连续读取、发送侧池化编码与完成后回收相互配合，减少重复分配，适合长期运行的网络服务。

## 三种协议的使用方式

下表描述框架通过 `encodeBuffer()` 发送的默认路径。

| 路径 | 分配与使用方式 | 复用机制 |
| --- | --- | --- |
| HTTP 接收 | `BufferPoolUtils.allocateRequest()` 返回 `VirtualBuffer` | 连续读取复用同一缓冲区，归还后可再次分配 |
| WebSocket 接收 | 升级后继续使用核心读取流程 | 与 HTTP、TCP 共用读取缓冲区管理 |
| TCP 接收 | 服务端接入与客户端连接完成时申请 `VirtualBuffer` | 容量变化或连接结束时归还 |
| HTTP 普通响应与文件响应头 | `HttpResponseEncoder.encodeBuffer()` | 从 VirtualBuffer 响应池分配，发送结束后归还 |
| WebSocket 服务端与客户端帧 | 对应编码器的 `encodeBuffer()` | 帧头和正文写入池化输出，发送结束后归还 |
| WebSocket 客户端 HTTP 握手请求 | `HttpRequestEncoder.encodeBuffer()` | 使用相同的响应池管理编码输出 |
| 自定义 TCP 编码 | handler 的 `encodeBuffer()` | 可使用池化输出；原有 `encode()` 继续兼容 |
| 内置 TCP 字节包、字符串包、ByteBuffer 包 | 包装已有正文或使用已有缓冲区 | 借用正文存储，避免为池化再复制一份数据 |
| TLS 或普通异步通道的文件分片 | 发送器申请池化分片 | 明文分片使用 VirtualBuffer，加密完成或写入结束后归还 |
| 增强通道上的明文文件正文 | `FileChannel.transferTo()` | 保留文件传输路径，无需为整个正文申请应用层缓冲区 |

HTTP keep-alive、WebSocket 和 TCP 长连接继续沿用各自的连接策略，单次发送缓冲区的回收不需要关闭连接。TLS 的加解密工作区与密文输出仍有独立的缓冲区管理流程。

## 复用现有 BufferPoolUtils

`BufferPoolUtils` 已经提供请求池和响应池入口：

```text
allocateRequest() / allocateResponse()
    → BufferPagePool
    → BufferPage
    → VirtualBuffer + ByteBuffer
```

`VirtualBuffer` 保存底层 ByteBuffer、所属 BufferPage 和回收状态。socket 实际读写 `virtualBuffer.buffer()`；调用 `virtualBuffer.clean()` 后，容量匹配的后续分配可以重新使用底层内存。

当前 BufferPage 使用完整缓冲区的回收队列，检查取出的候选缓冲区容量是否匹配；未命中时创建新缓冲区。空闲回收任务逐步清理队列。堆内存或直接内存由配置决定，VirtualBuffer 本身不等同于直接内存。

`EncodedBuffer.allocate(size)` 使用 `allocateResponse(WRITE_CHUNK_SIZE, size)` 对齐容量，并把有效 limit 限制为实际申请长度。编码器写完后调用 `flip()`，发送器只发送有效数据。

`clear()` 只重置位置，不会清零内存。编码器应完整写入每个字段；WebSocket 编码器会显式写入完整帧头，包括扩展长度字段。客户端掩码写入输出缓冲区，调用方的原始正文可以继续保留。

## EncodedBuffer 管理发送所有权

`EncodedBuffer` 将 ByteBuffer 和对应回收入口绑定在一起，由发送任务持有。

| 创建方式 | 用途 | 完成时的行为 |
| --- | --- | --- |
| `allocate(size)` | 申请新的池化编码输出 | 归还 VirtualBuffer 响应池 |
| `encodePooled(encoder)` | 在一次分配中完成编码 | 编码异常时自动归还；成功后交给发送任务 |
| `owned(virtualBuffer)` | 接收已有 VirtualBuffer 的所有权 | 调用对应包装对象的 `clean()` |
| `owned(byteBuffer)` | 兼容普通 ByteBuffer 编码器 | 交给 `BufferPoolUtils.clean()` |
| `borrowed(byteBuffer)` | 借用已有可读数据 | 保留调用方位置，不回收调用方存储 |

异步提交成功表示 IO 已开始。发送任务在部分写入期间继续持有缓冲区，直到这块数据写完或操作失败。连接关闭时，尚在写入的缓冲区仍等待 IO 回调结束再归还。`close()` 的回收动作只执行一次。

TLS 加密生成独立密文后，明文输出即可归还；密文缓冲区继续由发送任务持有到写入结束。文件分片同样按实际使用期限回收。

借用缓冲区的调用方应确保正文在发送完成前保持有效且不被修改。预编码数据也遵循此约定。

## 自定义 TCP 编码

原有 `encode()` 接口继续可用。需要池化编码时，可以额外覆盖 `encodeBuffer()`，把完整所有权交给发送器。下面的方法加入现有 handler，示例采用四字节长度加正文的协议，其中 `PayloadPacket` 表示应用自己的消息类型：

```java
@Override
public EncodedBuffer encodeBuffer(Packet packet, TioConfig config,
    ChannelContext context) {
  byte[] body = ((PayloadPacket) packet).getBody();
  int length = Math.addExact(Integer.BYTES, body.length);
  return EncodedBuffer.encodePooled(allocate -> {
    ByteBuffer output = allocate.apply(length);
    output.putInt(body.length);
    output.put(body);
    output.flip();
    return output;
  });
}
```

`EncodedBuffer` 位于 `nexus.io.tio.core.pool` 包。`encodePooled()` 的回调只申请一次输出，并返回这个输出；如果编码抛出异常，已分配的缓冲区会自动归还。

也可以直接接入已有工具类：

```java
VirtualBuffer virtualBuffer = BufferPoolUtils.allocateResponse(
    TioConfig.WRITE_CHUNK_SIZE, length);
EncodedBuffer encoded = EncodedBuffer.owned(virtualBuffer);
try {
  ByteBuffer output = encoded.buffer();
  output.order(ByteOrder.BIG_ENDIAN);
  output.limit(length);
  output.putInt(body.length);
  output.put(body);
  output.flip();
  return encoded;
} catch (RuntimeException | Error error) {
  encoded.close();
  throw error;
}
```

方法成功返回后，所有权已经交给发送器，编码器不要提前关闭它。只返回 `virtualBuffer.buffer()` 会丢失其回收入口；也不要将这块底层内存单独放入普通 ByteBuffer 回收队列。

框架保留静态 `encode()` 以及 handler 的旧编码接口。内置 handler 的子类继续通过旧接口调用其自定义 `encode()`，需要使用新路径时可显式覆盖 `encodeBuffer()`。直接调用静态 `encodeBuffer()` 而不经过框架发送器时，由调用者在使用完成后关闭返回对象。

## 长连接读取与业务数据

读取侧具有两层复用：同一连接连续读取时使用同一个 VirtualBuffer；连接结束或容量变化时归还池，供后续匹配容量的分配使用。这套机制适用于 HTTP keep-alive、WebSocket 和 TCP。

解码回调结束后，读取缓冲区可能立即投入下一次 IO。交给异步业务的消息应持有自己可独立使用的正文。`slice()` 和 `duplicate()` 共享底层内存，应用需要管理其使用期限。内置 HTTP、WebSocket 正文以及核心半包处理使用独立数据保存对应内容。

`VirtualBuffer.wrap(existingBuffer)` 只是包装已有存储，没有关联 BufferPage，不会自动加入池化复用。

## 观察复用效果

通过 `BufferPoolUtils.getBufferMomeryInfo()` 可查看请求池、响应池及普通 ByteBuffer 池的分配、命中与回收统计。容量分布、并发连接数量、发送速度及空闲清理都会影响命中率。对实际业务进行吞吐量、延迟、内存与 GC 测量，可帮助选择分配粒度和连接资源预算。

进一步阅读：[稳定性设计与资源管理](./31-stability-resource-management.md)、[HTTP 长连接与高效文件传输](./13-http-keep-alive-file-transfer.md)。
