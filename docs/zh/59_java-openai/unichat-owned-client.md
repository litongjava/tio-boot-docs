# UniChatClient 与调用方 HTTP 客户端

UniChatClient 统一处理聊天请求和响应。同步生成支持按平台选择 Chat Completions、Gemini/Vertex AI、Anthropic Messages 或 Responses 协议，并使用调用方提供的 `OkHttpClient`，按业务设置超时、重定向和重试策略，并复用连接池。

指定 `platform` 后，SDK 会选择该平台的服务地址和密钥配置。例如 `ModelPlatformName.DEEPSEEK` 已对应 DeepSeek 默认地址，无需再调用 `request.setApiPrefixUrl("https://api.deepseek.com/v1")`。

## 推荐用法：由平台解析地址和密钥

应用启动时加载配置（如 `EnvUtils.load()`），配置文件可设置：

```properties
ai.platform=deepseek
ai.model=deepseek-flash
```

通过环境变量或受控配置提供 `DEEPSEEK_API_KEY`。无需重复配置默认服务地址，也无需在业务代码中读取 DeepSeek 专用密钥。

```java
import java.util.List;
import java.util.concurrent.TimeUnit;
import nexus.io.chat.UniChatClient;
import nexus.io.chat.UniChatMessage;
import nexus.io.chat.UniChatRequest;
import nexus.io.chat.UniChatResponse;
import nexus.io.consts.ModelPlatformName;
import nexus.io.deepseek.DeepSeekModels;
import nexus.io.tio.utils.environment.EnvUtils;
import okhttp3.OkHttpClient;

public class BusinessDraftClient {
  private static final OkHttpClient CLIENT = new OkHttpClient.Builder()
      .connectTimeout(10, TimeUnit.SECONDS)
      .readTimeout(45, TimeUnit.SECONDS)
      .callTimeout(45, TimeUnit.SECONDS)
      .retryOnConnectionFailure(false)
      .followRedirects(false)
      .followSslRedirects(false)
      .build();

  public String generate(String confirmedText) throws Exception {
    UniChatRequest request = new UniChatRequest(
        EnvUtils.get("ai.platform", ModelPlatformName.DEEPSEEK),
        EnvUtils.get("ai.model", DeepSeekModels.deepseek_flash));
    request.setSystemPrompt("只整理用户已提供的事实，保留条件和不确定措辞。")
        .setMessages(List.of(UniChatMessage.buildUser(confirmedText)))
        .setStream(false)
        .setMax_tokens(4096);
    UniChatResponse response = UniChatClient.generate(CLIENT, request);
    return response.getMessage().getContent();
  }
}
```

切换平台时同时设置对应模型及平台密钥，例如 `ai.platform=gitee` 时提供 `GITEE_API_KEY`。SDK 不会根据平台自动替换模型名称。

## 两个调用重载与配置优先级

```java
// 优先使用 request.apiKey；未设置时按 platform 从 EnvUtils 读取。
UniChatResponse response = UniChatClient.generate(client, request);

// 临时指定密钥；key 可以为 null、空字符串或纯空白。
UniChatResponse another = UniChatClient.generate(client, key, request);
```

两个重载使用相同的解析和发送逻辑：

- 地址：非空白 `request.apiPrefixUrl` → 平台的 `*_API_URL` 配置 → SDK 内置地址（配置项未设置时）。
- 密钥：非空白方法参数 `key` → 非空白 `request.apiKey` → 平台的 `*_API_KEY` 配置。
- 地址最终为空时，在发送前抛出 `IllegalArgumentException`。将 URL 配置显式设为空字符串不会启用内置地址，应删除该配置项以使用默认值。
- 密钥最终为空时不发送 `Authorization` 头，支持不需要鉴权的本地服务；需要鉴权的平台仍必须提供有效密钥，否则由服务端返回鉴权错误。

这两个自定义客户端重载在调用时读取 `EnvUtils`，无需向请求写回地址或密钥。旧的无客户端入口部分配置使用静态常量，仍应在首次使用 SDK 前加载配置。

已有 `generate(null, request)` 源码因新增重载存在类型歧义，可改为 `generate(request)`，或明确写成 `generate((String) null, request)`。

## 平台配置

平台路由覆盖 `generate(String key, UniChatRequest request)` 中的同步平台。下面先列出 Chat Completions 兼容平台：URL 配置为 API 前缀，SDK 会追加 `/chat/completions`，不要传入完整接口路径或末尾斜杠。

