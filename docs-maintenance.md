# 文档补全与维护记录

## 2026-10-04：补充 getBearerToken()

- 根据本地 t-io 源码补充 [HttpRequest](./docs/zh/06_web/15.md) 的 `getBearerToken()`：精确前缀、缺失值、原值回退、空白保留，以及提取与鉴权的区别。
- [身份验证](./docs/zh/31_authentication/02.md) 示例改用框架方法提取 Authorization，不再手工 split。
- `tio-http-common 2.1.7` 使用 JDK 8 构建并安装到本地 Maven 仓库，10 项模块测试通过，其中新增 3 项 Bearer token 行为测试。

## 2026-10-03：部署文档扩到 Linux，数据库脚本合并，61 章目录重建

### 部署文档（38 章）

- [Windows 与 Linux 部署](./docs/zh/61_knowledge-base/38.md) 由单章 Windows 说明改写为两种系统各一节：数据库准备（Windows 编译 pgvector、Linux 源码编译、放开监听/认证/防火墙、WSL 访问宿主机的地址写法）、本地配置、初始化脚本、Windows 部署、Linux 部署（apt 工具链、构建、脚本启动、nginx + JAR、systemd）、部署验证、检索与多轮问答。
- 新增国内网络加速一节，给出 apt、npm、Maven 三处镜像配置，并记录实测对比：同一批软件包走 `archive.ubuntu.com` 时 34.6 MB 约 5 分钟，换中科大镜像后 15 秒完成。
- 新增配图三张：Windows 侧模型设置与登录后界面、Linux 侧 nginx 提供前端并反向代理接口的界面。
- 验证小节给出两段可直接运行的代码（JDBC 检查表数量、JDK HTTP 客户端调用登录接口），SQL 用文本块书写。

### 数据库脚本合并

- 原 `scripts` 下的 13 个编号脚本（`init-db.sql` 与 `002`–`013`）合并为 `db/schema.sql`、`db/seed.sql`、`db/reset.sql`：结构、初始数据、清空重建各自一个文件，全部幂等。
- 合并后与线上库逐项比对：29 张表、53 个索引、8 个约束、3 个扩展、375 个列完全一致；重复执行与「先 reset 再重建」都验证通过。
- 初始化脚本改为读 `db` 目录，Windows 支持省略 `-PostgresBin`（改用 PATH 上的 psql）与 `-Reset`；新增 Linux 版 `Initialize-Database.sh` 与 `Start-Local.sh`，启动脚本改用前端目录 `java-maxkb-ui`。

### 61 章目录重建

- 章节导航（[readme.md](./docs/zh/61_knowledge-base/readme.md)）与站点侧边栏（`docs/.vuepress/config/sidebar-zh.json`）与目录内容对不上：侧边栏漏登记 31、33、34、36、37、38 六页，并保留了一份不存在的 88 页；导航里的 41 章标题与正文不符，另外列着并不存在的 42 章。
- 按现有文件重建两处目录：补齐 6 页、删掉 88 与 42 两条、按正文标题修正 38 与 41。删掉空的 `61_knowledge-base-exec-backup` 目录——它让「章节编号与目录顺序」校验从 62 章起全部失败。
- 顺带修掉 [分段预览](./docs/zh/61_knowledge-base/29.md) 里指向已不存在章节的悬空链接，以及[文档解析优化](./docs/zh/61_knowledge-base/19.md)里对 38 章的旧标题引用。
- 审计结果：793 篇文档，缺失链接 0、缺失导航 0、未登记页面 0、章节错误 0。

## 2026-10-03：配图统一到 assets，Resps 下载与导出方法落文

### 配图目录统一

- 散落在章节目录下的配图与两个资源目录（`images`、`readme_files`）合并为每章的 `assets` 目录，共迁移 114 个文件；正文引用、章节说明与历史跳转映射同步改写，涉及 111 篇 Markdown 与 1 份跳转配置。
- 资源目录说明页标题由 `# images` 改为 `# assets`，章节导航里的入口文字同步改名。
- 站点级资源（`.vuepress/public` 下的图标、分享图与退役脚本）保持原位：它们是站点骨架，不是章节配图。
- 迁移后核对：文档下不再有 `images`、`readme_files` 目录，也没有落在 `assets` 之外的配图。

### Resps 的下载与导出方法

- [Resps](./docs/zh/06_web/17.md) 从方法清单改写为能力说明：文本与数据响应、静态文件与错误页、二进制与下载、文档与图片导出四组，每组给出带 import 的示例与参数表，末尾补方法一览与使用要点。
- 新增方法的文档化：`excel`、`excelXls`、`pdf`、`docx`、`doc`、`pptx`、`ppt`、`image`、`download`、`contentDisposition`，以及四个文档类型常量；同一页说明两件事的分工 —— 生成文件内容属于业务侧，`Resps` 只负责正文与响应头。
- [文件下载](./docs/zh/06_web/10.md) 增补「用文档类型方法直接下载」一节，给出按类型一行返回的写法与中文文件名的编码行为。
- [EasyExcel 导出](./docs/zh/16_api-table/08.md) 增补「写入器的统一行为」与「自己发送导出结果」两节：说明共用写入器的列宽、左对齐与转换器约定，显式声明表头的写法，以及一步到位发送与自行发送的差别。

### 顺带修订的文档问题

- `61_knowledge-base` 的章节导航与目录内容已经对不上：23/24 两条的标题与文件相反，31、33、34 三条指向已被重排走的文件。按现有文件重建导航，并把侧边栏补齐到 38 项（新增 7 页、调整 2 页顺序）。
- `50_payment` 的侧边栏缺一篇正文，已登记；该章一篇正文里指向请求章节的链接多退了一级目录，已修正。
- `61_knowledge-base` 两处正文链接仍指向旧编号（独立用户、补丁维护），已改到当前文件。
- 审计结果：缺失链接 0、缺失导航 0、未登记页面 0。章节编号漂移保持现状 —— 与既有维护记录一致，不在本轮顺手改动。

## 2026-10-01：改为在线浏览与按需下载

- 移除整站离线预缓存、PWA 插件与依赖、离线状态组件和更新弹窗。站内搜索、章节别名、历史跳转和 AI 数据产物继续保留。
- AI 检索页使用普通下载链接提供完整语料、检索目录和完整文档；资源按需获取，保存后的文件可用于本地离线检索。同步项目 README 与测试命令。
- 保留小型 `service-worker.js` 退役脚本及对应缓存响应头。新访客不注册 Service Worker；已安装旧版的浏览器更新后，清理 `tio-boot-docs` 名称及当前作用域对应的缓存，注销旧注册并重新打开当前地址，保留查询参数、锚点和其他应用数据。带 `repair` 查询参数的旧注册同样适用。
- 将原断网测试替换为在线搜索、按需下载、新访客无预缓存、旧缓存退役和稳定地址验证；测试入口为 `pnpm docs:test`。部署时需保留退役脚本，其他静态服务器应让该地址返回 JavaScript 并设置 `Cache-Control: no-cache`。
- 验证通过：依赖锁文件安装、文档审计、完整构建（780 页）、AI 产物检查（779 篇文档、9,696 个分段、3,115 个跳转页）。浏览器及产物回归共 7 项通过：3 项旧版本退役测试，以及 4 项最终产物、别名、搜索与下载测试。三个下载文件的 SHA-256 均与构建文件一致。
- 最终产物不再包含离线清单、离线页面、PWA manifest 或 Workbox 文件；新访客无 Service Worker 注册、无 Cache Storage 项目，也未自动请求全站 AI 语料。保留的退役脚本约 1 KB。已有 Sass、浏览器兼容数据及大 chunk 提示不影响本次构建；本轮未部署。

## 2026-10-01：按学习路径重排章节

- 按入门、部署与日志、核心开发、数据访问、缓存与消息、认证、网络、集成、Firebase 与 Clerk、多媒体、AI、项目实战和进阶原理组织 13 个导航分组。
- 78 个章节统一采用 `序号_英文` 目录名，Logback 从入门迁入独立日志章；AIO 在 t-io 前，tio-log-server 保持独立项目，SIP 后依次为 Admin 和案例。
- 新增[文档阅读导航](./docs/zh/guide.md)，为 Web 开发增加主题分组；同步各章 README、站内链接、历史跳转及相关源码仓库 README 引用。
- 当前分组与目录清单见 [chapter-layout.json](./scripts/chapter-layout.json)，历史地址保存在迁移映射中。
- 78 个章节提供不带序号的稳定别名，10 份源码仓库 README 已使用对应别名；文章地址同样可省去章节序号。静态跳转和客户端路由均保留查询参数与锚点。尚未发布到线上。
- 核对 879 个迁移前章节文件，迁移目标无遗漏。文档审计覆盖 779 篇 Markdown，本地链接、导航、遗漏页面及章节编号错误均为 0；既有 37 个短页候选保留。
- 完整构建成功生成 780 个页面；AI 校验覆盖 779 篇文档、9,696 个分段、3,115 个跳转页。Cloudflare 跳转规则为 1,896 条静态规则和 100 条动态规则。
- Chrome 验证 6 项功能场景通过，包括稳定别名、历史地址、断网跳转、搜索与语料下载、缺失缓存修复及中断恢复。其中一项测试最初因页面有多个一级标题导致选择器不唯一，改为精确定位标题后单独复验通过。
- 本次重排验证时离线缓存清单为 1,662 项资源、约 102.7 MiB；后续已按用户决定移除整站离线缓存，见上方记录。重排构建与浏览器验证后，仅修正 AI 检索说明中的旧目录大小写描述及补充本记录，当时未再次执行完整构建。

## 2026-10-01：旧章节清理与入口统一

- 清理 49 个已迁移的旧章节目录，以及缓存、认证和 MQ 中 19 篇已拆分的重复文章；保留当前章节中的修订内容与资源。
- 按维护要求移除 Manim 与 Manim 示例两个独立旧章节。
- 将旧爬虫章节中较新的 Playwright 线程使用说明同步到现有章节；校正 Google 登录的迁移目标。
- 补齐旧页面跳转并更新正文链接，保留 `34_tio` 与现有正式章节编号；本轮不执行全站章节重排。
- 清理后保留 77 个正式章节，审计 777 篇 Markdown：本地链接、导航、遗漏文章与编号错误均为 0；仍保留 37 个短内容候选供后续完善。
- 验证 1,664 个历史页面跳转生成结果及 548 个实际目标；本轮未执行完整 VuePress 站点构建。

## 2026-10-01：缓冲区复用说明

- 新增[HTTP、WebSocket 与 TCP 的缓冲区复用](./docs/zh/34_tio/33-buffer-reuse.md)，介绍统一读取、VirtualBuffer 响应池和 EncodedBuffer 发送所有权。
- 补充 HTTP 与 WebSocket 内置编码路径、自定义 TCP 接入示例、旧编码接口兼容、借用正文及 TLS 分片的生命周期，加入章节目录与侧边栏。
- 相关框架模块 70 项 JUnit 测试通过，覆盖池化回收、部分写入、关闭后回调、真实 TCP/WebSocket 连接、HTTP/TLS 长连接与文件传输；测试结果不作为性能基准。

