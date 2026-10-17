# 在 Java 应用中嵌入 FRP 客户端

`tio-frp` 将内网穿透连接集成到 Java 应用的生命周期中。应用启动后读取 `frpc.toml`，完成登录、代理注册和数据转发；应用关闭时释放隧道连接，无需单独维护 frpc 进程。

TCP 收发使用 tio-core，协议层负责 FRP 消息、控制流加密、Yamux 复用和心跳。Java 21 虚拟线程负责等待与双向转发，接收缓冲及复用窗口控制内存占用。

## 添加依赖

将依赖版本统一放入项目的依赖管理属性中：

```xml
<dependency>
  <groupId>nexus.io</groupId>
  <artifactId>tio-frp</artifactId>
  <version>${tio-frp.version}</version>
</dependency>
```

## 配置 TCP 代理

在应用工作目录放置 `frpc.toml`：

```toml
serverAddr = "frps.example.com"
serverPort = 7000
auth.token = "replace-with-your-token"

[[proxies]]
name = "web"
type = "tcp"
localIP = "127.0.0.1"
localPort = 80
remotePort = 1039
```

这个配置把服务端的 TCP 端口转发到本机 HTTP 服务。可以添加多个 `[[proxies]]`，每个代理名称必须唯一。`remotePort = 0` 表示请求服务端分配端口。

`FrpConfigLoader.loadDefault()` 通过 `EnvUtils.get("frp.config", "frpc.toml")` 获取配置文件位置。默认路径相对于进程工作目录，启动脚本应先切换到应用目录。

## 与 tio-boot 一起启动

TCP 和 HTTP 代理使用相同的客户端生命周期，区别在配置与服务端入口。

在 `TioApplication.run` 返回后启动隧道，保证本地 HTTP 服务已经监听。下面演示启动集成；业务路由按应用需要配置。

```java
import nexus.io.frp.service.FrpClient;
import nexus.io.tio.boot.TioApplication;

public class Application {
  public static void main(String[] args) throws Exception {
    TioApplication.run(Application.class, args);
    FrpClient client = FrpClient.startDefault();
    Runtime.getRuntime().addShutdownHook(new Thread(client::close, "frp-shutdown"));
  }
}
```

隧道启动是异步的，短暂网络故障不会阻塞本地服务。若需要等到代理完成注册再继续初始化，可以使用有界等待：

```java
import java.time.Duration;
import nexus.io.frp.service.FrpClient;

public class TunnelReadiness {
  public static boolean waitForRegistration(FrpClient client) throws InterruptedException {
    if (client.awaitReady(Duration.ofSeconds(20))) {
      return true;
    }
    System.out.println("Tunnel is reconnecting: " + client.getLastError());
    return false;
  }
}
```

`awaitReady` 等待首次注册成功；超时后客户端仍然继续重连。后续使用 `isReady()` 查询当前状态。注册成功代表服务端接受了所有代理，不等于本地业务健康检查通过。

动态创建的客户端应由所属组件显式调用 `close()`。应用重新加载时先关闭旧实例，再创建新实例，避免同名代理重复注册。客户端关闭只释放自己的连接和状态，保留应用共享的 tio 执行器。

## HTTP 子域名代理

当 Nginx 处理网站 HTTPS 时，可以让 frps 使用 HTTP 虚拟主机按域名路由。

服务端配置：

```toml
bindPort = 8000
auth.token = "replace-with-your-token"
vhostHTTPPort = 8080
subDomainHost = "example.com"
```

客户端配置：

```toml
serverAddr = "frps.example.com"
serverPort = 8000
auth.token = "replace-with-your-token"

[[proxies]]
name = "web-001"
type = "http"
localIP = "127.0.0.1"
localPort = 80
subdomain = "001"
```

此时代理域名为 `001.example.com`。DNS 指向 Nginx，Nginx 转发至 frps 的 `8080` 端口，并保留 `Host`：

