# 视频尺寸与布局选择

首页支持按照页面语言显示生成模式，并提供尺寸、布局选择。尺寸决定视频画布比例，布局决定主要构图方式，两者可以自由组合。

## 请求参数

`POST /api/explanation/video` 的 JSON 请求增加两个可选字段，省略时保持原有横屏布局。

| 字段 | 默认值 | 可选值 |
| --- | --- | --- |
| `size` | `pc` | `pc`：16:9 横屏；`mobile`：9:16 竖屏 |
| `layout` | `1` | `1`、`2`、`3`、`4`，均为字符串 |

| 布局 | 标题区 | 主体构图 |
| --- | --- | --- |
| 1 | 有 | 主要为文左、图右 |
| 2 | 有 | 主要为图左、文右 |
| 3 | 有 | 以图为主，不强制独立文字栏 |
| 4 | 无独立标题区 | 全画面以图为主 |

布局 2 按与布局 1 镜像的含义实现。左右分栏是主要偏好，允许根据内容调整比例；手机画布中若左右布局无法保持可读性，可以改为上下组织。以图为主仍允许必要文字、公式、标签和字幕。

```json
{
  "question": "解释勾股定理",
  "language": "zh",
  "mode": "fast",
  "size": "mobile",
  "layout": "3",
  "voice_provider": "openai",
  "voice_id": "shimmer"
}
```

登录回跳、表单提交和重新生成都会保留这两个参数。生成模式跟随界面语言显示：中文为快速模式、思考模式、专家模式，英文为 Fast、Thinking、Expert。

## 提示词与执行

请求先经过 token 拦截器，再由校验工具调用 `ParameterValidator` 验证参数。无效尺寸或布局通过全局异常处理器返回 HTTP 400 和 `RespBodyVo`，不会提前开启 SSE。

生成提示词末尾包含本次请求的画布与构图要求，并明确其优先于通用示例。相同要求贯穿初次生成、后续场景和代码修复，避免修复时回到默认布局。

Manim 执行请求通过 `ExecuteCodeRequest.size` 传递尺寸。执行服务设置像素尺寸和逻辑画布，生成完成后按实际高度与帧率定位产物目录。高质量横屏为 1920×1080，竖屏为 1080×1920；其他质量档位按相同方式交换宽高。逻辑画布横屏宽高为 128/9 与 8，竖屏为 8 与 128/9。

```java
import nexus.io.linux.ExecuteCodeRequest;
import nexus.io.linux.JavaKitClient;
import nexus.io.tio.utils.commandline.ProcessResult;
import nexus.io.tio.utils.environment.EnvUtils;
import nexus.io.tio.utils.snowflake.SnowflakeIdUtils;

public class PortraitVideoExample {
  public ProcessResult render(String code) {
    ExecuteCodeRequest input = new ExecuteCodeRequest(code);
    input.setSessionId(SnowflakeIdUtils.id());
    input.setId(SnowflakeIdUtils.id());
    input.setQuality("h");
    input.setSize("mobile");
    input.setTimeout(300);
    return JavaKitClient.executeManimCode(
        EnvUtils.get("java.kit.internal.url"),
        EnvUtils.get("JAVA_KIT_API_KEY"), input);
  }
}
```

`POST /manim/run` 支持查询参数 `size`。请求正文仍为 Python 代码，带图形数据时继续使用已有 multipart 上传方式。成功 JSON 响应采用 `RespBodyVo.ok(ProcessResult)`；Java 客户端同时兼容统一响应体和原有直接返回 `ProcessResult` 的服务。直接调用接口的客户端需要读取 `data` 中的执行结果。

语音与字幕服务不负责画布构图，不需要新增尺寸参数。java-kit-server 集成更新后的 Manim 服务和 Java 客户端，并与现有语音服务一起构建。

## 部署与验证

部署需要使用本次重新打包的 java-kit-server，并同步生成后端和前端。Java 客户端需随调用方一起更新，以读取统一响应体。切换服务时应等待现有生成任务结束，保持同一视频的场景使用相同尺寸。

本地验证已覆盖：前端类型检查和构建、中英文模式显示、390 像素视口、登录回跳参数、两种尺寸与四种布局提示词、无效参数、横竖屏 Manim 短片渲染与 ffprobe 宽高核验。完整生成、语音、字幕、HLS 与下载联调等待服务部署完成后进行。
