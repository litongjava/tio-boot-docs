# Tio 工具类

`Tio`是一个用于管理网络通信的核心类，特别是在处理客户端和服务器之间的连接、消息发送、连接绑定和关闭等功能。类包含了大量的用于管理网络连接、发送和接收数据包、处理连接状态、以及管理连接的黑名单等操作的方法。这些方法使得开发者可以在客户端和服务器之间有效地进行通信，并对连接进行精细化管理.

下面是每个方法的中文解释：`Tio`

#### 静态内部类 `IpBlacklist`

1. **add(TioConfig tioConfig, String ip)**: 将 IP 地址添加到特定 `TioConfig` 的黑名单中。
2. **add(String ip)**: 将 IP 地址添加到全局黑名单中。
3. **clear(TioConfig tioConfig)**: 清空特定 `TioConfig` 的黑名单。
4. **clear()**: 清空全局黑名单。
5. **getAll(TioConfig tioConfig)**: 获取特定 `TioConfig` 的黑名单列表。
6. **getAll()**: 获取全局黑名单列表。
7. **isInBlacklist(TioConfig tioConfig, String ip)**: 检查 IP 是否在特定 `TioConfig` 的黑名单中。
8. **remove(TioConfig tioConfig, String ip)**: 从特定 `TioConfig` 的黑名单中移除 IP。
9. **remove(String ip)**: 从全局黑名单中移除 IP。

#### 类方法

