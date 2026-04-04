# 使用内置 UDPServer

tio-boot 内置了 UDPServer tio-boot 内置了 UDP Server,只需要配置 UDPHandler 即可使用

将 UDPServer 和 TioBoot 配置为相同的端口即可,其他细节可以参考上一章节

```
import java.net.SocketException;

import nexus.io.jfinal.aop.annotation.AConfiguration;
import nexus.io.jfinal.aop.annotation.AInitialization;
import nexus.io.tio.boot.constatns.ConfigKeys;
import nexus.io.tio.core.udp.UdpServer;
import nexus.io.tio.core.udp.UdpServerConf;
import nexus.io.tio.utils.environment.EnvUtils;

import demo.udp.handler.DemoUdpHandler;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@AConfiguration
public class UdpServerConfig {

  @Initialization
  public void config() {
    int port = EnvUtils.getInt(ConfigKeys.SERVER_PORT,80);
    DemoUdpHandler fpmsUdpHandler = new DemoUdpHandler();
    UdpServerConf udpServerConf = new UdpServerConf(port, fpmsUdpHandler, 5000);
    UdpServer udpServer;
    try {
      udpServer = new UdpServer(udpServerConf);
      udpServer.start();
      log.info("udp started");
    } catch (SocketException e) {
      e.printStackTrace();
    }

  }
}
```

## 参考文献

[tiocloud 文档资料](https://www.tiocloud.com/doc/tio/?pageNumber=1)