## 2026-10-01：34_tio 阅读顺序与文件命名

- 保留章节名称 `34_tio`，按认识框架、快速上手、核心概念、消息与文件传输、连接管理、加密通信、心跳与监控、深入原理划分八组。
- 32 篇正文采用“序号-主题.md”命名，文件顺序与首页、侧边栏保持一致。
- 同步章节内外引用和历史地址映射；旧数字文件名由站点迁移插件生成跳转，新地址使用带主题的文件名。
- 文档审计支持递归检查侧边栏分组，覆盖组内页面的导航登记。

## 2026-10-01：t-io 能力介绍与使用指南

- 将 t-io 相关文档统一为能力、设计与使用收益的介绍，增加[核心优势与应用价值](./docs/zh/34_tio/01-overview.md)的选型入口。
- [稳定性设计与资源管理](./docs/zh/34_tio/31-stability-resource-management.md)介绍共享 Worker、操作回调、资源交接与分层日志。
- [HTTP 长连接与高效文件传输](./docs/zh/34_tio/13-http-keep-alive-file-transfer.md)介绍连接复用、明文零拷贝、可写事件调度、TLS 分片与统一发送队列，保留请求格式及资源配置的使用约定。
- 更新章节索引、源码解析和相关链接；原页面地址通过迁移映射指向新页面。历史排查过程与本地诊断日志不作为能力指南正文。
- 框架验证包含真实 TCP/TLS 长连接与文件传输：底层 IO 测试 11 项、核心与 HTTP 等模块 JUnit 测试 56 项通过，另执行 5 项 HTTP 用例断言通过。这些结果用于验证对应功能，不作为吞吐量基准。

## 2026-09-30：IO 生命周期与浏览器网络记录

- 补充连接接入、连续读取、发送完成和资源回收的设计说明。
- [请求响应关联与线程约束](./docs/zh/65_ai-browser/28.md)介绍 requestId 精确关联、下载完成后的正文缓存、容量约定及相关回执字段。
- 更新[网络记录](./docs/zh/65_ai-browser/24.md)与[Playwright 整合](./docs/zh/42_crawling/07.md)，说明浏览器对象、页面与调用线程之间的关系。

## 2026-09-30（第二轮）：读取侧补齐、OCR 后端可插拔、失败回执带上地址

### 背景与设计

这一轮的东西**全部来自一次真实的「上政府网站查资料」任务**，卡点按疼的程度排：

1. **表格读不出列关系**。上一轮加了 `extract_markdown`，但入口太窄：要找一张表得先 `get_element_count` 数出有几张、再写一段 JS 把每张表的 class 与行数打出来，才敢填选择器。
2. **只想找一行，却要拉整页**。一份公告整页三万七千字符，调用方想确认的只是「文号在不在」。
3. **关键数据在图片附件里**。地类明细表整份是一张扫描图，正文只写「详见附件」——`innerText`、`extract_structured_data`、`find_text` 一个字都读不到；而工具链恰恰断在「把原图取下来」这一环：截图不是原件，服务端又没有「下载这张图」的口子。
4. **OCR 只有系统后端**。`Windows.Media.Ocr` 擅长验证码这类短文本，遇到整页扫描件与带合并单元格的表格截图只会吐错乱片段，而这类场景恰恰是「图就是数据」。
5. **幂等导航报失败，其实已经到了**。站点把 `http` 跳成 `https`，而「到达没到达」的判据把协议算进了差异，于是兜底逻辑永远不生效。
6. **失败回执不带地址**。只知道「失败」，不知道页面现在在哪，只能再补一次 `get_url`。

设计上的取舍：

- **找东西放服务端，不放调用方**：`find_text` 只回命中与前后文（默认前后各 80 字符、最多 20 条），把「整页进上下文」这件事从根上去掉。
- **「图就是数据」必须能被自动认出来**：`get_browser_state` 回执加 `mediaCount` / `mediaHint`。判据试了两版 —— 只看「宽高都 ≥200」会漏掉 240×180 的表格截图，只看面积会捞进 1200×90 的装饰横幅，最后定成「宽高都不小于 120 且面积不小于 4 万像素」。
- **取图要原件、要带登录态**：先让浏览器自己带着 cookie 去取，失败再退回页面内 `fetch`，两条都不行才失败并把原因写进回执。落盘落在 `data/<id>/`，所以回执里的 `url` 能直接贴给人看、`path` 能直接喂给 `ocr_image`。
- **OCR 后端可插拔，但默认不动**：新增 `browser.ocr.engine=command` 加一条命令模板（`{input}` / `{output}` / `{language}`），把「整页文档识别」交给本机已有的 OCR 命令行工具；默认仍是系统 OCR，零配置场景不受影响。**配了 `command` 却没给命令时如实说明退回了系统 OCR**，不装作生效；外部命令失败也**不静默退回**系统 OCR —— 调用方明确要的是文档级识别。
- **失败回执统一补地址**：`execute` 外面包一层，所有失败分支自动带上 `urlAfter` / `titleAfter`。各类失败分支有七八处，逐个加必然会漏。
- **默认上限可配**：`browser.extract.maxChars` 被 `extract_structured_data` 与 `extract_markdown` 共用，并且两条都**如实回报 `length` / `truncated` / `limit`** —— 以前在 JS 里悄悄 `slice` 一刀，回执里既没有全长也没有截断标记，调用方会把半篇文章当成全文。

### 源码改动

- **新增三条命令**（方法数由 117 增至 **120**）：
  - `download_image`：取页面图片的**原始文件**到 `data/<id>/`，回 `path` / `url` / `size` / `sha256` / `contentType` / `srcUrl` / `via` / `naturalWidth` / `naturalHeight`；
  - `find_text`：服务端文本检索（字面量或正则），回 `matchCount` / `returned` / `truncated` / `matches[]`（`index` / `line` / `match` / `before` / `after`）；
  - `list_tables`：列出页面上所有表格（行列数、class、id、预览、内嵌图片数），并给出**可直接填进 `extract_markdown` 的选择器**（`table >> nth=N`）。
- **新增两个工具类**：`TextSearch`（纯函数检索，不碰浏览器，可独立测）与 `OcrEngine`（后端选择、命令模板解析、外部命令调用）。
- `PlaywrightService`：新增 `downloadImage` / `findText` / `listTables` / `pageContext`；`getBrowserState` 补大图提示；`extractMarkdown` 支持 `nth`；`extractStructuredData` 回报长度与截断；`ocrImage` 改走 `OcrEngine`；`sameLocation` 忽略协议。
- `ActionService`：`execute` 改为薄包装，失败时统一补当前地址；伪故障「可重发名单」加入 `find_text` 与 `list_tables`（**`download_image` 刻意不收** —— 它每次落的是新编号的文件，重发会留下重复文件，与「覆盖式落盘」那几条判据不同）。
- `CommandTable`：注册三条新命令；`click_element_by_selector` / `input_text_by_selector` / `extract_markdown` 支持 `nth`。
- `get_config` 新增 `extract` 与 `ocr` 两段**生效值**（含一句话描述）。

### 三个被测试逮住的 bug（都是本轮新代码里的）

1. **`download_image` 的路径前缀校验永远为假**。`dataDir()` 给的是相对启动目录的 `data/<id>`，拿它去和绝对前缀比 `startsWith`，结果恒假 —— 表现成「文件名非法：mingxi.png」，而文件名毫无问题。修法是一开始就统一成绝对路径。
2. **OCR 结果带 BOM**。PowerShell 写结果文件带 UTF-8 BOM，而 `String.trim()` 只吃 `<= U+0020` 的字符，**吃不掉 `U+FEFF`**。于是识别结果变成 `"\ufeff1234"`：肉眼一模一样，拿去比对或填表单必然失败（验证码就是这么被坑的）。修法是先去 BOM 再 trim；顺序反了会留下空格。
3. **大图判据太严**。只看「宽高都 ≥200」时，240×180 的表格截图被判成图标，`mediaHint` 一声不吭 —— 而这正是最该报出来的那类图。

### 已补全

- [正文提取与上层结构化处理](./docs/zh/65_ai-browser/17.md)：新增「先找表」「只想找一行」「图就是数据」三节，含 `listTables`、`TextSearch.find`、`download_image` 取值链的当前源码，以及落盘路径那个坑的成因；「什么时候使用页面状态」改成六条。
- [命令清单](./docs/zh/65_ai-browser/13.md)：新增三条命令，「页面读取与差异」由 6 改为 9；方法计数 117 → 120（13、04、14、26、27 同步）。
- [Windows OCR](./docs/zh/65_ai-browser/11.md)：补第 6 节「外部命令后端」（配置、三个占位符、双引号要求、空输出与超时怎么报、为什么不静默退回），开头与排查表同步改写；明确「有 DOM 文本就别 OCR」的**例外**是内容本身就是图片。
- [配置项与运维自省](./docs/zh/65_ai-browser/12.md)：新增「正文与 Markdown 提取」「读图与 OCR」两张配置表。
- [站点配方、技能与异步作业](./docs/zh/65_ai-browser/10.md)：配方表补 `gov-site-search`；新增「站点技能」一节说明技能目录与「单反引号＝命令名」的构建期约定。
- 浏览器工程侧同样同步了技能文档（主技能的命令表、症状表与计数，`references/commands.md`、`references/reading-pages.md`、`references/client.md`），由工程内的技能文档一致性测试把关。
- **新增配方** `gov-site-search`：国产政府站站内检索的完整动作序列（填高级搜索表单 → 点搜索 → 等稳定 → 读结果），参数化关键词、匹配方式、日期区间与每页条数。
- **新增站点技能** `cn-gov-site-search`：把这轮踩过的坑固化成手册 —— 检索参数为什么必须走表单（**直接拼 URL 会静默返回 0 条**，它不报错）、匹配方式默认档会把无关结果混进来、征地类信息的栏目地图、批准文件与公告的文号不能混用、县级公告常常没有文号、中文形近字（实测「褚庙乡」被印成「禇庙乡」，按常用字检索整段漏掉），以及站上确实没有时怎么转依申请公开。

### 验证范围

