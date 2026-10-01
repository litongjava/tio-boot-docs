# 34_tio

本章按“认识框架 → 快速上手 → 核心概念 → 业务应用 → 深入原理”的路线组织。首次阅读建议从核心优势与消息处理流程开始；已有使用经验时，可直接进入所需主题。

## 认识 t-io

- [01. t-io 核心优势与应用价值](./01-overview.md)
- [02. t-io 消息处理流程](./02-message-flow.md)

## 快速上手

- [03. TioBootServer](./03-tio-boot-server.md)
- [04. 独立端口启动 TCP 服务器](./04-tcp-server.md)
- [05. 内置 TCP 处理器](./05-tcp-handler.md)
- [06. 独立启动 UDPServer](./06-udp-server.md)
- [07. 使用内置 UDPServer](./07-udp-handler.md)

## 核心概念

- [08. TioConfig](./08-tio-config.md)
- [09. ChannelContext](./09-channel-context.md)
- [10. Packet](./10-packet.md)
- [11. Tio 工具类](./11-tio-api.md)

## 消息与文件传输

- [12. 发送数据](./12-send-data.md)
- [13. HTTP 长连接与高效文件传输](./13-http-keep-alive-file-transfer.md)
- [14. 使用 AsynchronousSocketChannel 响应数据](./14-async-channel-response.md)

## 连接管理

- [15. 业务数据绑定](./15-bind-data.md)
- [16. 业务数据解绑](./16-unbind-data.md)
- [17. 关闭连接](./17-close-connection.md)
- [18. 资源共享](./18-resource-sharing.md)
- [19. 成员排序](./19-member-ordering.md)
- [20. 拉黑 IP](./20-ip-blacklist.md)

## 加密通信

- [21. SSL](./21-ssl.md)
- [22. Https建立连接过程](./22-https-handshake.md)

## 心跳与监控

- [23. 监控: 心跳](./23-heartbeat.md)
- [24. 监控: 客户端的流量数据](./24-client-traffic.md)
- [25. 监控: 单条 TCP 连接的流量数据](./25-connection-traffic.md)
- [26. 监控: 端口的流量数据](./26-port-traffic.md)
- [27. 单条通道统计: ChannelStat](./27-channel-stat.md)
- [28. 所有通道统计: GroupStat](./28-group-stat.md)

## 深入原理

- [29. tio-运行原理详解](./29-runtime-internals.md)
- [30. DecodeRunnable](./30-decode-runnable.md)
- [31. t-io 稳定性设计与资源管理](./31-stability-resource-management.md)
- [32. 深入解析 Tio 源码：构建高性能 Java 网络应用](./32-source-code-guide.md)

- [33. HTTP、WebSocket 与 TCP 的缓冲区复用](./33-buffer-reuse.md)

## 配图资源

- [配图目录](./images/readme.md)
