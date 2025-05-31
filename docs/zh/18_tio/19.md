# 监控: 端口的流量数据

## GroupStat

在 t-io 中，每个 `TioConfig` 对象都包含一个 `GroupStat` 成员，用于统计和监控连接组的流量数据。其定义如下：

```java
public GroupStat groupStat = null;
```

## GroupStat 定义

`GroupStat` 包含以下字段和方法，用于统计监听端口的整体流量和性能数据（已省略简单的 getter 和 setter 方法）：

### 字段

- **closed:**  
  记录已关闭的连接数。

- **receivedPackets:**  
  记录接收到的消息包数。

- **receivedBytes:**  
  记录接收到的消息字节数。

- **handledPackets:**  
  记录已处理的消息包数。

- **handledPacketCosts:**  
  记录处理消息包的总耗时，单位为毫秒。

- **handledBytes:**  
  记录已处理的字节数。

- **sentPackets:**  
  记录发送的消息包数。

- **sentBytes:**  
  记录发送的字节数。

- **receivedTcps:**  
  记录接收到的 TCP 数据包次数。

### 方法

- **getBytesPerTcpReceive():**  
  计算平均每次 TCP 接收到的字节数。该方法用于监控潜在的慢攻击，返回值越小，越可能存在攻击嫌疑。

- **getPacketsPerTcpReceive():**  
  计算平均每次 TCP 接收到的业务包数。该方法也可用于监控慢攻击，返回值越小，越有攻击嫌疑。

- **getHandledCostsPerPacket():**  
  计算处理每个消息包的平均耗时，单位为毫秒。用于评估服务器处理消息包的效率。

## GroupStat 的初始化

- **服务器端 (`ServerTioConfig`)**:  
  在 `ServerTioConfig` 类的构造函数中初始化 `GroupStat` 对象：

  ```java
  this.groupStat = new ServerGroupStat();
  ```

- **客户端 (`ClientTioConfig`)**:  
  在 `ClientTioConfig` 类的构造函数中初始化 `GroupStat` 对象：

  ```java
  this.groupStat = new ClientGroupStat();
  ```

## 获取 GroupStat

可以通过 `TioConfig` 对象获取 `GroupStat`，并根据情况强制转换为服务器或客户端的具体实现：

```java
GroupStat groupStat = tioConfig.groupStat;

// 如果确定是服务器端，可以强制转换为 ServerGroupStat 对象
ServerGroupStat serverGroupStat = (ServerGroupStat) tioConfig.groupStat;

// 如果确定是客户端，可以强制转换为 ClientGroupStat 对象
ClientGroupStat clientGroupStat = (ClientGroupStat) tioConfig.groupStat;
```

通过 `GroupStat`，可以方便地监控服务器端或客户端的流量数据、连接状态、消息处理性能等，从而优化系统性能和安全性。

## 参考文献

[tiocloud 文档资料](https://www.tiocloud.com/doc/tio/?pageNumber=1)