- 新增纯单元测试：`TextSearchTest` 10 项（含「非法正则当场失败」「不重叠匹配」「空匹配不打转」「上下文超限收紧」）、`OcrEngineTest` 11 项（含命令模板的引号解析、`engine=command` 与 `command` 为空的两种回退、外部命令写 `{output}` 时的结果来源、空输出报错、BOM 清理）。
- 新增集成测试 `BrowserReadingUpgradeTest` 12 项，跑在**本地 fixture 服务器**上（不起外网）：`find_text` 的命中、上下文、正则、无命中、非法正则、限定范围；`list_tables` 给出的选择器能否**原样**交给 `extract_markdown`；`nth` 取第几张表与越界报总数；`download_image` 的字节数与摘要是否等于原始文件；`mediaHint`；以及**失败回执是否带 `urlAfter`**。
- 全量测试 **341 项通过、1 项失败、7 项跳过**。这 1 项（`BrowserResponseIntegrationTest` 的响应关联用例）**与本次改动无关**：它依赖「响应事件在 5 秒内投递到位」，本轮把它在一个**独立工作树的改动前检出**上跑，复现了同样的失败。已如实记录，没有把它改成「看起来通过」。
- 现场实测（本地 fixture 页，非外网）：`list_tables` 报出两张表与可用选择器；`extract_markdown` 传 `nth=1` 得到 GFM 表格且 `source` 写明 `table >> nth=1`；`find_text` 命中并给出前后文与行号；`download_image` 落盘字节数 7261、`sha256` 与本地原件**逐位一致**（`via=browser-context`）；把该文件交给 `ocr_image` 读出文字，**修复后首字符不再是 BOM**；`get_config` 的 `extract` / `ocr` 段给出生效值、`commands` 报 120；客户端的 `--out` 与 `--grep` 均可用。
- **没做成的一件事**：原计划在民权县人民政府网站上再跑一次端到端，验证时该站已经连不上（浏览器报 `ERR_EMPTY_RESPONSE`，用独立 HTTP 客户端同样失败），所以这一轮的现场实测改在本地 fixture 上做，**外网站点的复测留待该站恢复**。
- 新增行不含内部项目代号、不含形如三段式的版本号、不含本机绝对路径。

## 2026-09-30：新增 `extract_markdown`（页面转 Markdown，表格按 GFM 表格输出）

### 背景与设计

读页面一直是靠 `innerText`（`get_browser_state` 的 `data.text` 与 `extract_structured_data` 的正文都取自它）。`innerText` 会把表格**按单元格逐行摊平**：表头格与数据格交替出现，列与列的对应关系只能靠位置猜，`colspan`/`rowspan` 直接丢失。这在「面积、金额、数量」这类数字上最危险 —— 读出来每个数字都在，配错列却看不出来。实测一份「农用地转用方案」表格，摊平后「农用地 0.1550 / 耕地 0.1285 / 未利用地 0」全部混在一串数字里，无法判断哪个数字属于哪一列。

所以新增一条命令 `extract_markdown`：把页面（或页面上某个元素）取 HTML 后转成 Markdown，**表格输出为 GFM 表格**（表头一行、分隔行、数据各一行），行列关系变成显式的。它不取代 `extract_structured_data`——只想要一段纯文本时后者更省。

设计上的三个取舍：

- **转换放在服务端**，用工程已有的 HTML 解析与 HTML→Markdown 转换两个库完成，调用方拿到的就是 Markdown，不需要自己在客户端拼转换逻辑。
- **`selector` 可选**：不传转整个 `<body>`；传了只转命中的第一个元素。政府与后台页面普遍是「很长的导航 + 一小块正文」，只要那张表时传选择器能省掉整页噪声（实测同一页整页 37031 字符、只取目标表 2360 字符）。
- **`frame` 与选择器类命令同一套取值**（序号或 URL / name 子串），选择器落在跨域 iframe 里时照样能用。

### 源码改动

- 新增工具类 `HtmlMarkdown`（`dom/service`）：先用 jsoup 把 HTML 解析成规整 DOM，摘掉 `script` / `style` / `noscript` / `template` / `head` 与本工程自己画的高亮层（`playwright-highlight-container`），再交给转换器，最后压掉成片空行与行尾空格。
- `PlaywrightService` 新增 `extractMarkdown(...)`：取 `document.body.innerHTML` 或命中元素的 `outerHTML`，转换后按 `maxChars`（默认 20000，与 `extract_structured_data` 的正文上限一致）截断，回执给出 `markdown` / `length`（截断前全长）/ `truncated` / `source` / `url` / `title`，`includeLinks` 时另附链接清单。
- `CommandTable` 注册 `extract_markdown`（「其它」组，与 `extract_structured_data` 相邻）；`ActionService` 的**伪故障可重发名单**加入它（只读命令）。
- 工程新增两个依赖：HTML 解析与 HTML→Markdown 转换。
- 把链接清单的取值抽成 `linksIn(Frame)`，`extractStructuredData` 改用它（主 frame，行为不变），避免同一段脚本写两份。

### 已补全

- [正文提取与上层结构化处理](./docs/zh/65_ai-browser/17.md)：开篇改为两条命令的分工；新增「转成 Markdown」整节 —— 参数表、返回字段表、GFM 输出样例、四处边界（读的是 DOM 不是像素、不自动展开折叠内容也不拼接所有 frame、判据是 `truncated` 不是「看起来到结尾了」、选择器没命中会失败而不是静默返回空），并附 `extract_markdown`、`extractMarkdown`、`HtmlMarkdown` 三段当前源码与三处取舍的理由（为什么先过一遍 jsoup、高亮层为什么必须真的删掉、转换器为什么每次新建）。
- [DOM、页面状态与元素读取](./docs/zh/65_ai-browser/19.md)：命令到服务的映射表补 `extract_markdown` 一行；逐命令源码新增 `extract_markdown` 小节（注册 + 服务实现 + `HtmlMarkdown`）；**改正一段过时结论** —— 原文写「旧的『把网页转 Markdown 再请求大模型』属于另一种设计，不是当前执行链」，现在转换已是注册命令，改为如实说明两条命令只差「纯文本 / Markdown」。
- [命令清单](./docs/zh/65_ai-browser/13.md)：新增 `extract_markdown`，「页面读取与差异」由 5 改为 6，并在「按场景查方法」补一行「要读页面上的表格（数字别配错列）」。
- 方法计数由 116 改为 117：13、14、04、26、27 各处的表述与计数同步；[本章索引](./docs/zh/65_ai-browser/readme.md)「按问题查阅」补一行指向正文提取。
- 浏览器工程侧技能文档同步（主技能文档的命令表、症状表、命令计数，以及 `references/commands.md` 与 `references/reading-pages.md` 的参数手册与「表格为什么读出来会散架」一节）；这三处由工程内的技能文档一致性测试把关，漏一处构建期就会失败。

### 验证范围

- 新增纯字符串单元测试 `HtmlMarkdownTest` 8 项：表格转 GFM（断言**表头在同一行且有分隔行**，而不只是「文字还在」）、`colspan` 不让后续列错位、`script` / `style` / `noscript` 不进正文（用一个内联 JSON 做反例）、高亮层被摘掉、单个元素的 `outerHTML` 片段能转、空输入返回空串、成片空行压成一个、行尾空格被去掉。
- 命令表的缺参数守卫用例抓到一处遗漏：`extract_markdown` 的参数全是可选的，必须登记进「没有缺必填参数这一说」的豁免名单，否则构建期失败。已补。
- 浏览器工程全量测试 307 项通过（0 失败 / 0 错误 / 7 跳过）。
- **跑全量测试前要先停掉开发态服务**：两个 `Temp*` 诊断用例会用托管 profile 另起 Chrome，此时会失败在「浏览器启动后立即退出」，原因是同一份 profile 上已经有一个浏览器在跑。这不是代码回归，是运行环境冲突。
- 真实站点实测（有头本机 Chrome）：在民权县人民政府网站的一份「农用地转用方案」页面上，先 `get_element_count` 确认有 2 张表，再用 `extract_markdown` 传选择器只取目标表，转出 22 行 GFM 表格，农用地 0.1550、耕地 0.1285、未利用地 0、补充耕地 0.1285 等数字各归其列；不传选择器时整页 37031 字符并报告 `truncated`。
- `node scripts/audit-docs.mjs`：**这次不是全 0，但问题都不在本次改动里**。脚本报 `missingLinks` 1 条（`docs/zh/36_integration_thirty_party/07.md` 里把 SMTP 主机名 `smtp.larksuite.com` 当成了本地链接）、`unlistedPages` 569 条、`chapterErrors` 113 条。逐条核对：这些条目**没有一条命中本次改过的文件**（17、19、13、04、14、26、27、readme 与本文）。`chapterErrors` 的判据是「目录名的数字前缀是否等于它在排序中的位置」，而 `docs/zh` 下 130 个章节目录里有 112 个编号重复（例如同时存在 `19_aio` 与 `28_redis`、`25_mongodb` 与 `20_netty`），`65_ai-browser` 只是因为前面的重复被整体错位才出现在名单里 —— 这是仓库既有的编号漂移，与本次改动无关，也不该由这次改动顺手「修」掉（那会牵动 60 之后的全部章节号、侧边栏与历史跳转）。
- 新增行不含内部项目代号、不含形如三段式的版本号、不含本机绝对路径。

### 版本对齐（2.1.6）

框架源码 revision 已是 `2.1.6`，而 t-io 与 admin 两套制品在本机仓库里只到 `2.1.5`（`2.1.6` 目录里只剩下载失败的 `.lastUpdated` 标记），项目依赖链也锁在 `2.1.5`。既然 `2.1.5` 已发布，就统一升到 `2.1.6`、不再覆盖已发布版本：

- `t-io`：整仓 `mvn -o -DskipTests install`，9 个模块全部以 `2.1.6` 安装（含本次改动的 `tio-utils`）。
- `tio-boot-admin`：父 pom 的 `revision` 与 `tio-boot.version` 由 `2.1.5` 改为 `2.1.6`，三模块安装为 `2.1.6`。
- 浏览器服务：`playwright-server/pom.xml` 的 `tio-boot-admin.version` 改为 `2.1.6`；`mvn dependency:tree` 确认 `tio-boot-admin-web` / `tio-core` / `tio-http-common` / `tio-http-server` / `tio-boot` / `tio-utils` 全部解析到 `2.1.6`；顺带清掉了 `2.1.6` 目录里遗留的 `.lastUpdated` 标记。
- 本地仓库里 `2.1.5` 那套保持发布时的原样，不再被覆盖。
- **顺带修掉一处测试抖动**：升到 `2.1.6` 后跑全量时，有两条用例偶发失败，报的全是 Playwright 事件泵的伪故障（`Object doesn't exist: request@… / response@…`，就是服务端一直在识别的那类），而同一条用例单独跑三次都过 —— 属于测试基础设施的问题：**用例里的裸 `page.navigate(..)` / `page.evaluate(..)` 没有享受到生产代码那层伪故障防护**。新增测试侧助手 `TestFlakeGuard`（只对这类伪故障重发，其它异常原样抛出，绝不掩盖真实断言失败），并接到 6 个用例类的 `open()` / `openMain()` 与那条响应关联用例上。修完连跑两次全量都是 292 项 0 失败 0 错误。

## 2026-09-27：本机 Chrome 改走 CDP，新增独立 CDP 客户端

### 背景与设计

