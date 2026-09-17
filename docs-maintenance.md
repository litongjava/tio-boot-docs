# 文档补全与维护记录

## 2026-09-15：tio-boot 核心文档检查

本次扫描了 719 个 Markdown 源文件，并按本地 `nexus.io` 源码核对核心启动、路由和测试行为。扫描只检查正文内可识别的本地 Markdown 链接与中文侧边栏，不验证外部站点、页内锚点或所有示例语义。

### 已补齐

- [Web Handler 方法与错误响应](<./docs/zh/06_web/32.md>)：完整 Java 示例、参数与状态码边界。
- [TioBootTest](<./docs/zh/17_tests/01.md>)：修正初始化、扫描、JUnit 注解和失败行为说明。
- [真实 HTTP 测试](<./docs/zh/17_tests/02.md>) 与 [数据库隔离测试](<./docs/zh/17_tests/03.md>)。
- [源码入口](<docs/zh/75_tio-boot/01.md>)、[启动与关闭](<docs/zh/75_tio-boot/03.md>)、[请求分发](<docs/zh/75_tio-boot/04.md>)。
- [底层 HTTP 服务与 tio-boot 的边界](<docs/zh/33_tio-http-server/06.md>)。
- [ApiTable 权限](<./docs/zh/10_api-table/10.md>) 与 [故障定位](<./docs/zh/10_api-table/11.md>)。
- 后台 [字段联动](<./docs/zh/65_tio-boot-admin/11.md>)、[Word](<./docs/zh/65_tio-boot-admin/12.md>)、[PDF](<./docs/zh/65_tio-boot-admin/13.md>) 管理：补充业务设计、SQL 和验收条件，不宣称已有转换/编辑服务。
- 历史部署页增加替代入口，多图上传补配置引用并取消示例中的 DROP TABLE，修正 PostgreSQL 依赖 XML 和 SMTP 地址链接。

### 验证范围

- `pnpm docs:check`：本地链接缺失 0，中文侧边栏缺失 0。
- 从章节原文提取 3 个 Java 代码块，以 JDK 21 和本地 tio-boot 2.1.4 运行时依赖编译通过。
- JUnit Platform 1.11.4 执行 ConfigurationTest 与 HttpIntegrationTest，共 3 项通过，包含真实网络请求和关闭服务。
- 数据库章节与 Word/PDF 字典 SQL 是设计说明，本次没有在业务数据库执行这些 SQL；第三方与真机能力未进行验收。
- `pnpm docs:build` 成功生成 720 个页面（含框架生成页），耗时 264.06 秒。构建仍提示大资源包及 15.2 MB 搜索 worker 未进入 PWA 预缓存；这不影响构建成功，但不能据此承诺搜索功能离线可用。

## 仍需独立完善的短内容页

当前检测到 29 个短页候选。以下清单是明确保留的缺口，不代表已补全。部分只有“待定/预留/数字”标题，没有可恢复的主题，不能据此编造接口；有主题的扩展页需结合对应项目源码、账号及运行环境继续完善。Oracle、微信登录等也不因核心章节已补齐就获得可运行承诺。

