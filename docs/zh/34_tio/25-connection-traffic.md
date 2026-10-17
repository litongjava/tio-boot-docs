# 监控: 单条 TCP 连接的流量数据

## TCP 会话的流量数据：ChannelStat

每个 TCP 会话对应一个 `ChannelContext` 对象，而每个 `ChannelContext` 对象都有一个 `ChannelStat` 对象，用于记录该连接的流量统计和状态信息。定义如下：

```java
public final ChannelStat stat = new ChannelStat();
```

## ChannelStat 定义

`ChannelStat` 包含以下字段和方法，用于监控和记录 TCP 连接的各种状态和流量数据：

### 字段

- **decodeFailCount:**  
  解码失败的次数。

- **latestTimeOfReceivedPacket:**  
  最近一次收到完整业务消息包的时间。

- **latestTimeOfSentPacket:**  
  最近一次发送完整业务消息包的时间。

- **latestTimeOfReceivedByte:**  
  最近一次接收到字节的时间。

- **latestTimeOfSentByte:**  
  最近一次发送字节的时间。

- **timeCreated:**  
  `ChannelContext` 对象创建的时间。

- **timeFirstConnected:**  
  第一次连接成功的时间。

- **timeClosed:**  
  连接关闭的时间。

- **timeInReconnQueue:**  
  进入重连队列的时间。

- **sentBytes:**  
  该连接已发送的字节数。

- **sentPackets:**  
  该连接已发送的消息包数。

- **handledBytes:**  
  该连接已处理的字节数。

- **handledPackets:**  
  该连接已处理的消息包数。

- **handledPacketCosts:**  
  处理消息包耗时的总和，单位为毫秒。可用于计算平均处理每个消息包的耗时。

- **receivedBytes:**  
  该连接已接收的字节数。

- **receivedTcps:**  
  该连接已接收的 TCP 数据包次数。

- **receivedPackets:**  
  该连接已接收的消息包数。

### 方法

- **getBytesPerTcpReceive():**  
  计算平均每次 TCP 接收到的字节数，用于监控潜在的慢攻击。返回值越小，越有攻击嫌疑。

- **getPacketsPerTcpReceive():**  
  计算平均每次 TCP 接收到的业务包数。此值越小，越可能存在慢攻击。

- **getHandledCostsPerPacket():**  
  计算处理每个消息包的平均耗时，单位为毫秒。用于评估服务器处理消息包的效率。

`ChannelStat` 提供了全面的流量和状态监控信息，可以用于检测连接性能、流量统计以及识别潜在的攻击行为（例如慢速攻击）。通过这些指标，开发者可以实时监控每个 TCP 连接的状态，优化系统性能和安全性。

## 参考文献

[tiocloud 文档资料](https://www.tiocloud.com/doc/tio/?pageNumber=1)