本机 Google Chrome 原先走 Playwright 的持久化上下文（管道调试），只有在「用户自己那份 Chrome profile」这一个场景下才另外走 CDP。这一轮把 Chrome **一律改成 CDP**：自己拉进程 + 远程调试端口 + 协议接入。三条理由，按重要性排：

- **不再要求「先关掉你正在用的 Chrome」**。CDP 这条路用的是**托管 profile**，不是用户日常那份 `User Data`，两者互不抢目录；而管道调试从 Chrome 136 起在默认用户数据目录上被拒绝，那条路要用真实 profile 就得先关浏览器并放开机器策略。
- **视口语义天然正确**。这条路不套视口模拟，页面尺寸一直跟着真实窗口走，正好是默认想要的「所见即所得」，不必再靠「不给默认视口」绕。
- **创建期参数改为自己补**。持久化上下文有一批创建时才能给的选项（下载目录、权限、UA、HTTP 认证）；走 CDP 之后没有现成入口，改为用协议命令补，**补不上的必须出现在回执里**而不是静默退化。

内置 Chromium 与 Firefox **不动**：内置 Chromium 不需要「本机安装」这个概念，开发态还没有内嵌可执行文件（交给 Playwright 自己解析），换成自己拉进程只会多一份要维护的启动逻辑。

为此新增一个**独立协议客户端**（包名 `nexus.io.chromium.cdp`）。选自己实现而不是引现成库，是因为现成选择分两类都不合适：一类是多年没有发版的社区客户端；另一类是按浏览器里程碑逐个发版的协议绑定 —— 用它等于把「升级浏览器」和「升级依赖」绑在一起，而这个工程本来就自己内嵌浏览器、自己控制版本。这个客户端只用 JDK 自带的 WebSocket 客户端加上工程已有的 JSON 工具，**没有新增依赖**，而且**不 import 工程内任何其它包**，可以整包拿走单独用。

调试端口刻意**不写 9222**：它不是浏览器的内置默认值，只是各类工具约定俗成的端口；跟着用会双向互相抢（别的工具按默认值连到我们的浏览器上，或者别人手工起的调试实例占着端口与 profile 让我们的启动失败）。默认值是 0，由浏览器自己挑空闲端口。

### 源码改动

- 新增包 `nexus.io.chromium.cdp`：`CdpConnection`（WebSocket 传输、命令—回执配对、事件路由、失败分型）、`CdpSession`（按 target 分会话）、`CdpBrowser`（版本、target 与页签、会话挂载、下载目录、权限、自动挂载并放行）、`CdpPage`（导航与等待、求值、截图、UA 覆盖、原生弹窗）、`CdpTarget`、`CdpException`、`CdpEventListener`。
- 新增 `service/CdpLaunchSupport`：启动时用协议补下载目录与权限，并把浏览器亲口报的身份与补设置结果写进回执。两项都是**尽力而为**：失败只记警告并进 `notes`，绝不让 `start` 失败。
- `PlaywrightService`：本机 Chrome 一律走 `launchOverCdp`；新增 `cdpArgs` 按配置决定调试端口、`cdpDebugPort()`；共享浏览器上新增 CDP 身份字段；`start` 回执新增 `data.browser.cdp`。
- `ChromeBrowser`：新增 `cdpManagedProfileDir()` 与两个配置键 `browser.chrome.cdpProfileDir`、`browser.chrome.debugPort`；`BrowserChoice.profileDir()` 让 `chrome` 解析到这条路的目录（「启动要不要重建浏览器」的判断依赖它，否则每次 `start` 都会重建）。
- `launchOverCdp`：`--profile-directory` 只在用用户数据目录时才传（托管 profile 下传它只会多一层同名子目录）。

**顺带修掉两处「源码与文档不符」**，两处都是这一轮改动引入的：

- `get_config` 的 `profileDir.resolved` 固定报「按端口派生的托管目录」。浏览器类型为 `chrome` 时那是错的 —— `start` 回执报的是 `shared-default`，而这里报 `shared-<端口>`，排查「配置看着对、登录态却没了」时正好被带偏。改为**按这次实际会落到的类型解析**，并新增 `forType` 与 `cdpConfigured` 两个字段。
- `set_credentials` 的失败文案把原因说成「用用户自己的 Chrome profile」，并在 Edge 分支里建议「改用 `browser=chrome`」。Chrome 现在也走 CDP，那个建议已经失效、原因也不再成立。改为如实说明这条路的原因，并建议 `browser=chromium` 或 `browser=firefox`。

### 已补全

- [源码教程：Chrome 走 CDP 与 CDP 客户端](./docs/zh/65_ai-browser/27.md)（**新增页**）：为什么本机 Chrome 走 CDP、启动链路（含从 stderr 读调试地址与「拒绝」和「提前退出」的区分）、独立客户端的类型分层与「为什么自己写」、三个关键机制（id 配对 / 按 target 分会话与跨域 iframe / 失败分型里「超时不能当成没生效」）、创建期参数怎么补（含**权限名不是 Playwright 那一套**这个静默坑，以及自动挂载必须放行）、回执新增字段、profile 为什么不再按端口派生、排障（退出码 21 与「没有输出」的真实原因、9222 的由来与害处、`set_credentials` 不可用）、自测怎么自证。
- [浏览器、profile 与登录态](./docs/zh/65_ai-browser/05.md)：`start` 的浏览器表新增「启动方式」一列并写明 CDP 与持久化上下文的分工；第三节由「默认按端口分开」重写为两节（本机 Chrome 固定 `shared-default` / 其余按端口派生），并写清从旧目录切过来**登录态不会跟着走**；第四节由「用用户自己那份 Chrome profile（CDP 模式）」重写为「换一份 profile」，说明该开关只管「用哪份 profile」、不管「走哪条路」；回执字段表补 `cdp` 并更新 `note`、`mode` 说明；第六节补调试端口不要用 9222 的提示。
- [配置项与运维自省](./docs/zh/65_ai-browser/12.md)：新增 `browser.chrome.cdpProfileDir` 与 `browser.chrome.debugPort` 两行，`browser.profileDir` / `perPort` 两行标明只影响内置 Chromium 与 Firefox；可配项计数 36 改为 38；`get_config` 样例补 `forType` / `cdpConfigured` 并写明 `resolved` 与 `start` 回执同值、`chrome` 时不是 `shared-<端口>`；「停服务前先关任务」一节补上 CDP 那条路特有的孤儿浏览器症状（退出码 21 + 没有输出）。
- [本章索引](./docs/zh/65_ai-browser/readme.md)：第四阶段目录补 27，并在「按问题查阅」表加一行指向它。
- 中文侧边栏登记新页（`audit-docs.mjs` 对未登记的章节页会直接判失败）。

### 验证范围

- 协议客户端自测 `CdpClientTest` 7 项通过：**不依赖工程其它代码**（自己探测浏览器可执行文件、自己挑空闲端口、自己拉进程、自己等端口就绪，用临时 profile 不碰开发机登录态），覆盖连接与版本、导航与标题、`document` 求值、**异步表达式求值**、截图字节是合法 PNG、两个页签会话不串台、target 列表解析、页面内异常与协议级拒绝的分型、连接对象自述存活状态；另含一条反向用例，确认 **Playwright 的权限名会被协议拒绝**（`Unknown permission type`），把这个后果静默的错误钉住。
- 纯单元测试 `ChromeBrowserTest` / `BrowserChoiceTest` / `BrowserEngineTest` 共 41 项通过（0 失败 0 错误 2 跳过）。
- `BrowserResponseIntegrationTest` 中两条断言随行为变更由 `managed` 改为 `cdp`。
- 端到端实测（有头 Chrome，`mode=cdp`、`profileDir` 为本机 Chrome 那一条）：确认回执里 `data.browser.cdp.product` 与浏览器自身版本一致、`notes` 显示下载目录与权限均已补上；并在一个**需要登录**的真实站点上验证了登录态复用与页面数据读取（用同一份托管 profile 时登录态仍在，换 profile 后为空 —— 与文档第三节的说明一致）。
- `node scripts/audit-docs.mjs`：本地链接缺失 0，中文侧边栏缺失 0，未登记页面 0，章节错误 0。

## 2026-09-27：框架级全局开关 `tio.json.skipNull`（不输出 null 值字段）

### 背景与设计

`/playwright/command` 的每条回执都带 `"msg":null`、`"error":null`，批量回执里每一步都带一份。框架原先只提供**按调用点**的能力（`Json.getSkipNullJson()` / `JsonUtils.toSkipNullJson()`），没有配置项。这一轮把开关做进框架，同时把"影响面"这件事在文档里讲清：

- **开关放在框架**：`tio.json.skipNull`，**默认 false**，所以不配置的项目行为一点不变；每个项目一份配置，打开只影响自己那一个进程（各自是独立进程、各自一份静态状态）。
- **启动期也能决定**：配置项只在默认工厂静态初始化时读一次，项目要到自己的启动钩子里才知道该不该开。所以框架补了 `Json.installSkipNull()` / `installSkipNull(boolean)` / `uninstallSkipNull()`：无论工厂有没有建好都能立刻切换；`uninstall` **只还原"由代码装上的那一层"**，还的是安装之前那个工厂实例（provider、日期格式等之前的选择不会被抹掉）。`Json.isSkipNull()` 按**输出表现**判断当前状态，对四种实现都成立。
- **包装只改输出**：包装工厂只覆盖 `getJson()`，`parse*` 一律委托给原工厂 —— 跳过 null 只该管写出去的东西。
- **影响范围是"这个进程"**：同一个 JVM 里被依赖进来的模块（响应体、controller 返回值、swagger、session、以及 `Http` / Telegram / 企业微信 / 飞书通知这类**出站请求体**）都会跳过 null。文档里明确给出取舍：只想改响应体就按调用点用 `getSkipNullJson()`，不要打开全局开关。
- 浏览器服务在 `app.properties` 里打开该开关，并用项目自己的键 `browser.json.skipNull`（默认 true、优先级更高）在启动时对齐框架开关、把结果打进启动日志（`响应跳过null=`）。

### 源码改动

- 框架 `tio-utils`：`Json` 新增 `KEY_SKIP_NULL`（`tio.json.skipNull`）、`installSkipNull()` / `installSkipNull(boolean)` / `uninstallSkipNull()` / `isSkipNull()`，`buildFactory()` 建默认工厂时按配置包一层"只改输出"的工厂；新增测试 `JsonSkipNullConfigTest` 6 项（配置键、输出与开关一致、`isSkipNull` 如实回报、解析路径不受影响、显式安装幂等、卸载精确还原）。默认工厂静态初始化只发生一次，所以用例以"进用例时的实际表现"为基准，两种配置下都能跑。
- 浏览器服务：`JsonResponses` 收敛成"读项目配置 + 调框架开关 + 回报状态"，不再自己造第二套包装工厂。

### 已补全

