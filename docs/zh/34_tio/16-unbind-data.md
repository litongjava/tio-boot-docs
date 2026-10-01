# 业务数据解绑

在业务数据绑定的场景中，解绑是与绑定相对应的操作，用于解除 `ChannelContext` 与业务数据的关联关系。解绑操作非常重要，特别是在处理用户下线、会话过期等情况时。下面直接展示解绑操作的源代码：

```java
/**
 * 解绑业务 ID
 * @param channelContext
 */
public static void unbindBsId(ChannelContext channelContext) {
    channelContext.tioConfig.bsIds.unbind(channelContext);
}

/**
 * 解除与所有组的绑定关系
 * @param channelContext
 */
public static void unbindGroup(ChannelContext channelContext) {
    channelContext.tioConfig.groups.unbind(channelContext);
}

/**
 * 解除与指定组的绑定关系
 * @param group
 * @param channelContext
 */
public static void unbindGroup(String group, ChannelContext channelContext) {
    channelContext.tioConfig.groups.unbind(group, channelContext);
}

/**
 * 解除绑定的 Token
 * @param channelContext
 */
public static void unbindToken(ChannelContext channelContext) {
    channelContext.tioConfig.tokens.unbind(channelContext);
}

/**
 * 解除绑定的用户 ID
 * @param channelContext
 */
public static void unbindUser(ChannelContext channelContext) {
    channelContext.tioConfig.users.unbind(channelContext);
}

/**
 * 解除用户 ID 的绑定，一般用于多地登录，踢掉前面登录的场景
 * @param tioConfig
 * @param userid
 */
public static void unbindUser(TioConfig tioConfig, String userid) {
    tioConfig.users.unbind(tioConfig, userid);
}
```

## 资源解绑方法的详细说明

1. **解绑业务 ID (`unbindBsId`)**  
   解除 `ChannelContext` 与业务 ID 的关联。常用于业务逻辑结束或用户下线时。

2. **解除与所有组的绑定关系 (`unbindGroup`)**  
   解除 `ChannelContext` 与所有群组的关联。这在清理用户状态、强制下线等场景中非常实用。

3. **解除与指定组的绑定关系 (`unbindGroup`)**  
   解除 `ChannelContext` 与特定群组的关联，可以用于从某个特定的群组中移除用户。

4. **解除绑定的 Token (`unbindToken`)**  
   解除 `ChannelContext` 与 Token 的关联，用于用户注销或身份验证失效时。

5. **解除绑定的用户 ID (`unbindUser`)**  
   解除 `ChannelContext` 与用户 ID 的关联，在用户下线或会话过期时使用。

6. **解除用户 ID 的绑定（用于多地登录场景） (`unbindUser`)**  
   通过 `TioConfig` 解除用户 ID 的绑定，一般用于多地登录的场景，如踢掉前面的登录用户。

通过这些解绑操作，可以确保 `ChannelContext` 不再与不必要的业务数据关联，有效地释放资源，防止业务逻辑中的冗余状态。

## 参考文献

[tiocloud 文档资料](https://www.tiocloud.com/doc/tio/?pageNumber=1)
