# 资源共享

## 多端口资源共享

### 需求场景

- **场景 1:** 端口 5555 只接受 iOS 的请求。
- **场景 2:** 端口 6666 只接受安卓的请求。
- **共同点:** 无论是 iOS 还是安卓，应用层协议的格式是相同的。

### 问题

如果一条消息需要发送给同一个群组的用户，而该群组中可能既有安卓用户也有 iOS 用户，如何高效地发送消息给所有用户？

### 常规解决办法

通常的做法是先为每个设备类型绑定群组，然后分别发送消息：

```java
// 第一步：先进行群组绑定
Tio.bindGroup(channelContext_IOS, group_A);
Tio.bindGroup(channelContext_Android, group_A);

// 第二步：分别发送
Tio.sendToGroup(tioConfig_IOS, group_A, packet_1);
Tio.sendToGroup(tioConfig_Android, group_A, packet_1);
```

虽然这种方法可行，但代码显得冗长，容易出错。如果有 3 个或 4 个端口，这种方式会变得更加繁琐。

### 利用 t-io 的资源共享能力

t-io 提供了资源共享的能力，能够简化多端口资源共享的实现。通过共享 `TioConfig`，我们可以避免多次绑定和发送操作。

#### 实现步骤

1. **系统启动时初始化共享配置：**

   在系统启动时，调用共享函数进行配置：

   ```java
   tioConfig_IOS.share(tioConfig_Android);
   ```

2. **绑定群组：**

   选择任一 `ChannelContext` 进行群组绑定：

   ```java
   Tio.bindGroup(channelContext_IOS, group_A);
   // 或者
   Tio.bindGroup(channelContext_Android, group_A);
   ```

3. **发送消息：**

   使用共享的 `TioConfig` 进行消息发送：

   ```java
   Tio.sendToGroup(tioConfig_IOS, group_A, packet_1);
   // 或者
   Tio.sendToGroup(tioConfig_Android, group_A, packet_1);
   ```

### 总结

通过 t-io 的资源共享功能，可以大大简化多端口的消息发送操作，无需为每个端口单独执行绑定和发送步骤。这个方法让代码更简洁、更易维护，提高了系统的灵活性。

## 实现 App 客户端（Socket）和 Web 端（WebSocket）消息互通

### 前言

在实际业务场景中，特别是即时通讯（IM）应用中，通常存在多个客户端，如手机端、PC 端和 Web 端同时登录。这就产生了一个问题：WebSocket 端口和 Socket 端口不一致，如何让它们之间实现消息互通？

### 解决思路

初始的解决思路是获取 `ServerTioConfig`，然后通过它发送消息。以下是一个简单的示例：

```java
// 通过 HTTP 接口获取 WebSocketStarter 的 ServerTioConfig 来发送消息
@Request(HttpMethod.GET, value="/send")
public void sendByHttp(String to, String msg) {
    ServerTioConfig context = TioWsServer.starter.getServerTioConfig();
    Tio.sendToUser(context, to, Packet(msg));
}
```

但是，t-io 已经提供了更简便的方法：`ServerTioConfig.share()`，可以轻松实现多端口间的资源共享。

### 利用 t-io 的 ServerTioConfig.share() 方法

`share()` 方法的定义如下，它将一个 `TioConfig` 对象中的资源共享到另一个 `TioConfig` 对象中，实现不同端口间的资源互通：

```java
public void share(TioConfig tioConfig) {
    this.clientNodes = tioConfig.clientNodes;
    this.connections = tioConfig.connections;
    this.groups = tioConfig.groups;
    this.users = tioConfig.users;
    this.tokens = tioConfig.tokens;
    this.ids = tioConfig.ids;
    this.bsIds = tioConfig.bsIds;
    this.ipBlacklist = tioConfig.ipBlacklist;
    this.ips = tioConfig.ips;
}
```

### DEMO 演示

定义一个简单的 `ImPacket`：

```java
public class ImPacket extends Packet {

    public static ImPacket newPacket(byte[] body) {
        ImPacket packet = new ImPacket();
        packet.setBody(body);
        return packet;
    }

    public void setBody(byte[] body) {
        this.body = body;
    }

    public byte[] getBody() {
        return body;
    }

    private byte[] body;
}
```