- [Json 转换](./docs/zh/14_tio-utils/05.md)：「不输出 null 值字段」一节重写为三种方式（按调用点 / 全局配置项 / 启动期代码打开），补 `installSkipNull` / `uninstallSkipNull` / `isSkipNull` 的语义与"只还原自己那一层"，并写清影响范围是这个进程、以及同框架下多项目互不影响的理由。
- [统一命令接口与人机协作](./docs/zh/65_ai-browser/04.md)：响应样例改为不带空字段的形态，新增「响应里不输出 null 值字段」小节。
- [配置项与运维自省](./docs/zh/65_ai-browser/12.md)：新增 `tio.json.skipNull`（框架级）与 `browser.json.skipNull`（项目级、优先级更高）两行。

### 验证范围

- 框架单元测试：`JsonSkipNullConfigTest` 6 项，分别在**不传参**与 `-Dtio.json.skipNull=true` 两种运行下各跑一遍，都通过（覆盖开关两档）；同模块既有的 `JsonUtilsTest` 同时通过（默认行为未被改变）。
- 端到端实测（`scripts/verify/verify-framework-skip-null.ps1`，直接改 `app.properties` 里的框架键，两档各重启一次）：`tio.json.skipNull=false` 时 `/playwright/health` 回 `{"data":{"name":"playwright-server"},"ok":true,"msg":null,"code":1,"error":null}`；`=true` 时回 `{"data":{"name":"playwright-server"},"ok":true,"code":1}`；恢复原配置后仍为不带 null 的形态。
- 应用单元测试：`JsonResponsesTest` 5 项（配置键、默认开、装上后不输出 null、关掉时输出带 null、项目键优先于框架键、`active()` 回报事实）与 `DefaultJsonNullBaselineTest` 1 项（不加载接线类的独立 JVM 基线）；`playwright-server` 全量 292 项通过（0 失败 0 错误 9 跳过）。
- 本地仓库版本对齐：t-io 与 admin 全部升到 `2.1.6`，项目依赖链同步（细节见上一条「版本对齐（2.1.6）」）；`2.1.5` 那套保持发布时的原样。
- `node scripts/audit-docs.mjs`：本地链接缺失 0，中文侧边栏缺失 0，未登记页面 0，章节错误 0。

## 2026-09-27：响应不输出 null 值字段（项目级，不动框架默认行为）

### 背景与判断

`/playwright/command` 的每条回执都带 `"msg":null`、`"error":null`，批量回执里每一步都带一份。框架提供的是**按调用点**的能力（`Json.getSkipNullJson()` / `JsonUtils.toSkipNullJson()`），**没有**全局开关。核对源码后确认这不是遗漏：默认工厂是静态、进程级的，而同一个框架下会同时跑多个项目，把它改成"全局跳过 null"会替别的项目做决定（必须显式传 null 的接口会直接坏掉）。所以这件事由**各自的项目**在启动时装自己的包装工厂：**影响范围限于本进程**（别的项目、别的进程不受影响），换来的是"响应体不输出 null"。

**这条边界必须写进文档**：默认工厂是静态字段，同一个 JVM 里被依赖进来的框架模块也会跟着变 —— 响应体、controller 返回值、swagger 文档、session 存值、以及**出站请求体**（`Http` / Telegram / 企业微信 / 飞书通知等工具都用 `JsonUtils.toJson(..)` 拼报文）都会跳过 null。浏览器服务不调用这类出站工具，所以可以接受；只想改响应体的场景应当改用响应出口的 `Json.getSkipNullJson()`，而不是动默认工厂。

### 源码改动

- 浏览器服务新增 `nexus.io.ai.browser.json.JsonResponses`：把**当前**默认工厂包一层，只覆盖 `getJson()` 让它返回跳过 null 的实现，`parse*` 全部委托给原工厂（跳过 null 只该影响"写出去的东西"）。包装的是 `Json.getJsonFactory()`，所以 `tio.json.provider` 选的实现不会丢。
- `PlaywrightAppConfig.config()` 启动时调用一次，并把结果写进启动日志（`响应跳过null=`），配置有没有生效一眼可见。开关 `browser.json.skipNull`，默认 `true`。
- 框架源码未改动（曾按"全局开关"方向改过 `Json.buildFactory()`，确认会波及其他项目后**已完整还原**；本地仓库里那份 `tio-utils` 制品是用还原后的源码重新装回的，并已核对编译产物里不含新增成员）。

### 已补全

- [Json 转换](./docs/zh/14_tio-utils/05.md)：新增「不输出 null 值字段」一节 —— 按调用点的两种用法、为什么框架**刻意不**提供全局开关、项目级包装工厂的完整写法与三个要点（包装"当前"工厂、解析必须委托、只影响本进程），并指向浏览器服务这个实例。
- [统一命令接口与人机协作](./docs/zh/65_ai-browser/04.md)：响应样例改为不带空字段的形态，并新增「响应里不输出 null 值字段」小节，讲清「字段不在 == 为 null」对读回执的一方的两个影响（判断成败只认 `ok`/`code`；`browser.json.skipNull=false` 可恢复）。
- [配置项与运维自省](./docs/zh/65_ai-browser/12.md)：新增 `browser.json.skipNull` 一行。

### 验证范围

- 单元测试：新增 `JsonResponsesTest` 5 项（装上后不输出 null、**解析路径不受影响**、显式传 `false` 是空操作且不偷换工厂、重复装不会层层包装、配置项名）与 `DefaultJsonNullBaselineTest` 1 项（**不加载工具类**的独立 JVM 基线：默认行为仍带 null，证明改动只发生在本项目装上包装之后）；`playwright-server` 全量测试通过（见下条）。
- 端到端实测（`scripts/verify/verify-skip-null.ps1` 两档各跑一次）：`browser.json.skipNull=false` 时 `/playwright/health` 回 `{"data":{"name":"playwright-server"},"ok":true,"msg":null,"code":1,"error":null}`；默认（不配置）时回 `{"data":{"name":"playwright-server"},"ok":true,"code":1}`。`/playwright/command` 的失败回执与 `/playwright/config` 同样不再带空字段。
- 技能文档同步：主技能文档与 `protocol.md` 的响应样例改为不带空字段，并写明判断成败不要用「字段在不在」；`batch-and-js.md` 的批量回执样例去掉了每步的 `"msg":null`。
- `node scripts/audit-docs.mjs`：本地链接缺失 0，中文侧边栏缺失 0，未登记页面 0，章节错误 0。

## 2026-09-27：键盘输入分流、按调用点重发、canvas 文字诊断

### 源码改动（本轮文档跟着源码走）

- `send_keys` 现在按**输入形态**分流：单个键名与「若干个修饰键 + 恰好一个键」的组合仍走 `press`，其余（整段文本、中文、空格）走逐字符 `type`。起因是实测里 `keys:"CRCL"` 会直接得到 `Unknown key`，而另外两条路都要先拿到选择器或元素索引。回执新增 `mode`（`press`/`type`）与 `keys`/`text`。
- `retryOnSpurious` 从「只有 `execute_js` 认」放开为**按调用点声明**：安全名单仍决定默认行为（只读、幂等导航、覆盖式落盘、等待自动重发；动作类一次都不重发），但调用方可以显式声明这一次重发无害。起因是重度 SPA 上同一个选择器一会儿成功一会儿报伪故障，而调用方在只读诊断确认没生效后仍无路可走。
- `get_element_text` 新增 `selector`（与 `index` 二选一）与 `canvasOnly`，回执新增 `target`。canvas 通常不进快照（不可交互 → 没有索引），只能按选择器够到；`canvasOnly:true` 时读不到文字会追加 `canvasOnly` 与 `hint`，把「不是选择器错了」直接说清。
- 客户端 `dsb run` 增加 `--retry-on-spurious`（原先只有 `js` 有）。

### 已补全

- [点击、输入、键盘和鼠标](./docs/zh/65_ai-browser/20.md)：键盘与鼠标一节改写为「输入形态分流」与「按住不放读图上一点」；`send_keys` 补分流判据表、`typesAsText` 源码片段、更新后的 `sendKeys` 实现与参数表；`mouse_click` 补「坐标点击不依赖 DOM 节点句柄，是选择器频繁撞伪故障时的稳定退路」。
- [DOM、页面状态与元素读取](./docs/zh/65_ai-browser/19.md)：`get_element_text` 更新为 `index`/`selector` 二选一 + `canvasOnly` 的当前实现，并说明为什么这个命令要收选择器（canvas 没有索引）与诊断的边界（诊断取不到不影响文字返回）。
- [公共执行链](./docs/zh/65_ai-browser/14.md)：重发策略段落改写，并同步 `ActionService.execute` 的当前源码（动作类失败提示新增「确认没生效后可带 `retryOnSpurious` 再发」、只读失败提示改为「可以再发一次」并新增 `retriedByCallerRequest`）。
- [表单与多层弹窗排障](./docs/zh/65_ai-browser/08.md)：补动作类命令的处置顺序「先读 → 确认没生效再带开关重发 → 仍不行改用坐标点击」，并强调默认行为未变。
- [源码教程：等待条件与 JavaScript 执行](./docs/zh/65_ai-browser/21.md)：说明 `retryOnSpurious` 是按调用点声明、对任何命令都有效，命令名只决定默认行为。
- [客户端](./docs/zh/65_ai-browser/03_client.md)：`--retry-on-spurious` 说明改为 `js` 与 `run` 两个子命令都有，并写明动作类要先确认没生效。

### 验证范围

- 单元测试：`playwright-server` 全量 286 项通过（0 失败 / 0 错误 / 9 跳过）。本轮新增或改动 6 项，覆盖：动作类默认不重发、声明后重发到成功、声明后到上限仍如实失败、文本走打字且真的落进输入框、键名与文本的分流判据（含 `Control+A+B` 不算组合键）、`canvas` 只读不到文字时才给诊断。
- 真实站点实测：在行情图表页上，`send_keys -p keys=CRCL` 回 `mode:"type"` 且搜索框真的收到该文本、下拉结果随之刷新；`get_element_text -p selector="[data-qa-id='pane'] + div canvas" -p canvasOnly=true` 回 `text:""`、`canvasOnly:true`、`hint` 与 `target`（这正是本轮「时间轴日期读不出来」的根因，且该 canvas 确实没有索引）。
- 技能文档一致性：`SkillDocConsistencyTest` 9 项通过；仓库技能新增一份站点无关的经验手册（网页数据优先取文本），主技能文档与分册同步了新增参数与两条症状（图表文字读不到、按住读数据点）。
- `node scripts/audit-docs.mjs`：本地链接缺失 0，中文侧边栏缺失 0，未登记页面 0，章节错误 0。
- 新增行不含内部项目代号、不含形如三段式的版本号、不含本机绝对路径。包名与源码路径沿用本教程既有写法。

## 2026-09-27：快照索引判据改为结构变更 + 逐元素重校验

### 已补全

