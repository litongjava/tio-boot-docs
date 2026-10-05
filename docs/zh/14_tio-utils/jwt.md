# JWT 签发与校验

`JwtUtils` 提供 HS256 令牌签发、签名校验及用户标识读取。认证入口先调用 `verify`，验证成功后再读取载荷；`getPayload`、`parseUserIdString` 等读取方法不代表已经认证。

## 校验约定

- token 必须是三个非空片段，末尾额外的分隔符也会被拒绝。
- 空 token、签名不匹配、非法 Base64、缺失或非法 exp 返回 false；密钥缺失等服务端配置错误应由启动配置检查处理。
- 签名使用 HS256，header 中的 alg 必须与之一致；签名比较使用固定时间比较工具。
- exp 使用 Unix 秒级整数；当前时间达到 exp 时即失效。历史约定 exp=-1 表示不限到期时间，应优先使用有限有效期。
- 兼容历史生成的带 Base64URL 填充的令牌。用户 ID 可以为数字或字符串，数字转换方法仍会拒绝非数字或溢出的 ID。
- 业务仍应检查用户是否启用、token 版本、资源权限，以及实际需要的 issuer、audience、nbf 等约束。此工具不替代第三方身份提供商的专用验证流程。

## 示例

```java
import nexus.io.tio.utils.environment.EnvUtils;
import nexus.io.tio.utils.jwt.JwtUtils;

public class LoginTokens {
  private static String signingKey() {
    String key = EnvUtils.get("app.jwt.secret");
    if (key == null || key.isEmpty()) {
      throw new IllegalStateException("请配置 app.jwt.secret");
    }
    return key;
  }

  public static String issue(Long userId) {
    long expiresAt = System.currentTimeMillis() / 1000 + 3600;
    return JwtUtils.createTokenByUserId(signingKey(), userId, expiresAt);
  }

  public static String authenticatedUserId(String token) {
    if (!JwtUtils.verify(signingKey(), token)) {
      return null;
    }
    return JwtUtils.parseUserIdString(token);
  }
}
```

将 `authenticatedUserId` 的调用放在认证拦截器中；返回 null 时构造 401 响应，成功时把用户标识写入请求上下文。不要把仅解码得到的用户标识直接作为登录身份，也不要记录完整 token。

到期语义参考 [RFC 7519 的 exp 定义](https://www.rfc-editor.org/rfc/rfc7519.html#section-4.1.4)。