| 页面 | 当前标题 |
| --- | --- |
| [docs/en/1 Quick Start/1.0 Quick Start.md](<./docs/en/1 Quick Start/1.0 Quick Start.md>) | Quick Start |
| [docs/zh/10_api-table/06.md](<./docs/zh/10_api-table/06.md>) | 使用 api-table 连接 oracle |
| [docs/zh/43_netty-boot/07.md](<./docs/zh/43_netty-boot/07.md>) | 整合 Dubbo |
| [docs/zh/43_netty-boot/14.md](<./docs/zh/43_netty-boot/14.md>) | Reserve |
| [docs/zh/69_tio-im/06.md](<./docs/zh/69_tio-im/06.md>) | 登录 |
| [docs/zh/69_tio-im/07.md](<./docs/zh/69_tio-im/07.md>) | 历史消息 |
| [docs/zh/69_tio-im/08.md](<./docs/zh/69_tio-im/08.md>) | 发消息 |
| [docs/zh/36_groovy/02.md](<./docs/zh/36_groovy/02.md>) | 调试常用脚本 |
| [docs/zh/26_oceanbase/05.md](<./docs/zh/26_oceanbase/05.md>) | 待定 |
| [docs/zh/46_media/03.md](<./docs/zh/46_media/03.md>) | 待定 |
| [docs/zh/52_telegram4j/13.md](<./docs/zh/52_telegram4j/13.md>) | 处理回调查询 |
| [docs/zh/52_telegram4j/20.md](<./docs/zh/52_telegram4j/20.md>) | Telegram-Bot-Utils 使用指南 |
| [docs/zh/54_LLM/15.md](<./docs/zh/54_LLM/15.md>) | 待定 |
| [docs/zh/55_voice-agent/06.md](<./docs/zh/55_voice-agent/06.md>) | eleven labs |
| [docs/zh/57_ai_agent/09.md](<./docs/zh/57_ai_agent/09.md>) | 翻译 |
| [docs/zh/57_ai_agent/13.md](<./docs/zh/57_ai_agent/13.md>) | 自建 获取 youtube 字幕服务 |
| [docs/zh/57_ai_agent/15.md](<./docs/zh/57_ai_agent/15.md>) | 定向搜索 |
| [docs/zh/57_ai_agent/16.md](<./docs/zh/57_ai_agent/16.md>) | 16 |
| [docs/zh/57_ai_agent/17.md](<./docs/zh/57_ai_agent/17.md>) | 17 |
| [docs/zh/57_ai_agent/18.md](<./docs/zh/57_ai_agent/18.md>) | 18 |
| [docs/zh/60_java-uni-ai-server/04.md](<./docs/zh/60_java-uni-ai-server/04.md>) | 待定 |
| [docs/zh/62_java-kit-server/04.md](<./docs/zh/62_java-kit-server/04.md>) | 待定 |
| [docs/zh/62_java-kit-server/05.md](<./docs/zh/62_java-kit-server/05.md>) | 待定 |
| [docs/zh/62_java-kit-server/06.md](<./docs/zh/62_java-kit-server/06.md>) | 待定 |
| [docs/zh/73_tio-log-server/01.md](<./docs/zh/73_tio-log-server/01.md>) | 简介 |
| [docs/zh/73_tio-log-server/02.md](<./docs/zh/73_tio-log-server/02.md>) | 收集 docker 日志 |
| [docs/zh/73_tio-log-server/03.md](<./docs/zh/73_tio-log-server/03.md>) | 入库 |
| [docs/zh/66_第三方登录注册/06.md](<./docs/zh/66_第三方登录注册/06.md>) | 阿里云短信重置密码 |
| [docs/zh/66_第三方登录注册/08.md](<./docs/zh/66_第三方登录注册/08.md>) | 支付宝登录与绑定手机号 |

## 后续维护规则

1. 新章节应注明适用版本、依赖、必要配置、最小示例及验证范围。
2. 示例调用框架方法前核对源码签名；区分框架能力与业务约定。
3. 修改标题时同步目录摘要，新增页面时同步侧边栏。
4. 占位页清单用于安排写作，不用无关长文消除短页提示。
5. 使用 `pnpm docs:check` 和 `pnpm docs:build` 检查，不在维护脚本中连接或初始化用户数据库。

## 2026-09-16：2.1.5 框架与米旺联动升级

- tio-boot 和同 reactor HTTP 模块以 JDK 8 本地 install，tio-boot-admin 以 JDK 21 本地 install。已检查 jar 类文件版本：tio-boot 为 52，admin-base/web 为 65。
- 新增方法路由、RouteMatch/metadata、doBeforeRoute、RequestIdentity；修正拦截器合并及请求上下文释放时机。9 项路由测试、5 项请求链测试、1 项 admin 组合测试实际执行通过。
- 米旺迁移到方法路由、MiAuthInterceptor 与 DbPro；37 项测试通过，包含独立 PostgreSQL schema、JSONB、共享事务、真实 HTTP 方法/权限/HEAD/预检验证。服务在 8100 完成启动冒烟。
- 新增 [方法路由与业务鉴权](<./docs/zh/65_tio-boot-admin/19.md>)、[Db PostgreSQL 实践](<./docs/zh/09_java-db/32.md>)，同步路由源码说明、入门与相关目录。
- docs:check：721 个 Markdown，本地链接缺失 0、导航缺失 0；既有 29 个短页候选仍单独记录。
- docs:build：722 页面，272.26 秒成功。构建仍提示大 chunk 与 15.3 MB 搜索 worker 未预缓存。
- 本轮未执行生产数据库初始化 SQL；本地 Maven install 不代表已发布 Maven Central。

## 2026-09-16：章节重排、Redis 拆章与 AI 检索