```nginx
location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

该片段放在已有网站证书配置的 Nginx server 块中，假设 Nginx 与 frps 同机。HTTP 代理不设置 `remotePort`。

HTTP 选项支持 `subdomain`、`customDomains`、`locations`、`hostHeaderRewrite`、`httpUser` 和 `httpPassword`。至少配置子域名或自定义域名；路径以 `/` 开头。frps 执行域名/路径路由、Host 改写及 Basic Auth，Java 客户端继续复用工作连接转发。

## TLS 与网站 HTTPS

两层 TLS 分别承担不同职责：

| 连接 | 处理位置 | 用途 |
| --- | --- | --- |
| 浏览器到 Nginx 的 HTTPS | Nginx | 网站证书与外部 HTTPS |
| Java FRP 客户端到 frps | tio-frp | 隧道传输保护 |
| 隧道到本地 HTTP 端口 | 本地 HTTP 服务 | 接收原始 HTTP 请求 |

即使 Nginx 已经处理 HTTPS，客户端与 frps 仍然可以使用 TLS。本地应用无需加载网站证书。

默认行为与原版 frpc 配置一致：启用 `transport.tcpMux` 和 `transport.tls.enable`；`transport.tls.disableCustomTLSFirstByte` 默认为 `true`。TCP 复用设置需要与服务端一致。

需要校验服务端证书时添加：

```toml
transport.tls.enable = true
transport.tls.trustedCaFile = "certs/ca.pem"
transport.tls.serverName = "frps.example.com"
```

这些客户端全局字段应放在第一个 `[[proxies]]` 之前。CA 路径相对于配置文件目录。设置 CA 后验证证书链与服务名称；未设置时兼容原版默认的自动生成证书模式。隧道使用独立 TLS 上下文，不改变 JVM 全局提供者。

## 心跳、复用与重连

- 心跳间隔默认 30 秒，超时默认 90 秒，可通过 `transport.heartbeatInterval`、`transport.heartbeatTimeout` 设置。
- `transport.dialServerTimeout` 默认 10 秒，控制连接与握手等待时间。
- Yamux 为每条业务连接提供独立流，按窗口控制发送，并在消费数据后通知对端更新窗口。
- 控制连接断开后以 1～30 秒退避重试，重新登录并注册全部代理。
- 网络中断会结束已有业务连接；隧道恢复后，新请求可以继续访问。
- `user` 可选，用于给代理名称添加用户前缀。

## 支持范围

### 同 JVM 内部转发

每个代理可选择 `localTransport = "tio"` 或 `localTransport = "socket"`，默认 socket。socket 模式连接 `localIP:localPort`，兼容其他框架；tio 模式复用当前服务的解码、路由、拦截器和发送链，无需建立本地 TCP 连接。

```toml
[[proxies]]
name = "web"
type = "http"
subdomain = "001"
localTransport = "tio"
```

内部模式省略 `localIP/localPort`，并在 `TioApplication.run(...)` 返回后传入运行中的服务：

```java
import nexus.io.frp.service.FrpClient;
import nexus.io.tio.boot.server.TioBootServer;

public class FrpBootstrap {
  public static FrpClient start() throws Exception {
    FrpClient client = FrpClient.startDefault(TioBootServer.me().getTioServer());
    Runtime.getRuntime().addShutdownHook(new Thread(client::close, "frp-shutdown"));
    return client;
  }
}
```

目标服务使用明文 HTTP，网站 TLS 由 Nginx 处理。隧道 TLS 独立配置。HTTP 解析依旧由原有框架执行，`FrpStreamChannel` 负责把 FRP 工作流适配为异步通道。关闭 FRP 客户端只释放它的工作上下文，不停止应用服务。

tio-frp 的生产依赖无需 tio-boot，也可直接将原生 tio-core 的 `TioServer` 传入 `new FrpClient(config, runningServer)`。`localTransport` 是 Java 客户端本地扩展，不发送到 frps；使用原版 frpc 时删除该字段。

### 协议能力

支持 FRP v1、token 鉴权、TCP/HTTP 代理、TLS、Yamux、控制消息加密、心跳与自动重连。HTTP 代理支持子域名、自定义域名、路径路由、Host 改写和 Basic Auth。

UDP、HTTPS 类型代理、STCP/XTCP、QUIC/KCP、OIDC、代理插件、代理级压缩/加密、客户端证书、健康检查、限流、请求/响应头操作及 `routeByHTTPUser` 等功能尚未实现。配置解析器会拒绝未支持的字段，保证实际运行行为与配置声明一致。

协议验证覆盖原版 frps 的连接、2 MB 二进制数据往返、16 并发请求、心跳、HTTP 域名与路径路由、Basic Auth 和服务端重启后恢复；应用可进一步添加自己的业务验收。