- [DOM、页面状态与元素读取](./docs/zh/65_ai-browser/19.md)：重写「快照一致性与索引有效性」一节，说明判据为什么从「页面变更计数」换成**结构变更 + 逐元素重校验** —— 索引解析成的是位置型 XPath（只有同级序号、没有 class 谓词），所以文字改写与 class/style 变化不影响索引，只有增删元素才会挪动同级序号。补上 `strictSnapshot` 参数、增量变更计数（`snapshotMutations` / `snapshotStructuralMutations` / `snapshotContentMutations`）与 `snapshotNote` 字段。
- [DOM、页面状态与元素读取](./docs/zh/65_ai-browser/19.md)：`get_browser_state` 的参数表与两处源码片段同步为带 `strictSnapshot` 的当前签名。
- [客户端](./docs/zh/65_ai-browser/03_client.md)：补上三处与服务端一致的行为 —— `--select` 对**失败响应同样生效**（批量里某一步失败时 `data.results` 仍在，`--select data.results.N.…` 正是「只看失败那一步」的用法，只有路径不存在才退回整封）；参数文件与 `batch` 都认**整个请求体**；`js` 新增 `--retry-on-spurious`（只读脚本的重发开关）。

### 验证范围

- 源码核对：`snapshotIssues` 现在按 `strict` 选择比较 `mutations` 还是 `structuralMutations`，并新增 `element_identity_changed` 重校验；`snapshotStamp` 把 `childList` 中增删元素节点计为结构变更、其余计为内容变更；`getBrowserState` 增加 `strictSnapshot` 重载，`CommandTable` 同步读取该参数。
- 单元测试：`BrowserConsistencyTest` 9 项通过，其中新增三项分别覆盖「纯内容变动不作废索引」「`strictSnapshot` 恢复旧判据」「同一位置换了标签必须作废」。
- 实测：在持续刷新的实时行情页上，修复前每次按索引操作都得到「当前没有页面快照」；修复后同一页面返回 `indicesUsable:true`、`snapshotStructuralMutations:0`、`snapshotContentMutations:1`，按索引点击回执 `changed:true`。
- 配置读取：`ChromeBrowser` 与 `WindowsOcr` 原先把 `System.getenv` 当作环境变量入口，会绕过 [配置与运维](./docs/zh/65_ai-browser/12.md) 写明的优先级链（配在配置文件里不生效）。两处已改为 `EnvUtils.get`，代码与文档一致。
- 技能文档与服务端的命令表一致性由构建期测试校验；本次未新增命令，只新增了一个 `get_browser_state` 参数，主技能文档与分册已同步。

## 2026-09-26：补回浏览器原理与实现代码

- 在智能体接入篇恢复状态评估、任务记忆、下一步目标与动作协议，并加入宿主适配代码。
- DOM 与元素提取篇补充当前前端完整脚本、Java DOM 模型、两遍组装与跨 Frame 索引代码。
- 正文提取篇增加完整 Java 模型抽取示例，明确浏览器正文读取和上层模型处理的边界。
- 116 条命令逐一附上注册代码与服务实现，另补执行链、点击定位和批量辅助代码。
- 新增 [客户端教程](./docs/zh/65_ai-browser/03_client.md)，覆盖命令行、Python 库、PowerShell、传输错误、留档与异步查询，附当前客户端实现。

## 2026-09-26：重编 deepseek-browser-use 教程

- ai-browser 移至 ai-coding 之后，目录为 `65_ai-browser`，原 60—62 章顺延；同步导航、引用与历史页面跳转。
- 删除旧控制器与多端点教程，重写安装、首次任务和智能体接入；统一使用当前 Handler、ActionService、CommandTable 执行链。
- DOM 与正文抽取按现行源码重写，补充 Frame 索引、实时表单状态以及正文长度和 query 回显边界。
- [章节目录](./docs/zh/65_ai-browser/readme.md) 按入门、实际任务、核心原理、功能源码四个阶段组织。

## 2026-09-26：整理 java-openai、ai_agent、知识库和语音章节

- 章节顺序调整为 java-openai、ai_agent、knowlege_base、voice-agent；同步目录、侧边栏、导航与历史页面跳转。
- [java-openai](./docs/zh/59_java-openai/readme.md) 聚焦客户端使用：保留统一调用与多模态教程，迁入 Perplexity，拆出 Whisper 和 Supadata 调用说明，补充 Gitee、DeepSeek 与 Bailian 入口。
- [ai_agent](./docs/zh/60_ai-agent/readme.md) 接收请求记录、限流、RAG、结构化检索、问答与代码执行等应用文章；保留原有业务实现和历史材料。
- [解析评测](./docs/zh/61_knowledge-base/28.md) 放在知识库解析方案与费用对比之后，保留样本、测量口径、七模型结果与局限。
- 修正 Perplexity 示例的旧类名与异常处理；依赖示例改用项目管理的版本属性。
- java-openai 仓库 README 和客户端文档增加 tio-boot.cn、tio-boot.com 对应章节入口。

## 2026-09-26：AI Browser 按功能补齐源码教程并清理旧文档

- 新增 [公共执行链](./docs/zh/65_ai-browser/14.md) 与 18–26 功能教程，按当前注册表覆盖全部 116 个命令；另讲解 commands 批量入口。内容包含执行机制、注册参数、Java 入口、边界及验证方法。
- 保留 Windows OCR 专章和 08–15 使用指南；修正命令清单中的滚动单位、HTML 返回、数量等待与设置作用域。
- 按用户反馈恢复 01–07 全文，保留总体介绍、提示词、DOM 原理和 Controller 教学示例；在原文基础上增加适用范围和现行实现指引。撤销这些页面的迁移重定向，恢复目录、侧边栏及历史引用。
- 新增示例统一使用虚构资料，不记录真实商家信息、账号、验证码或密钥。

## 2026-09-24：AI Browser 章节补齐现行工程的运行与配置文档

### 已补齐

- 先核对 `08.md` 与源码，改正三处**与实现不符**的描述：
  1. 生命周期原文写「每个任务使用独立的持久化浏览器上下文和 profile」，与实现相反 —— 浏览器与 profile 是**全进程共享**的（一个浏览器进程、一份 profile，任务之间靠页签隔离），原文的写法正是被取代掉的旧设计；
  2. profile 路径原写 `~/.config/browseruse/profiles/<id>`，实际默认按服务端口派生为 `shared-<端口>`；
  3. 补上「浏览器类型、有头/无头、profile 目录、可执行文件是浏览器级属性」这条：与正在运行的不一致时空闲才重建、有任务在跑就报错。
- [统一命令接口与人机协作](<./docs/zh/65_ai-browser/04.md>)：错误码表补 `RATE_LIMITED`，并给每一行加「可自动重试」列，说明 `data.retryable` 与 `data.retryAfterMs` 的建议退避值；批量一节补 `expect` 断言与 `stopOnExpectFailure`（断言没过时 `failed` 仍是 0、`expectFailed` 是 1），以及 `async` 异步作业；开头加后续章节导引。
- 新增 6 篇现行文档，填掉章节里「只有早期多端点方案」的空白：
  - [09. 浏览器、profile 与登录态](<./docs/zh/65_ai-browser/05.md>)：`browser` 参数五种取值与别名、`auto` 与显式取值的区别、回执里 `requestedBrowser`/`effectiveBrowser`/`engineHonored`/`mode`/`profileSeenBefore`/`note`/`profileNote` 各字段含义、profile 按端口派生、用户自己那份 Chrome profile（CDP 模式）的两个代价、Firefox 差异、Chromium 沙箱三档取值与「沙箱 + 管道」那条坑。
  - [10. 窗口尺寸与页面视口](<./docs/zh/65_ai-browser/06.md>)：窗口按**可用工作区**（扣任务栏）计算、`browser.viewport` 三档取值、默认从固定视口改成跟随窗口的原因与前后实测对照、截图像素与 `devicePixelRatio` 的换算、跟随窗口时不能同时给设备仿真参数、`set_viewport` 与元素在视口外的处理。
  - [11. 配置项与运维自省](<./docs/zh/65_ai-browser/12.md>)：配置读取优先级（`EnvUtils.get` 通道优先于服务自带配置，不要直接用 `System.getenv`）、36 个运行时可配项按用途分组、四个只读端点与两条非 `/playwright/` 前缀路由、`get_config` 的返回结构、启动与停止脚本、安全提示。
  - [12. 调用追踪、页面留档与文件上传](<./docs/zh/65_ai-browser/09.md>)：`logs/trace/` 四类产物与命名规则、排查顺序、脱敏规则与「尽力而为」的边界、`data/<id>/` 的留档时机与序号约定、客户端侧留档、`POST /playwright/upload` 的四种用法与安全约束、`execute_js` 的脚本目录。
  - [13. 命令清单](<./docs/zh/65_ai-browser/13.md>)：把 116 个方法按 23 个功能组列出，并补「按场景查方法」一表；说明 `commands` 不在方法清单里但可由分发层处理。
  - [14. 站点配方、技能与异步作业](<./docs/zh/65_ai-browser/10.md>)：配方文件格式与变量注入、仓库自带的 5 个配方、「主站套第三方控制台」这一整类站点的套路与最易踩的一步、技能与配方的分工、异步作业的状态与 50 个上限（含「结果在内存、服务重启即丢」这条限制）。
- [章节导航](<./docs/zh/65_ai-browser/readme.md>) 重写为「现行文档 / 原理与早期实现」两段，并点明 `01`、`06`、`07` 属早期实现、不能直接当当前 API 用。

### 验证范围

- 文档里的方法数与清单以**运行中的服务**为准（`list_methods` 与 `GET /playwright/methods` 双重确认：116 个方法），不是照抄项目 README（那里写的 113 已过时）。
- 配置项清单逐个取自源码里的配置常量，共 36 个运行时可配项；路由取自路由注册类，共 7 条。
- 错误码与可重试语义取自错误分类类：9 个错误码（含 `RATE_LIMITED`）、3 个可重试码及其建议退避毫秒数；`data.retryable` / `data.retryAfterMs` 的存在与文案逐条核对。
- 作业语义取自作业注册表：状态四值 `running`/`done`/`failed`/`cancelled`、只保留最近 50 个、结果在内存中、取消是协作式的。
- 配方一节取自 `list_recipes` 的实际返回（5 个配方及其步数），不是照抄配方说明文件。
- 追踪文件命名与脱敏规则取自追踪实现：`%06d-<任务ID>-<方法名>.json`、`calls.jsonl`、`steps.log`、`uploads.log`，以及手机号 / 18 位身份证号与统一社会信用代码 / 邮箱 / 16～19 位长数字四类内置规则。
- 视口与截图的数值来自本机实测（窗口外框 1484×1019、页面视口 1470×925、`devicePixelRatio` 1.5、同一页出图 2205×1388、拖小窗口后视口跟随为 886×606），并说明了「CSS 像素截图」在该模式下为何做不到。
- `node scripts/audit-docs.mjs`：本地链接缺失 0，中文侧边栏缺失 0，未登记页面 0，章节错误 0。
- 新增行不含内部项目代号、不含三段式版本号、不含本机绝对路径；这一步用**按文件内容匹配**的方式复查（此前一次自查把路径字符串当成了输入，等于没查，已重做）。
- 未在真实站点上验证配方与技能文档涉及的站点流程；沙箱、CDP 模式与 Firefox 差异属实现与既有实测结论的整理，本次未逐项重跑。

