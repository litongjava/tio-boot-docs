# 视频配套 PPT 的生成、存储与下载

Manim 合成接口会将场景图片按文件名排序，每张图片生成一页幻灯片，输出 `combined.pptx`。这种方式能保留视频画面的排版，方便讲解、复习和分享。幻灯片内容以图片呈现，并非可逐项编辑的文本与图形。

## 合成与上传

调用 `GET /manim/finish`，参数包括 `session_id`、可选的 `watermark` 和 `storage_platform`。指定 `aws_s3` 上传到 S3，指定 `aliyun_oss` 上传到 OSS；未指定存储平台时返回本地静态资源相对地址。业务服务按区域配置选择平台。

视频、带水印视频、音频和 PPT 分别处理上传结果。无场景图片或未获得有效上传结果时，`ppt` 为空；前端可据此显示“PPT 暂不可用”。

接口使用 `RespBodyVo` 包装，`data.ppt` 为 PPT 地址；`data.video` 为视频地址，`data.output` 为用于下载的视频地址，`data.audio` 为音频地址。

```java
import nexus.io.linux.JavaKitClient;
import nexus.io.linux.VideoFinishRequest;
import nexus.io.tio.utils.commandline.ProcessResult;
import nexus.io.tio.utils.environment.EnvUtils;

public class PresentationExample {
  public String finish(long sessionId) {
    VideoFinishRequest request = new VideoFinishRequest(sessionId, "My Professor");
    request.setStorage_platform("aws_s3");
    ProcessResult result = JavaKitClient.finishManimSession(
        EnvUtils.get("java.kit.internal.url"),
        EnvUtils.get("java.kit.key"), request);
    if (result == null) {
      throw new IllegalStateException("Missing finish result");
    }
    return result.getPpt();
  }
}
```

## 业务数据库与接口

部署业务后端前执行 `db/video_ppt.sql`。迁移为 `ef_generated_video`、`ef_user_video` 和已有的 `ef_ugvideo` 添加可为空的 `ppt_url` 文本字段，可重复执行。

合成完成后，业务服务保存 `ppt` 地址到生成记录与当前视频记录，再处理后续字幕；同时推送 `ppt` 事件。视频详情返回 `ppt_url`，复用视频从关联的生成记录补齐该字段。

业务下载入口为 `GET /api/v1/video/ppt/download?id=<视频ID>`，支持 HEAD 和 Range。服务端从数据库读取文件地址，并复用视频的访问权限：公开视频可直接下载，私有视频需所属用户登录。令牌识别在拦截器完成。

PPT 和视频共用文件名规则：优先采用生成标题，其次使用视频标题，替换非法字符、限制标题长度；没有有效标题时使用 `video-<ID>`。两者只分别采用 `.pptx` 和 `.mp4` 扩展名。响应通过 `Content-Disposition` 提供 UTF-8 中文文件名。

播放器在视频下载按钮旁提供 PPT 下载按钮。前端携带登录令牌，并用 `redirect=false` 让业务后端中转文件，避免对象存储跨域配置影响下载；文件名优先读取响应头。

## 部署与历史记录

先执行数据库迁移，再部署包含合成逻辑的 java-kit-server、业务后端和前端。更新后的 java-kit-server 应与支持 `RespBodyVo` 解包的客户端配套使用。

历史记录的 `ppt_url` 保持为空，不会推测对象存储地址。若已有历史 PPT，可核实文件存在后补录对应地址；未补录时按钮显示暂不可用。没有 PPT 的历史视频仍可播放与下载。


### 批量补录已上传的历史 PPT

对于视频地址符合 `data/combined/<sessionId>/combined.mp4` 或 `combined_watermark.mp4` 的记录，可将同目录的 `combined.pptx` 作为待核验地址。保留原有存储域名和会话目录，不把视频记录 ID 当成会话 ID，也不跨存储平台猜测地址。

推荐按以下顺序执行：

1. 保存待处理记录的 ID、视频地址、原始 `ppt_url` 和关联关系，按候选地址去重。
2. 限制并发、请求超时和文件大小，读取候选文件。HTTP 成功和 `PK` 文件头只能作为初步检查；完整核验应检查 ZIP CRC、内容类型清单、演示文稿 XML、关系文件和至少一页幻灯片 XML。
3. 对验证通过的文件，在事务中仅更新空的 `ppt_url`；同时检查源视频地址和关联关系未改变，避免覆盖运行期间的新数据。
4. 同步生成记录与关联用户视频，提交后回读确认。保留逐项结果，区分成功、已存在、无候选地址、文件不存在、权限或网络异常。

没有 MP4 地址的记录不按此规则补录；这些记录需要从合成日志或保留的场景资料中另行定位，不能据此认定 PPT 一定不存在。补录只更新数据库地址，不重新生成视频、不重新上传已有 PPT。