| platform | URL 配置项 | 密钥配置项 | 内置地址 |
| --- | --- | --- | --- |
| `openai` | `OPENAI_API_URL` | `OPENAI_API_KEY` | 有 |
| `deepseek` | `DEEPSEEK_API_URL` | `DEEPSEEK_API_KEY` | 有 |
| `volcengine` | `VOLCENGINE_API_URL` | `VOLCENGINE_API_KEY` | 有 |
| `openrouter` | `OPENROUTER_API_URL` | `OPENROUTER_API_KEY` | 有 |
| `zenmux` | `ZENMUX_API_URL` | `ZENMUX_API_KEY` | 有 |
| `bailian` | `BAILIAN_API_URL` | `BAILIAN_API_KEY` | 有 |
| `tencent` | `TENCENT_API_URL` | `TENCENT_API_KEY` | 有 |
| `minimax` | `MINIMAX_API_URL` | `MINIMAX_API_KEY` | 有 |
| `moonshot` | `MOONSHOT_API_URL` | `MOONSHOT_API_KEY` | 有 |
| `cerebras` | `CEREBRAS_API_URL` | `CEREBRAS_API_KEY` | 有 |
| `gitee` | `GITEE_API_URL` | `GITEE_API_KEY` | 有 |
| `llm-proxy` | `LLM_PROXY_API_URL` | `LLM_PROXY_API_KEY` | 有，本地代理 |
| `exchange_token` | `EXCHANGE_TOKEN_API_URL` | `EXCHANGE_TOKEN_API_KEY` | 有 |
| `exchange_token_us` | `EXCHANGE_TOKEN_US_API_URL` | `EXCHANGE_TOKEN_API_KEY` | 有 |
| `aiapi` | `AIAPI_API_URL` | `AIAPI_API_KEY` | 有 |
| `ollama` | `OLLAMA_API_URL` | `OLLAMA_API_KEY` | 无，需配置 |
| `llamacpp` | `LLAMACPP_API_URL` | `LLAMACPP_API_KEY` | 无，需配置 |
| `vllm` | `VLLM_API_URL` | `VLLM_API_KEY` | 无，需配置 |
| `swift` | `SWIFT_API_URL` | `SWIFT_API_KEY` | 无，需配置 |
| `titanium` | `TITANIUM_API_URL` | `TITANIUM_API_KEY` | 无，需配置 |

原生协议使用独立的请求和响应转换，不会发送到 `/chat/completions`：

| platform | URL 配置项 | 密钥配置项 | 请求路径与鉴权 |
| --- | --- | --- | --- |
| `google` | `GEMINI_API_URL` | `GEMINI_API_KEY` | `/{model}:generateContent`，`x-goog-api-key` |
| `vertex_ai` | `VERTEX_AI_API_URL` | `VERTEX_AI_API_KEY` | `/{model}:generateContent`，`x-goog-api-key`，沿用现有 API key 模式 |
| `exchange_token_google` | `EXCHANGE_TOKEN_GOOGLE_API_URL` | `EXCHANGE_TOKEN_API_KEY` | `/{model}:generateContent`，`x-goog-api-key` |
| `exchange_token_us_google` | `EXCHANGE_TOKEN_US_GOOGLE_API_URL` | `EXCHANGE_TOKEN_API_KEY` | `/{model}:generateContent`，`x-goog-api-key` |
| `anthropic` | `CLAUDE_API_URL` | `CLAUDE_API_KEY` | `/messages`，`x-api-key` 与 `anthropic-version` |
| `exchange_token_anthropic` | `EXCHANGE_TOKEN_API_URL` | `EXCHANGE_TOKEN_API_KEY` | `/messages`，`x-api-key` 与 `anthropic-version` |
| `exchange_token_us_anthropic` | `EXCHANGE_TOKEN_US_API_URL` | `EXCHANGE_TOKEN_API_KEY` | `/messages`，`x-api-key` 与 `anthropic-version` |
| `openai_responses` | `OPENAI_RESPONSES_API_URL` | `OPENAI_RESPONSES_API_KEY` | `/responses`，Bearer |
| `volcengine_responses` | `VOLCENGINE_RESPONSES_API_URL` | `VOLCENGINE_RESPONSES_API_KEY` | `/responses`，Bearer |

上述原生平台均有内置地址。Google 系列配置的是以 `/models` 结尾的前缀；Anthropic 和 Responses 配置 API 前缀。Responses 专用密钥为空时，分别回退读取 `OPENAI_API_KEY` 或 `VOLCENGINE_API_KEY`。

例如，只需将请求平台和模型改为 `ModelPlatformName.GOOGLE` 与对应 Gemini 模型，配置 `GEMINI_API_KEY`，仍调用 `UniChatClient.generate(CLIENT, request)`。SDK 会发送 Gemini 的 `contents`，使用 `x-goog-api-key`，再将候选消息和用量转换为 `UniChatResponse`。

未指定的平台或其他平台名沿用原方法的 OpenAI 默认分支；这不表示 SDK 为该名称内置了供应商地址。自定义兼容服务可通过 `request.setApiPrefixUrl(...)` 覆盖地址。

同步平台参数沿用原入口的转换逻辑：火山引擎未指定 `max_tokens` 时默认使用 `16384`，百炼设置 `enable_thinking=false`，Anthropic 默认使用 `64000`。Google 将输出上限转换为 `maxOutputTokens`，将 `json_object` 转换为 `application/json`；Responses 使用 `input` 与 `max_output_tokens`。这些转换作用于发送的载荷，不修改调用方的请求对象。

## 支持范围与响应处理

这两个重载适用于上述平台的同步生成，所有协议实际使用传入的 `OkHttpClient`，包括其超时、拦截器、代理、连接池与重试设置。`stream=true` 会在发送前被拒绝；流式调用继续使用现有 `stream(...)` 入口。

SDK 不设置固定的响应体大小上限，成功响应会完整读取并解析。非成功状态、非法 JSON 或缺少消息的响应会抛出异常，相关错误信息不包含供应商响应正文。SDK 负责关闭 HTTP 响应，并将模型、消息、用量和原始响应转换为 `UniChatResponse`。

连接客户端由调用方管理，重载不会改写共享客户端，也不会额外执行应用层重试。业务可结合原请求编号记录调用状态，对未知结果先核验再决定后续操作。结构化生成建议仍应经过业务字段、长度、来源与权限校验后再采用。
