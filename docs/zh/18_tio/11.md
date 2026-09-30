# 业务数据绑定

在网络编程中，资源绑定是将业务相关的数据和 TCP 连接（即 `ChannelContext`）关联起来的关键过程。例如，将一个连接表示为一个特定用户。假设 `ChannelContext-A` 代表了用户张三，张三的 `userid` 为 `333`，可以使用以下代码进行绑定：

```java
Tio.bindUser(ChannelContext-A, "333");
```

t-io 提供了 4 种内置的资源绑定方式。用户可以灵活运用这些绑定方法来满足业务层面的各种需求。例如，可以为群组 ID 添加前缀，如 `"ios-"`，用以标识该用户使用的是 iOS 设备：

```java
Tio.bindGroup(ChannelContext-A, "333");
Tio.bindGroup(ChannelContext-A, "ios-" + "333");
```

在这 4 种内置的资源绑定方法中，`ChannelContext` 可以绑定到多个 `groupid`，而其他三种绑定方式是多对一或一对一的关系。换句话说，一个 `ChannelContext` 可以同时属于多个群组（如 `group-a`，`group-b`，...，`group-n`）。

以下是这 4 种资源绑定方法的源代码：

```java
/**
 * 绑定业务 ID
 * @param channelContext
 * @param bsId
 */
public static void bindBsId(ChannelContext channelContext, String bsId) {
    channelContext.tioConfig.bsIds.bind(channelContext, bsId);
}

/**
 * 绑定群组
 * @param channelContext
 * @param group
 */
public static void bindGroup(ChannelContext channelContext, String group) {
    channelContext.tioConfig.groups.bind(group, channelContext);
}

/**
 * 绑定 Token
 * @param channelContext
 * @param token
 */
public static void bindToken(ChannelContext channelContext, String token) {
    channelContext.tioConfig.tokens.bind(token, channelContext);
}

/**
 * 绑定用户
 * @param channelContext
 * @param userid
 */
public static void bindUser(ChannelContext channelContext, String userid) {
    channelContext.tioConfig.users.bind(userid, channelContext);
}
```

## 资源绑定方法的详细说明

1. **绑定业务 ID (`bindBsId`)**  
   将业务 ID 绑定到指定的 `ChannelContext`，这可以用来表示该连接与特定业务逻辑的关联。

2. **绑定群组 (`bindGroup`)**  
   将 `ChannelContext` 绑定到一个或多个群组。一个 `ChannelContext` 可以属于多个群组，灵活性非常高。这在分组广播、分组聊天等功能中非常实用。

3. **绑定 Token (`bindToken`)**  
   为 `ChannelContext` 绑定一个 Token，用于识别连接的身份验证状态或其他需要 Token 标识的业务逻辑。

4. **绑定用户 (`bindUser`)**  
   将用户 ID 绑定到 `ChannelContext`，用于在服务器上标识特定的用户。这在用户管理和消息定向推送中非常有用。

通过以上绑定方法，开发者可以轻松地将业务数据与网络连接关联，实现复杂多样的业务需求。

## 参考文献

[tiocloud 文档资料](https://www.tiocloud.com/doc/tio/?pageNumber=1)