### 编解码

客户端和服务端的编解码过程是一样的：

```java
public static Packet decode(ByteBuffer buffer, int limit, int position, int readableLength, ChannelContext channelContext) throws AioDecodeException {
    // 四字节的 bodyLength + body
    int bodyLength = buffer.getInt();
    if (bodyLength <= 0) {
        return null;
    }
    // 长度不够解包，返回 null
    if (buffer.remaining() < bodyLength) {
        return null;
    }
    byte[] body = new byte[bodyLength];
    buffer.get(body);
    return ImPacket.newPacket(body);
}

public static ByteBuffer encode(Packet packet, TioConfig tioConfig, ChannelContext channelContext) {
    ImPacket packet1 = (ImPacket) packet;
    int bodyLength = packet1.getBody().length;
    ByteBuffer buffer = ByteBuffer.allocate(4 + bodyLength);
    buffer.putInt(bodyLength);
    buffer.put(packet1.getBody());
    return buffer;
}
```

### Socket Server 端

```java
public class TioSocketServer {

    private ServerTioConfig serverTioConfig;

    public ServerTioConfig getServerTioConfig() {
        return serverTioConfig;
    }

    public void start() throws IOException {
        serverTioConfig = new ServerTioConfig("Tio Socket Server", new ImSocketServerTioHandler(), new ImSocketServerTioListener(), Threads.getTioExecutor(), Threads.getGroupExecutor());
        TioServer server = new TioServer(serverTioConfig);
        server.start("127.0.0.1", 8899);
    }
}
```

### Socket Client 端

```java
private static void start() throws Exception {
    ClientTioConfig clientTioConfig = new ClientTioConfig(new ImSocketClientTioHandler(), new DefaultClientAioListerner(), new ReconnConf(2000), Threads.getTioExecutor(), Threads.getGroupExecutor());
    TioClient client = new TioClient(clientTioConfig);
    clientChannelContext = client.connect(new Node("127.0.0.1", 8899));
}
```

### WebSocket Server 端

```java
private ServerTioConfig sharedServerTioConfig;

// 这里将 SocketServer 的 ServerTioConfig 传入
public TioWsServer(ServerTioConfig tioConfig) {
    this.sharedServerTioConfig = tioConfig;
}

private ServerTioConfig wsServerTioConfig;

public void start() throws Exception {
    WsServerConfig config = new WsServerConfig(9000);
    WsServerStarter wsServerStarter = new WsServerStarter(config, new ImWsHandler(), Threads.getTioExecutor(), Threads.getGroupExecutor());

    wsServerTioConfig = wsServerStarter.getServerTioConfig();
    // 核心代码：共享 TioConfig
    wsServerTioConfig.share(sharedServerTioConfig);
    // 协议转换器，将 ImPacket 转换为 WsPacket 包
    wsServerTioConfig.packetConverter = new ImPackageConvert();
    wsServerStarter.start();
}
```

### PacketConverter 代码

```java
public class ImPackageConvert implements PacketConverter {
    @Override
    public Packet convert(Packet packet, ChannelContext channelContext) {
        if (packet instanceof ImPacket) {
            ImPacket p = (ImPacket) packet;
            WebSocketResponse wsResponse = new WebSocketResponse();
            wsResponse.setWsOpcode(Opcode.TEXT);
            wsResponse.setBody(p.getBody());
            try {
                wsResponse.setWsBodyText(new String(p.getBody(), "utf-8"));
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            return wsResponse;
        }
        return packet;
    }
}
```

### 发送消息

在发送消息时，使用 `ServerTioConfig` 发送即可。`ServerTioConfig` 可以是 `SocketServer.getServerTioConfig()`，也可以是 `WebSocketServer.getServerTioConfig()`：

```java
Tio.sendToUser(serverTioConfig, "userId", packet);
```

### 运行效果

启动两个服务端（Socket 和 WebSocket），一个客户端和一个浏览器。将用户绑定为 `SOCKET-1` 和 `WEBSOCKET-1`，即可实现 App 客户端与 Web 端消息的互通。

## 参考文献

[tiocloud 文档资料](https://www.tiocloud.com/doc/tio/?pageNumber=1)