1. **bindBsId(ChannelContext channelContext, String bsId)**: 将业务 ID 绑定到特定的通道上下文（`ChannelContext`）。
2. **bindGroup(ChannelContext channelContext, String group)**: 将群组绑定到特定的通道上下文。
3. **bindGroup(TioConfig tioConfig, String userid, String group)**: 将用户 ID 绑定到群组。
4. **bindToken(ChannelContext channelContext, String token)**: 将令牌绑定到特定的通道上下文。
5. **bindUser(ChannelContext channelContext, String userid)**: 将用户 ID 绑定到特定的通道上下文。
6. **bSend(ChannelContext channelContext, Packet packet)**: 阻塞方式发送消息到指定的通道上下文。
7. **bSend(TioConfig tioConfig, String ip, int port, Packet packet)**: 阻塞方式发送消息到指定的 IP 和端口。
8. **bSendToAll(TioConfig tioConfig, Packet packet, ChannelContextFilter channelContextFilter)**: 阻塞方式发送消息给所有连接。
9. **bSendToBsId(TioConfig tioConfig, String bsId, Packet packet)**: 阻塞方式发送消息给指定业务 ID 的连接。
10. **bSendToGroup(TioConfig tioConfig, String group, Packet packet, ChannelContextFilter channelContextFilter)**: 阻塞方式发送消息给指定群组。
11. **bSendToId(TioConfig tioConfig, String channelContextId, Packet packet)**: 阻塞方式发送消息给指定的通道上下文 ID。
12. **bSendToIp(TioConfig tioConfig, String ip, Packet packet, ChannelContextFilter channelContextFilter)**: 阻塞方式发送消息给指定 IP 的所有连接。
13. bSendToSet(TioConfig tioConfig, SetWithLock&lt;ChannelContext&gt; setWithLock, Packet packet, ChannelContextFilter channelContextFilter) 阻塞方式发送消息给指定的一组通道上下文。
14. **bSendToToken(TioConfig tioConfig, String token, Packet packet)**: 阻塞方式发送消息给指定令牌的所有连接。
15. **bSendToUser(TioConfig tioConfig, String userid, Packet packet)**: 阻塞方式发送消息给指定用户 ID 的所有连接。
16. **close(ChannelContext channelContext, String remark)**: 关闭指定的通道上下文连接。
17. **close(ChannelContext channelContext, String remark, CloseCode closeCode)**: 关闭指定的通道上下文连接，并指定关闭代码。
18. **closeIp(TioConfig tioConfig, String ip, String remark, CloseCode closeCode)**: 关闭指定 IP 的所有连接。
19. **closeGroup(TioConfig tioConfig, String group, String remark, CloseCode closeCode)**: 关闭指定群组的所有连接。
20. **closeUser(TioConfig tioConfig, String userid, String remark, CloseCode closeCode)**: 关闭指定用户 ID 的所有连接。
21. **closeToken(TioConfig tioConfig, String token, String remark, CloseCode closeCode)**: 关闭指定令牌的所有连接。
22. **getAll(TioConfig tioConfig)**: 获取特定 `TioConfig` 的所有连接。
23. **getConnecteds(ClientTioConfig clientTioConfig)**: 获取客户端配置中所有处于正常连接状态的连接。
24. **getByBsId(TioConfig tioConfig, String bsId)**: 根据业务 ID 查找通道上下文。
25. **getByClientNode(TioConfig tioConfig, String clientIp, Integer clientPort)**: 根据客户端 IP 和端口获取通道上下文。
26. **getByChannelContextId(TioConfig tioConfig, String channelContextId)**: 根据通道上下文 ID 获取通道上下文。
27. **getByGroup(TioConfig tioConfig, String group)**: 获取指定群组的所有客户端。
28. **getByToken(TioConfig tioConfig, String token)**: 根据令牌获取通道上下文集合。
29. **getByIp(TioConfig tioConfig, String ip)**: 根据客户端 IP 获取通道上下文集合。
30. **getByUserid(TioConfig tioConfig, String userid)**: 根据用户 ID 获取通道上下文集合。
31. **getPageOfAll(TioConfig tioConfig, Integer pageIndex, Integer pageSize)**: 获取所有连接的分页列表。
32. **getPageOfConnecteds(ClientTioConfig clientTioConfig, Integer pageIndex, Integer pageSize)**: 获取客户端配置中所有正常连接的分页列表。
33. **getPageOfGroup(TioConfig tioConfig, String group, Integer pageIndex, Integer pageSize)**: 获取指定群组中所有连接的分页列表。
34. **groupCount(TioConfig tioConfig, String group)**: 获取指定群组中连接的数量。
35. **isInGroup(String group, ChannelContext channelContext)**: 检查指定的通道上下文是否在给定的群组中。
36. **remove(ChannelContext channelContext, String remark)**: 移除指定的通道上下文。
37. **remove(TioConfig tioConfig, String clientIp, Integer clientPort, Throwable throwable, String remark)**: 删除指定 IP 和端口的连接。
38. **remove(ServerTioConfig serverTioConfig, String ip, String remark)**: 删除指定 IP 的所有连接。
39. **send(ChannelContext channelContext, Packet packet)**: 发送消息到指定的通道上下文。
40. **send(TioConfig tioConfig, String ip, int port, Packet packet)**: 发送消息到指定的 IP 和端口。
41. **sendToAll(TioConfig tioConfig, Packet packet, ChannelContextFilter channelContextFilter)**: 发送消息给所有连接。
42. **sendToBsId(TioConfig tioConfig, String bsId, Packet packet)**: 发送消息给指定业务 ID 的连接。
43. **sendToGroup(TioConfig tioConfig, String group, Packet packet, ChannelContextFilter channelContextFilter)**: 发送消息给指定群组。
44. **sendToId(TioConfig tioConfig, String channelContextId, Packet packet)**: 发送消息给指定的通道上下文 ID。
45. **sendToIp(TioConfig tioConfig, String ip, Packet packet, ChannelContextFilter channelContextFilter)**: 发送消息给指定 IP 的所有连接。
46. **sendToSet(TioConfig tioConfig, SetWithLock&lt;ChannelContext&gt; setWithLock, Packet packet, ChannelContextFilter channelContextFilter)**: 发送消息给指定的一组通道上下文。
47. **sendToToken(TioConfig tioConfig, String token, Packet packet)**: 发送消息给指定令牌的所有连接。
48. **sendToUser(TioConfig tioConfig, String userid, Packet packet)**: 发送消息给指定用户 ID 的所有连接。
49. **unbindBsId(ChannelContext channelContext)**: 解绑通道上下文的业务 ID。
50. **unbindGroup(ChannelContext channelContext)**: 解除指定通道上下文的群组绑定。
51. **unbindGroup(String group, ChannelContext channelContext)**: 将指定通道上下文从特定群组中解绑。
52. **unbindGroup(TioConfig tioConfig, String userid, String group)**: 将用户 ID 从群组中解除绑定。
53. **unbindToken(ChannelContext channelContext)**: 解除通道上下文绑定的令牌。
54. **unbindToken(TioConfig tioConfig, String token)**: 解除特定令牌的绑定。
55. **unbindUser(ChannelContext channelContext)**: 解除通道上下文绑定的用户 ID。
56. **unbindUser(TioConfig tioConfig, String userid)**: 解除特定用户 ID 的绑定。

## 参考文献

[tiocloud 文档资料](https://www.tiocloud.com/doc/tio/?pageNumber=1)