## 2026-09-21：AI Browser 批量指令定为 POST-only（去掉 GET／表单／`bodyJson` 残留）

### 已补齐

- 结论：`/commands` **只接受 POST + JSON 请求体**，`GET` 直接返回 `批量指令只支持 POST + JSON 请求体,请用 POST 并把命令放在请求体里`；表单、`bodyJson` 字段与 `getRequestMap()` 读取方式都已从源码移除。文档里「POST 优先、GET 兼容」的写法全部删除，只保留 **POST + JSON 对象载荷** 这一个推荐写法（另附 POST + 命令数组、POST + 单条命令两种同样受支持的写法），段落标题由“为什么推荐 POST”改为“为什么只支持 POST”（会改浏览器状态、命令 JSON 塞进 URL 要百分号编码且受长度限制）。
- [操作浏览器指令](<./docs/zh/65_ai-browser/03.md>)：接口参数表去掉 `bodyJson`，`id` 说明改为“可选：放在请求体里，数组体时放查询串 `?id=`”；“参数绑定”与 `execute_js` 一节按“**`execute_js` 可以用 JSON 请求体（也支持查询串／表单），`commands` 必须用 POST + JSON 请求体**”重写，不再把两个接口混为一谈；保留一张“老写法”表，只用于说明 GET／表单／`bodyJson` 各自的实际失败提示。
- [AI Browser 简介](<./docs/zh/65_ai-browser/01.md>)：`commands` 表格行与参数说明同步为 POST-only，并区分 `execute_js` 与 `commands` 的传参方式。
- [启动浏览器](<./docs/zh/65_ai-browser/02.md>)：参数绑定、`execute_js`、批量指令三处同步；明确 `commands` 不接受 GET、不接受表单，也没有 `bodyJson` 参数。
- 跟进源码的两处小改动：[操作浏览器指令](<./docs/zh/65_ai-browser/03.md>)“老写法”表里 `bodyJson` 字段一行的实际返回，改为源码新增的显式迁移提示 `不再支持 bodyJson 字段,请把命令直接放在请求体里,例如 {"id":1,"commands":[{"get_title":{}}]}`（原先写的是“被当成一条名为 `bodyJson` 的命令”）；错误信息侧，`briefMessage` 现在会截掉库异常尾部的版本号标记，文档中相关提示本来就写成 `请求体解析失败,批量指令需要 JSON：<原因>`、`set_headers 失败：<原因>` 这类占位形式，无版本号需要删除。

### 验证范围

- 源码核对：`batchExecute(HttpRequest)` 首行只放行 `HttpMethod.POST`，`queryId` 只从查询串取可选的 `id`，`bodyJson` 字段有显式迁移提示分支，`getRequestMap()` 读取已删除；`briefMessage` 会剥离异常尾部的版本号标记。
- `grep` 复查 `docs/zh/65_ai-browser/`：`bodyJson`、GET、表单在批量语境下只剩“不支持”这类说明性文字，没有任何“兼容”“老写法可用”的表述，也没有“`bodyJson` 被当成命令名”的旧说法。
- 文档中 9 条中文提示语与源码逐字一致；示例 JSON 与 `curl` 载荷全部解析通过，命令名全部存在于源码命令表。
- 新增行不含内部项目代号、不含形如三段式的版本号、不含本机绝对路径。
- `node scripts/audit-docs.mjs`：本地链接缺失 0，中文侧边栏缺失 0，章节错误 0。

## 2026-09-21：AI Browser 批量指令改为只支持 POST + JSON 请求体

### 已补齐

- [操作浏览器指令](<./docs/zh/65_ai-browser/03.md>)：批量一节按源码改写为 **只支持 POST + JSON 请求体**——新增“请求写法”表格（POST + 对象载荷、POST + 命令数组、POST + 单条命令对象）与三条完整 `curl` 示例；说明只有 POST 的三个理由（`/commands` 会改浏览器状态、命令 JSON 塞进 URL 要百分号编码且受长度限制、POST 请求体不受 URL 长度约束）；新增“老写法”表列出 GET、表单、`bodyJson` 字段各自的结果（GET 返回 `批量指令只支持 POST + JSON 请求体,请用 POST 并把命令放在请求体里`，表单体返回 `请求体解析失败,批量指令需要 JSON：<原因>`，`bodyJson` 字段返回迁移提示 `不再支持 bodyJson 字段,请把命令直接放在请求体里,例如 {"id":1,"commands":[{"get_title":{}}]}`）；请求体出错提示表改为源码当前文案（`请求体不能为空,需要命令数组或含 commands 的对象`、`请求体解析失败,批量指令需要 JSON：<原因>`、`缺少参数 id,可以放在查询串里,也可以放在对象载荷里`、`对象载荷必须包含 commands 数组,或者只写一条命令`、`命令数组为空`）；接口表格行改为“`id`（可选）、命令 JSON 请求体（POST 必需，没有 `bodyJson` 参数）”；PTC 的两个例子改为 `POST` + JSON 请求体；“参数绑定”与 `execute_js` 一节把“只有 `execute_js` 支持 JSON 请求体”改为 `execute_js` 与 `commands` 两个接口，并注明 `commands` 只接受 POST。
- [AI Browser 简介](<./docs/zh/65_ai-browser/01.md>)：`commands` 表格行与参数说明同步为“只接受 POST + JSON 请求体，`id` 可放查询串或对象载荷里”。
- [启动浏览器](<./docs/zh/65_ai-browser/02.md>)：参数绑定与“在页面中执行 JavaScript”两节同步改为两个接口支持 JSON 请求体；批量指令示例改为 `POST` + JSON 请求体，并说明请求体直接是命令数组时 `id` 必须放查询串、GET／表单／`bodyJson` 已不支持。

### 验证范围

- 源码逐条核对（以工作区当前源码为准）：`PlaywrightController.batchExecute(HttpRequest)` 只放行 `HttpMethod.POST`，`queryId` 只从查询串取 `id`，`batchParamFailure` 只用于查询串 `id` 的校验错误；`ActionService.batchExecute` 的 `请求体不能为空…`、`请求体解析失败…`、`缺少参数 id,可以放在查询串里…`、`对象载荷必须包含 commands 数组,或者只写一条命令`、`命令数组为空`、`每条命令对象只能包含一个键`、`不支持的命令：…` 与文档逐字一致。
- 说明：本轮给出的实测表（GET 兼容、POST + 表单、POST + JSON 里的 `bodyJson`、`缺少参数 id,可以在查询参数里传…`）与当前源码不一致——当前源码显式拒绝非 POST 请求，并已移除 `batchProgramOf` 与 `bodyJson` 分支；文档按源码写。
- `grep` 确认 `docs/zh/65_ai-browser/` 下已无“commands 支持 GET／表单／`bodyJson`”“只有 `execute_js` 支持 JSON 请求体”“直接 POST 纯 JSON 体不生效”等残留说法；保留下来的“JSON 请求体不生效”全部限定在“除 `execute_js` 与 `commands` 以外的接口”。
- 示例 JSON 与 `curl` 载荷逐条解析通过；新增行不含内部项目代号、不含形如三段式的版本号、不含本机绝对路径。
- `node scripts/audit-docs.mjs`：本地链接缺失 0，中文侧边栏缺失 0，章节错误 0。

## 2026-09-21：AI Browser 批量指令与快照文本说明同步

### 已补齐

- [操作浏览器指令](<./docs/zh/65_ai-browser/03.md>)：按源码重写“批量”一节——覆盖范围改为除 `commands` 自身之外的 78 个接口（老 17 个走老处理器注册表，其余 61 个走新命令表，两者对外表现一致），补齐数组与对象两种载荷（`id`、`stopOnError`、`commands` 三个字段）、`count`/`succeeded`/`failed`/`stopped`/`results` 逐步结果、`stopOnError` 默认 `true`、有失败时整体 `code` 为 `0` 但 `data.results` 完整返回、缺参数返回 `第 N 条命令 xxx 失败：缺少参数 xxx`、布尔参数缺失按 `false` 处理（`start` 的 `headless` 例外）、嵌套调用与未知命令的提示语，并新增 PTC 用途说明与“输入 → 回车 → 等待 → 取快照”一次请求完成的例子；新增“快照文本怎么读”小节，用百度首页真实样例逐条解释首尾标记、缩进层级、索引不连续、行尾 `/>`、无文字节点、属性保留范围、`value` 的两种含义、DOM 顺序，以及不可见元素不入快照、快照会过期等实测结论。
- [AI Browser 简介](<./docs/zh/65_ai-browser/01.md>)：结构化文本样例替换为百度首页真实快照，补充读法要点与指向“快照文本怎么读”的链接；`commands` 一行改为说明批量覆盖范围、逐步结果与 `stopOnError` 默认值。
- [启动浏览器](<./docs/zh/65_ai-browser/02.md>)：`execute_js` 作为批量指令的说明改为与源码一致（覆盖 78 个接口、对象载荷、逐步结果在 `data.results`），并指向“批量”一节。
- 复核修正（隐藏元素与边界标记）：此前把“快照里没有的隐藏元素改用选择器类接口”写成兜底手段，实测与源码均不成立——隐藏元素不满足可操作性检查，`input_text_by_selector` 等选择器、文本、角色、标签类接口会等满 5 秒后返回 `没匹配到可操作的元素(不存在或不可见): 选择器 #kw`（源码中该失败分支的注释也以百度首页被隐藏的 `#kw` 为例）。[操作浏览器指令](<./docs/zh/65_ai-browser/03.md>) 的“快照文本怎么读”改为“不可见元素既不在快照里、选择器类接口也操作不了它，只能用 `execute_js` 直接设值并派发 `input` 事件”，并补上可复制的 `execute_js` 示例；“定位方式”一节补上该失败提示与 5 秒等待；批量示例里的 `data.text` 片段由 `[Start of page]...` 改为 `[0]<a >新闻/>...`。[AI Browser 简介](<./docs/zh/65_ai-browser/01.md>) 同步修正读法要点与参数说明，并写明 `[Start of page]` / `[End of page]` 只来自 `src/test` 下测试/demo 代码（`DomServiceTest`、`PlayWrightTaobaoSearch`、`PlayWrightKeheLogin`）的 `System.out.println`，`get_dom_text` 接口不返回这两行（实测 `data.text` 第一行直接是 `[0]<a >新闻/>`）。

### 验证范围

