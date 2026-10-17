# Https建立连接过程
---

## 1. DNS 解析 & 建立 TCP 连接

```text
*   Host jieti.cc:443 was resolved
*   Trying 118.31.175.40:443…
*   Connected to jieti.cc (118.31.175.40) port 443
```

1. **DNS 解析**：curl 先向本地的 DNS 或者上游 DNS 服务器询问 `jieti.cc` 的 A/AAAA 记录。
2. **三次握手**：获得 IP（118.31.175.40）后，客户端发起 TCP SYN → 服务器回复 SYN-ACK → 客户端 ACK，至此 TCP 连接建立完毕。

---

## 2. TLS 1.3 握手阶段

```text
* ALPN: curl offers h2, http/1.1
* (1) TLS handshake, Client hello
* (2) TLS handshake, Server hello
* (…)
* (11) TLS handshake, Certificate
* (15) TLS handshake, CERT verify
* (20) TLS handshake, Finished
* (20) TLS handshake, Finished
* SSL connection using TLSv1.3 / AEAD-CHACHA20-POLY1305-SHA256
* ALPN: server accepted h2
* Server certificate:
    subject: CN=jieti.cc
    start date: Jun 16 06:36:38 2025 GMT
    expire date: Sep 14 06:36:37 2025 GMT
    subjectAltName: host "jieti.cc" matched cert's "jieti.cc"
    issuer: C=US; O=Let's Encrypt; CN=E6
* SSL certificate verify ok.
```

1. **ClientHello**：

   * 提供支持的 TLS 版本（TLS 1.3），加密套件（如 AEAD-CHACHA20-POLY1305-SHA256），以及扩展（SNI 主机名 `jieti.cc`、ALPN 协议意向等）。
2. **ServerHello**：

   * 服务器选定 TLS 版本与套件，并返回自己的密钥交换参数。
3. **证书传输与验证**：

   * 服务器发送 X.509 证书链；curl 用本地 CAfile（`/etc/ssl/cert.pem`）检查：

     * 证书链签名可信、CN/SAN 与请求主机名匹配、在有效期内。
4. **Finished 消息**：

   * 双方交换 Finished（握手摘要），验证对方握手完整性。
5. **安全通道就绪**：

   * TLS 1.3 只需一次 RTT（1-RTT），完成后即可加密数据。
6. **ALPN 协商**：

   * 客户端提供 `h2, http/1.1`，服务器选择了 `h2` → 后续使用 HTTP/2 传输。

---

## 3. HTTP/2 连接 & 请求发送

```text
* using HTTP/2
[HTTP/2] … OPENED stream for https://jieti.cc/
[HTTP/2] … [:method: GET]
[HTTP/2] … [:scheme: https]
[HTTP/2] … [:authority: jieti.cc]
[HTTP/2] … [:path: /]
[HTTP/2] … [user-agent: curl/8.7.1]
[HTTP/2] … [accept: */*]
> GET / HTTP/2
> Host: jieti.cc
> User-Agent: curl/8.7.1
> Accept: */*
* Request completely sent off
```

1. **连接前言（client preface）**：

   * HTTP/2 有一个固定的 24-byte 前言（`PRI * HTTP/2.0\r\n\r\nSM\r\n\r\n`），curl 已经隐式发送。
2. **SETTINGS 帧交换**（未显示在 `-v` 输出中）：

   * 客户端和服务器各自发送自己的 SETTINGS 配置。
3. **打开流**：

   * 客户端在流 ID=1 上发起一个新的请求流。
4. **HEADERS 帧**：

   * 所有请求元信息（伪头部 `:method`、`:path`、User-Agent 等）被打包成 HEADERS 帧并压缩发送。
5. **DATA 帧**：

   * GET 请求没有主体，因此无 DATA 帧，仅一个 HEADERS 帧。

---

## 4. 服务器响应

```text
< HTTP/2 200
< server: openresty
< date: Mon, 16 Jun 2025 07:41:45 GMT
< content-type: text/html
< content-length: 707
< last-modified: Mon, 16 Jun 2025 07:30:56 GMT
< etag: "684fc830-2c3"
< strict-transport-security: max-age=31536000
< accept-ranges: bytes
< 
<!doctype html>
<html>…
```

1. **HEADERS 回应**：

   * 流 ID=1 上服务器发回一个 HEADERS 帧，包含 `:status: 200` 以及各项 HTTP 响应头。
2. **DATA 帧**：

   * 紧跟着 DATA 帧，携带 HTML 文本（707 字节）。
3. **流关闭**：

   * 服务器发送一个 `END_STREAM` 标志，客户端读取完毕后，流 ID=1 正式关闭。

---

### 小结

1. **DNS → TCP**：解析域名并完成三次握手。
2. **TLS 1.3 握手**：1-RTT 完成密钥协商、证书验证与加密通道建立。
3. **ALPN 协商**：选择 HTTP/2。
4. **HTTP/2 通信**：发送前言、SETTINGS、HEADERS，数据复用与帧化传输。
5. **响应**：服务器同样通过帧化的 HEADERS+DATA 返回页面。

整个过程在时延上被最小化了：

* TLS 1.3 仅需一趟往返（1 RTT）
* HTTP/2 在同一连接上复用多路请求
* ALPN 避免了额外的协议升级。

这样就高效地完成了一个现代化 HTTPS 请求。