- 熟悉文档后，按框架基础、数据库与中间件、网络通信、集成扩展、AI 和项目实践梳理入口。第 18—23 章统一为 `18_mybatis`、`19_redis`、`20_mongodb`、`21_elastic-search`、`22_mq`、`23_kafka`。
- Redis 从缓存章迁出 9 篇文章，新增 [Docker 安装](./docs/zh/19_redis/00.md) 与章节导读。缓存章保留 Caffeine、CacheUtils 和 Ehcache；Kafka 与 AWS MSK 从 MQ 独立出来。
- 按用户说明移除 Manim 独立章节，其余章节保持原先相对顺序并连续编号为 71 章，最后三章为性能测试、tio-boot 源码和案例。
- 同步正文链接、侧边栏、顶部导航和目录摘要。目录迁移表见 [chapter-migration.json](./scripts/chapter-migration.json)，页面迁移表见 [legacy-paths.json](./docs/.vuepress/config/legacy-paths.json)。构建生成静态跳转页与 Cloudflare Pages 的 _redirects；仅大小写变化的旧地址在 Windows 静态产物中的限制见 [AI 检索说明](./docs/ai-retrieval.md)。
- 按本地 java-db 源码修正 RedisDb、IRedisCallback、配置注解与连接释放，重写 Jedis 连接池入门，纠正重复提交示例的原子性错误、分布式锁释放和两级缓存一致性描述。Kafka Java 包仍保留源码中真实存在的 `admin.kafaka` 并作说明。
- 新增安装文档区分有密码和无密码模式，补全 host 网络适用条件、认证验证、持久化和应用连接参数；未实际启动 Docker 或 Redis 服务。
- AI 构建产物包含分章节 llms.txt、llms-full.txt、章节正文、单页 Markdown、JSON 页面目录、按标题分段的 JSONL 与内容哈希。兼容 Windows 换行；分段避开代码块内部标题，原文转换不修改代码块内的 Markdown 示例。
- 验证：本地链接、导航、遗漏页面、章节编号均无错误；检查 814 个已跟踪文件的迁移目标，除明确删除的 Manim 页面外无文件缺失；从正文提取 RedisQuickStart、RedisConfiguration、JedisPoolExample、SubmissionGuard 四个示例，使用 JDK 21 与本地依赖编译通过。
- 既有 29 个短内容候选继续保留在维护清单中，本次未将它们伪装为已完成的功能说明。源码工程未修改。
- 本轮构建成功：724 篇源文档、725 个生成页面，耗时 223.39 秒；AI 产物验证通过，包含 9,067 个分段和 452 个静态跳转页。当时尚未支持完整离线缓存，后续离线实现与验证见下一节。

## 2026-09-16：离线搜索与完整 AI 语料

- **支持并验证离线搜索与 AI 语料使用**：首次联网等待 [AI 检索页面](./docs/ai-retrieval.md) 显示“离线已就绪”后，可在同一浏览器、同一站点地址断网搜索、打开及刷新结果页、读取语料并下载到本地。
- 搜索、AI 语料与旧路径映射先生成，PWA 最后生成；提高单文件缓存上限，并对必需文件执行完整性校验。缓存清单记录资源版本、体积和内容修订号；状态组件核查实际 Cache Storage，不用 localStorage 标志冒充下载完成。
- 修复搜索插件预编译 worker 与 slimsearch 2.3.0 序列化格式不兼容的问题，为 search-pro rc.59 固定匹配的 slimsearch 2.1.1。修复延迟加载注册库错过 window.load 后未注册 Service Worker 的问题。
- 使用空挂载点的专用离线页面入口，避免用首页 SSR HTML 刷新深层文档时发生 hydration 错误。离线下载先通过 fetch 读取缓存，再保存 Blob，避免普通下载链接绕过缓存后被浏览器取消。
- 缓存缺失时不显示就绪；用户联网点击重试可重新安装并补全缓存。新版本完整下载后可应用更新。浏览器清理或回收站点缓存后需重新准备；外部网站、外链图片和远程模型 API 不属于离线范围，下载的 JSONL 可由本地检索工具直接读取。
- 最终构建成功，耗时 294.48 秒；离线清单校验通过，包含 1,545 项资源及清单文件本身，约 95.3 MB。AI 校验通过：724 篇文档、9,080 个分段、452 个静态跳转页。
- Chrome 153.0.8010.37 实际测试：清除普通 HTTP 缓存、设置浏览器离线并让临时服务器拒绝全部请求后，搜索、结果页刷新、新标签页打开、804 个 AI 文件读取及完整 JSONL 下载均通过。另验证缓存缺失不误报、联网重试补全，以及首次下载中断后的恢复；3 项测试全部通过，耗时 38.1 秒。
- 复验命令：`pnpm docs:check-offline`、`pnpm docs:test-offline`。后者使用 Playwright Chromium，或通过 `PLAYWRIGHT_CHANNEL=chrome` 使用已安装的 Chrome。构建仍有资源体积提示；其他浏览器未做实测，以实际“离线已就绪”状态为准。