- `grep` 确认 `docs/zh/65_ai-browser/` 下已无“批量仅覆盖老命令”“失败即整体中断且不返回逐步结果”“只返回整体成功与失败”“命令名只有老命令那几个”等过时说法。
- `grep` 复查“不可见”“隐藏”与选择器类接口名，确认已无“用选择器类接口操作隐藏元素”这类误导说法：命中处均为“选择器类接口要求元素可操作、隐藏元素只能走 `execute_js`”的纠正后表述。
- 用脚本比对控制器源码的 79 个 `@RequestPath`：除 `commands` 之外的 78 个接口名全部在修改后的文档中出现（缺失 0）；`CommandTable` 61 条加 `HandlerRegistry` 17 条等于 78，与批量覆盖范围一致。
- 新增内容不含内部项目代号、不含形如三段式的版本号、不含本机绝对路径（统一用 `~/Downloads/` 之类的用户目录写法）。
- 隐藏元素与边界标记两条结论来自真实服务实测（`input_text_by_selector`、`click_element_by_text` 的失败响应，`execute_js` 设值成功返回），并与 `PlaywrightService` 的失败提示分支核对一致；未覆盖真实网站的登录态与验证码场景。

## 2026-09-21：AI Browser 执行 JavaScript 接口

### 已补齐

- [启动浏览器](<./docs/zh/65_ai-browser/02.md>)：新增“在页面中执行 JavaScript”一节，说明 `/api/v1/playwright/execute_js` 的请求参数、三种脚本写法、返回值限制与错误信息；同时按源码修正包名、`start` 方法签名、`BrowserInstance` 字段、`close` 的资源释放顺序，以及示例中的业务码与端口。
- [操作浏览器指令](<./docs/zh/65_ai-browser/03.md>) 与 [AI Browser 简介](<./docs/zh/65_ai-browser/01.md>)：指令清单补充 `execute_js`。

### 验证范围

- `node scripts/audit-docs.mjs`：本地链接缺失 0，中文侧边栏缺失 0，章节错误 0。
- 文档中的接口示例在本地服务上实际调用通过：启动浏览器、导航、`execute_js`（表达式、箭头函数、含 `return` 的语句片段、异步函数）与关闭浏览器。
- 未验证真实网站的登录态与验证码场景，`execute_js` 的鉴权与访问控制需部署方自行补充。

## 2026-09-21：AI Browser 接口清单、元素索引与包名同步

### 已补齐

- [AI Browser 简介](<./docs/zh/65_ai-browser/01.md>)：操作指令集按源码重写为导航、元素交互、信息读取、状态查询、定位方式、标签页、等待、鼠标、截图与 PDF、Cookie 与存储、浏览器设置、弹窗与控制台、网络、批量共 14 组、79 个接口；结构化文本一节说明该文本由 `get_dom_text` 返回，并补充元素索引的来源、失效与 5 秒等待上限；参数说明修正为统一响应体、`id` 序列化为字符串、除 `execute_js` 外只从 query/form 取参，以及坐标与拖拽的真实参数形态。
- [启动浏览器](<./docs/zh/65_ai-browser/02.md>)：包名统一为 `nexus.io.ai.browser`；按源码补全 `BrowserInstance` 的快照、弹窗、日志与网络字段，补全 `start` 的启动参数、视口、权限与监听挂载；新增启动类 `PlaywrightApp` 与配置类 `PlaywrightAppConfig`、统一响应体与参数绑定两节，使用示例改为完整响应体并新增 `get_dom_text` 示例。
- [操作浏览器指令](<./docs/zh/65_ai-browser/03.md>)：新增通用约定（统一响应体、参数绑定、元素索引）与全部 79 个接口的完整 URL、参数、返回示例，覆盖超时提示、前进后退的历史记录判断、弹窗默认确认、凭据重建上下文、截图与 PDF 落盘、路由拦截与模拟、控制台日志与请求记录上限等实现细节。
- [dom构建- 将网页可点击元素提取与可视化](<./docs/zh/65_ai-browser/16.md>)：按源码改正 `DOMState` 的 6 参数构造器与页面高度字段，把 `DomService` 改为静态入口 `buildExpression()`、`evaluate(...)`、`getClickableElements(page, ...)`、`getSimpleText(page)`，同步更新核心类说明、代码块与测试示例。

### 验证范围

- `grep` 确认 4 篇文档中已无旧包名与旧接口名，接口名统一为 `get_dom_text`，启动类全名为 `nexus.io.ai.browser.PlaywrightApp`。
- 接口清单与参数名逐条比对控制器源码，共 79 个接口，分组顺序与控制器一致；未新增源码中不存在的接口或参数。
- 本次只修改文档，未启动服务实测接口；文档不记录底层依赖版本号，也不写入本机绝对路径。
- 未覆盖真实网站的登录态、验证码与反爬场景。

## 2026-09-15：tio-boot 核心文档检查

本次扫描了 719 个 Markdown 源文件，并按本地 `nexus.io` 源码核对核心启动、路由和测试行为。扫描只检查正文内可识别的本地 Markdown 链接与中文侧边栏，不验证外部站点、页内锚点或所有示例语义。

### 已补齐

- [Web Handler 方法与错误响应](<./docs/zh/06_web/32.md>)：完整 Java 示例、参数与状态码边界。
- [TioBootTest](<./docs/zh/13_testing/01.md>)：修正初始化、扫描、JUnit 注解和失败行为说明。
- [真实 HTTP 测试](<./docs/zh/13_testing/02.md>) 与 [数据库隔离测试](<./docs/zh/13_testing/03.md>)。
- [源码入口](<docs/zh/78_source-code/01.md>)、[启动与关闭](<docs/zh/78_source-code/03.md>)、[请求分发](<docs/zh/78_source-code/04.md>)。
- [底层 HTTP 服务与 tio-boot 的边界](<docs/zh/35_tio-http-server/06.md>)。
- [ApiTable 权限](<./docs/zh/16_api-table/10.md>) 与 [故障定位](<./docs/zh/16_api-table/11.md>)。
- 后台 [字段联动](<./docs/zh/74_tio-boot-admin/11.md>)、[Word](<./docs/zh/74_tio-boot-admin/12.md>)、[PDF](<./docs/zh/74_tio-boot-admin/13.md>) 管理：补充业务设计、SQL 和验收条件，不宣称已有转换/编辑服务。
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
| [docs/zh/16_api-table/06.md](<./docs/zh/16_api-table/06.md>) | 使用 api-table 连接 oracle |
| [docs/zh/38_netty-boot/07.md](<./docs/zh/38_netty-boot/07.md>) | 整合 Dubbo |
| [docs/zh/38_netty-boot/14.md](<./docs/zh/38_netty-boot/14.md>) | Reserve |
| [docs/zh/69_tio-im/06.md](<./docs/zh/69_tio-im/06.md>) | 登录 |
| [docs/zh/69_tio-im/07.md](<./docs/zh/69_tio-im/07.md>) | 历史消息 |
| [docs/zh/69_tio-im/08.md](<./docs/zh/69_tio-im/08.md>) | 发消息 |
| [docs/zh/41_groovy/02.md](<./docs/zh/41_groovy/02.md>) | 调试常用脚本 |
| [docs/zh/21_oceanbase/05.md](<./docs/zh/21_oceanbase/05.md>) | 待定 |
| [docs/zh/53_media/03.md](<./docs/zh/53_media/03.md>) | 待定 |
| [docs/zh/47_telegram4j/13.md](<./docs/zh/47_telegram4j/13.md>) | 处理回调查询 |
| [docs/zh/47_telegram4j/20.md](<./docs/zh/47_telegram4j/20.md>) | Telegram-Bot-Utils 使用指南 |
| [docs/zh/60_ai-agent/28.md](<./docs/zh/60_ai-agent/28.md>) | 待定 |
| [docs/zh/63_voice-agent/06.md](<./docs/zh/63_voice-agent/06.md>) | eleven labs |
| [docs/zh/60_ai-agent/09.md](<./docs/zh/60_ai-agent/09.md>) | 翻译 |
| [docs/zh/60_ai-agent/13.md](<./docs/zh/60_ai-agent/13.md>) | 自建 获取 youtube 字幕服务 |
| [docs/zh/60_ai-agent/15.md](<./docs/zh/60_ai-agent/15.md>) | 定向搜索 |
| [docs/zh/60_ai-agent/16.md](<./docs/zh/60_ai-agent/16.md>) | 16 |
| [docs/zh/60_ai-agent/17.md](<./docs/zh/60_ai-agent/17.md>) | 17 |
| [docs/zh/60_ai-agent/18.md](<./docs/zh/60_ai-agent/18.md>) | 18 |
| [docs/zh/66_java-uni-ai-server/04.md](<./docs/zh/66_java-uni-ai-server/04.md>) | 待定 |
| [docs/zh/68_java-kit-server/04.md](<./docs/zh/68_java-kit-server/04.md>) | 待定 |
| [docs/zh/68_java-kit-server/05.md](<./docs/zh/68_java-kit-server/05.md>) | 待定 |
| [docs/zh/68_java-kit-server/06.md](<./docs/zh/68_java-kit-server/06.md>) | 待定 |
| [docs/zh/72_tio-log-server/01.md](<./docs/zh/72_tio-log-server/01.md>) | 简介 |
| [docs/zh/72_tio-log-server/02.md](<./docs/zh/72_tio-log-server/02.md>) | 收集 docker 日志 |
| [docs/zh/72_tio-log-server/03.md](<./docs/zh/72_tio-log-server/03.md>) | 入库 |
| [docs/zh/32_third-party-auth/06.md](<./docs/zh/32_third-party-auth/06.md>) | 阿里云短信重置密码 |
| [docs/zh/32_third-party-auth/08.md](<./docs/zh/32_third-party-auth/08.md>) | 支付宝登录与绑定手机号 |

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
- 新增 [方法路由与业务鉴权](<./docs/zh/74_tio-boot-admin/19.md>)、[Db PostgreSQL 实践](<./docs/zh/15_java-db/32.md>)，同步路由源码说明、入门与相关目录。
- docs:check：721 个 Markdown，本地链接缺失 0、导航缺失 0；既有 29 个短页候选仍单独记录。
- docs:build：722 页面，272.26 秒成功。构建仍提示大 chunk 与 15.3 MB 搜索 worker 未预缓存。
- 本轮未执行生产数据库初始化 SQL；本地 Maven install 不代表已发布 Maven Central。

## 2026-09-16：章节重排、Redis 拆章与 AI 检索

- 熟悉文档后，按框架基础、数据库与中间件、网络通信、集成扩展、AI 和项目实践梳理入口。第 18—23 章统一为 `17_mybatis`、`28_redis`、`25_mongodb`、`26_elasticsearch`、`29_mq`、`30_kafka`。
- Redis 从缓存章迁出 9 篇文章，新增 [Docker 安装](./docs/zh/28_redis/00.md) 与章节导读。缓存章保留 Caffeine、CacheUtils 和 Ehcache；Kafka 与 AWS MSK 从 MQ 独立出来。
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
