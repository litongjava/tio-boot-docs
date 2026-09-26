# 文档补全与维护记录

## 2026-09-24：AI Browser 章节补齐现行工程的运行与配置文档

### 已补齐

- 先核对 `08.md` 与源码，改正三处**与实现不符**的描述：
  1. 生命周期原文写「每个任务使用独立的持久化浏览器上下文和 profile」，与实现相反 —— 浏览器与 profile 是**全进程共享**的（一个浏览器进程、一份 profile，任务之间靠页签隔离），原文的写法正是被取代掉的旧设计；
  2. profile 路径原写 `~/.config/browseruse/profiles/<id>`，实际默认按服务端口派生为 `shared-<端口>`；
  3. 补上「浏览器类型、有头/无头、profile 目录、可执行文件是浏览器级属性」这条：与正在运行的不一致时空闲才重建、有任务在跑就报错。
- [统一命令接口与人机协作](<./docs/zh/63_ai-brower/08.md>)：错误码表补 `RATE_LIMITED`，并给每一行加「可自动重试」列，说明 `data.retryable` 与 `data.retryAfterMs` 的建议退避值；批量一节补 `expect` 断言与 `stopOnExpectFailure`（断言没过时 `failed` 仍是 0、`expectFailed` 是 1），以及 `async` 异步作业；开头加后续章节导引。
- 新增 6 篇现行文档，填掉章节里「只有早期多端点方案」的空白：
  - [09. 浏览器、profile 与登录态](<./docs/zh/63_ai-brower/09.md>)：`browser` 参数五种取值与别名、`auto` 与显式取值的区别、回执里 `requestedBrowser`/`effectiveBrowser`/`engineHonored`/`mode`/`profileSeenBefore`/`note`/`profileNote` 各字段含义、profile 按端口派生、用户自己那份 Chrome profile（CDP 模式）的两个代价、Firefox 差异、Chromium 沙箱三档取值与「沙箱 + 管道」那条坑。
  - [10. 窗口尺寸与页面视口](<./docs/zh/63_ai-brower/10.md>)：窗口按**可用工作区**（扣任务栏）计算、`browser.viewport` 三档取值、默认从固定视口改成跟随窗口的原因与前后实测对照、截图像素与 `devicePixelRatio` 的换算、跟随窗口时不能同时给设备仿真参数、`set_viewport` 与元素在视口外的处理。
  - [11. 配置项与运维自省](<./docs/zh/63_ai-brower/11.md>)：配置读取优先级（`EnvUtils.get` 通道优先于服务自带配置，不要直接用 `System.getenv`）、36 个运行时可配项按用途分组、四个只读端点与两条非 `/playwright/` 前缀路由、`get_config` 的返回结构、启动与停止脚本、安全提示。
  - [12. 调用追踪、页面留档与文件上传](<./docs/zh/63_ai-brower/12.md>)：`logs/trace/` 四类产物与命名规则、排查顺序、脱敏规则与「尽力而为」的边界、`data/<id>/` 的留档时机与序号约定、客户端侧留档、`POST /playwright/upload` 的四种用法与安全约束、`execute_js` 的脚本目录。
  - [13. 命令清单](<./docs/zh/63_ai-brower/13.md>)：把 116 个方法按 23 个功能组列出，并补「按场景查方法」一表；说明 `commands` 不在方法清单里但可由分发层处理。
  - [14. 站点配方、技能与异步作业](<./docs/zh/63_ai-brower/14.md>)：配方文件格式与变量注入、仓库自带的 5 个配方、「主站套第三方控制台」这一整类站点的套路与最易踩的一步、技能与配方的分工、异步作业的状态与 50 个上限（含「结果在内存、服务重启即丢」这条限制）。
- [章节导航](<./docs/zh/63_ai-brower/readme.md>) 重写为「现行文档 / 原理与早期实现」两段，并点明 `01`、`06`、`07` 属早期实现、不能直接当当前 API 用。

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
- [操作浏览器指令](<./docs/zh/63_ai-brower/07.md>)：接口参数表去掉 `bodyJson`，`id` 说明改为“可选：放在请求体里，数组体时放查询串 `?id=`”；“参数绑定”与 `execute_js` 一节按“**`execute_js` 可以用 JSON 请求体（也支持查询串／表单），`commands` 必须用 POST + JSON 请求体**”重写，不再把两个接口混为一谈；保留一张“老写法”表，只用于说明 GET／表单／`bodyJson` 各自的实际失败提示。
- [AI Browser 简介](<./docs/zh/63_ai-brower/01.md>)：`commands` 表格行与参数说明同步为 POST-only，并区分 `execute_js` 与 `commands` 的传参方式。
- [启动浏览器](<./docs/zh/63_ai-brower/06.md>)：参数绑定、`execute_js`、批量指令三处同步；明确 `commands` 不接受 GET、不接受表单，也没有 `bodyJson` 参数。
- 跟进源码的两处小改动：[操作浏览器指令](<./docs/zh/63_ai-brower/07.md>)“老写法”表里 `bodyJson` 字段一行的实际返回，改为源码新增的显式迁移提示 `不再支持 bodyJson 字段,请把命令直接放在请求体里,例如 {"id":1,"commands":[{"get_title":{}}]}`（原先写的是“被当成一条名为 `bodyJson` 的命令”）；错误信息侧，`briefMessage` 现在会截掉库异常尾部的版本号标记，文档中相关提示本来就写成 `请求体解析失败,批量指令需要 JSON：<原因>`、`set_headers 失败：<原因>` 这类占位形式，无版本号需要删除。

### 验证范围

- 源码核对：`batchExecute(HttpRequest)` 首行只放行 `HttpMethod.POST`，`queryId` 只从查询串取可选的 `id`，`bodyJson` 字段有显式迁移提示分支，`getRequestMap()` 读取已删除；`briefMessage` 会剥离异常尾部的版本号标记。
- `grep` 复查 `docs/zh/63_ai-brower/`：`bodyJson`、GET、表单在批量语境下只剩“不支持”这类说明性文字，没有任何“兼容”“老写法可用”的表述，也没有“`bodyJson` 被当成命令名”的旧说法。
- 文档中 9 条中文提示语与源码逐字一致；示例 JSON 与 `curl` 载荷全部解析通过，命令名全部存在于源码命令表。
- 新增行不含内部项目代号、不含形如三段式的版本号、不含本机绝对路径。
- `node scripts/audit-docs.mjs`：本地链接缺失 0，中文侧边栏缺失 0，章节错误 0。

## 2026-09-21：AI Browser 批量指令改为只支持 POST + JSON 请求体

### 已补齐

- [操作浏览器指令](<./docs/zh/63_ai-brower/07.md>)：批量一节按源码改写为 **只支持 POST + JSON 请求体**——新增“请求写法”表格（POST + 对象载荷、POST + 命令数组、POST + 单条命令对象）与三条完整 `curl` 示例；说明只有 POST 的三个理由（`/commands` 会改浏览器状态、命令 JSON 塞进 URL 要百分号编码且受长度限制、POST 请求体不受 URL 长度约束）；新增“老写法”表列出 GET、表单、`bodyJson` 字段各自的结果（GET 返回 `批量指令只支持 POST + JSON 请求体,请用 POST 并把命令放在请求体里`，表单体返回 `请求体解析失败,批量指令需要 JSON：<原因>`，`bodyJson` 字段返回迁移提示 `不再支持 bodyJson 字段,请把命令直接放在请求体里,例如 {"id":1,"commands":[{"get_title":{}}]}`）；请求体出错提示表改为源码当前文案（`请求体不能为空,需要命令数组或含 commands 的对象`、`请求体解析失败,批量指令需要 JSON：<原因>`、`缺少参数 id,可以放在查询串里,也可以放在对象载荷里`、`对象载荷必须包含 commands 数组,或者只写一条命令`、`命令数组为空`）；接口表格行改为“`id`（可选）、命令 JSON 请求体（POST 必需，没有 `bodyJson` 参数）”；PTC 的两个例子改为 `POST` + JSON 请求体；“参数绑定”与 `execute_js` 一节把“只有 `execute_js` 支持 JSON 请求体”改为 `execute_js` 与 `commands` 两个接口，并注明 `commands` 只接受 POST。
- [AI Browser 简介](<./docs/zh/63_ai-brower/01.md>)：`commands` 表格行与参数说明同步为“只接受 POST + JSON 请求体，`id` 可放查询串或对象载荷里”。
- [启动浏览器](<./docs/zh/63_ai-brower/06.md>)：参数绑定与“在页面中执行 JavaScript”两节同步改为两个接口支持 JSON 请求体；批量指令示例改为 `POST` + JSON 请求体，并说明请求体直接是命令数组时 `id` 必须放查询串、GET／表单／`bodyJson` 已不支持。

### 验证范围

- 源码逐条核对（以工作区当前源码为准）：`PlaywrightController.batchExecute(HttpRequest)` 只放行 `HttpMethod.POST`，`queryId` 只从查询串取 `id`，`batchParamFailure` 只用于查询串 `id` 的校验错误；`ActionService.batchExecute` 的 `请求体不能为空…`、`请求体解析失败…`、`缺少参数 id,可以放在查询串里…`、`对象载荷必须包含 commands 数组,或者只写一条命令`、`命令数组为空`、`每条命令对象只能包含一个键`、`不支持的命令：…` 与文档逐字一致。
- 说明：本轮给出的实测表（GET 兼容、POST + 表单、POST + JSON 里的 `bodyJson`、`缺少参数 id,可以在查询参数里传…`）与当前源码不一致——当前源码显式拒绝非 POST 请求，并已移除 `batchProgramOf` 与 `bodyJson` 分支；文档按源码写。
- `grep` 确认 `docs/zh/63_ai-brower/` 下已无“commands 支持 GET／表单／`bodyJson`”“只有 `execute_js` 支持 JSON 请求体”“直接 POST 纯 JSON 体不生效”等残留说法；保留下来的“JSON 请求体不生效”全部限定在“除 `execute_js` 与 `commands` 以外的接口”。
- 示例 JSON 与 `curl` 载荷逐条解析通过；新增行不含内部项目代号、不含形如三段式的版本号、不含本机绝对路径。
- `node scripts/audit-docs.mjs`：本地链接缺失 0，中文侧边栏缺失 0，章节错误 0。

## 2026-09-21：AI Browser 批量指令与快照文本说明同步

### 已补齐

- [操作浏览器指令](<./docs/zh/63_ai-brower/07.md>)：按源码重写“批量”一节——覆盖范围改为除 `commands` 自身之外的 78 个接口（老 17 个走老处理器注册表，其余 61 个走新命令表，两者对外表现一致），补齐数组与对象两种载荷（`id`、`stopOnError`、`commands` 三个字段）、`count`/`succeeded`/`failed`/`stopped`/`results` 逐步结果、`stopOnError` 默认 `true`、有失败时整体 `code` 为 `0` 但 `data.results` 完整返回、缺参数返回 `第 N 条命令 xxx 失败：缺少参数 xxx`、布尔参数缺失按 `false` 处理（`start` 的 `headless` 例外）、嵌套调用与未知命令的提示语，并新增 PTC 用途说明与“输入 → 回车 → 等待 → 取快照”一次请求完成的例子；新增“快照文本怎么读”小节，用百度首页真实样例逐条解释首尾标记、缩进层级、索引不连续、行尾 `/>`、无文字节点、属性保留范围、`value` 的两种含义、DOM 顺序，以及不可见元素不入快照、快照会过期等实测结论。
- [AI Browser 简介](<./docs/zh/63_ai-brower/01.md>)：结构化文本样例替换为百度首页真实快照，补充读法要点与指向“快照文本怎么读”的链接；`commands` 一行改为说明批量覆盖范围、逐步结果与 `stopOnError` 默认值。
- [启动浏览器](<./docs/zh/63_ai-brower/06.md>)：`execute_js` 作为批量指令的说明改为与源码一致（覆盖 78 个接口、对象载荷、逐步结果在 `data.results`），并指向“批量”一节。
- 复核修正（隐藏元素与边界标记）：此前把“快照里没有的隐藏元素改用选择器类接口”写成兜底手段，实测与源码均不成立——隐藏元素不满足可操作性检查，`input_text_by_selector` 等选择器、文本、角色、标签类接口会等满 5 秒后返回 `没匹配到可操作的元素(不存在或不可见): 选择器 #kw`（源码中该失败分支的注释也以百度首页被隐藏的 `#kw` 为例）。[操作浏览器指令](<./docs/zh/63_ai-brower/07.md>) 的“快照文本怎么读”改为“不可见元素既不在快照里、选择器类接口也操作不了它，只能用 `execute_js` 直接设值并派发 `input` 事件”，并补上可复制的 `execute_js` 示例；“定位方式”一节补上该失败提示与 5 秒等待；批量示例里的 `data.text` 片段由 `[Start of page]...` 改为 `[0]<a >新闻/>...`。[AI Browser 简介](<./docs/zh/63_ai-brower/01.md>) 同步修正读法要点与参数说明，并写明 `[Start of page]` / `[End of page]` 只来自 `src/test` 下测试/demo 代码（`DomServiceTest`、`PlayWrightTaobaoSearch`、`PlayWrightKeheLogin`）的 `System.out.println`，`get_dom_text` 接口不返回这两行（实测 `data.text` 第一行直接是 `[0]<a >新闻/>`）。

### 验证范围

- `grep` 确认 `docs/zh/63_ai-brower/` 下已无“批量仅覆盖老命令”“失败即整体中断且不返回逐步结果”“只返回整体成功与失败”“命令名只有老命令那几个”等过时说法。
- `grep` 复查“不可见”“隐藏”与选择器类接口名，确认已无“用选择器类接口操作隐藏元素”这类误导说法：命中处均为“选择器类接口要求元素可操作、隐藏元素只能走 `execute_js`”的纠正后表述。
- 用脚本比对控制器源码的 79 个 `@RequestPath`：除 `commands` 之外的 78 个接口名全部在修改后的文档中出现（缺失 0）；`CommandTable` 61 条加 `HandlerRegistry` 17 条等于 78，与批量覆盖范围一致。
- 新增内容不含内部项目代号、不含形如三段式的版本号、不含本机绝对路径（统一用 `~/Downloads/` 之类的用户目录写法）。
- 隐藏元素与边界标记两条结论来自真实服务实测（`input_text_by_selector`、`click_element_by_text` 的失败响应，`execute_js` 设值成功返回），并与 `PlaywrightService` 的失败提示分支核对一致；未覆盖真实网站的登录态与验证码场景。

## 2026-09-21：AI Browser 执行 JavaScript 接口

### 已补齐

- [启动浏览器](<./docs/zh/63_ai-brower/06.md>)：新增“在页面中执行 JavaScript”一节，说明 `/api/v1/playwright/execute_js` 的请求参数、三种脚本写法、返回值限制与错误信息；同时按源码修正包名、`start` 方法签名、`BrowserInstance` 字段、`close` 的资源释放顺序，以及示例中的业务码与端口。
- [操作浏览器指令](<./docs/zh/63_ai-brower/07.md>) 与 [AI Browser 简介](<./docs/zh/63_ai-brower/01.md>)：指令清单补充 `execute_js`。

### 验证范围

- `node scripts/audit-docs.mjs`：本地链接缺失 0，中文侧边栏缺失 0，章节错误 0。
- 文档中的接口示例在本地服务上实际调用通过：启动浏览器、导航、`execute_js`（表达式、箭头函数、含 `return` 的语句片段、异步函数）与关闭浏览器。
- 未验证真实网站的登录态与验证码场景，`execute_js` 的鉴权与访问控制需部署方自行补充。

## 2026-09-21：AI Browser 接口清单、元素索引与包名同步

### 已补齐

- [AI Browser 简介](<./docs/zh/63_ai-brower/01.md>)：操作指令集按源码重写为导航、元素交互、信息读取、状态查询、定位方式、标签页、等待、鼠标、截图与 PDF、Cookie 与存储、浏览器设置、弹窗与控制台、网络、批量共 14 组、79 个接口；结构化文本一节说明该文本由 `get_dom_text` 返回，并补充元素索引的来源、失效与 5 秒等待上限；参数说明修正为统一响应体、`id` 序列化为字符串、除 `execute_js` 外只从 query/form 取参，以及坐标与拖拽的真实参数形态。
- [启动浏览器](<./docs/zh/63_ai-brower/06.md>)：包名统一为 `nexus.io.ai.browser`；按源码补全 `BrowserInstance` 的快照、弹窗、日志与网络字段，补全 `start` 的启动参数、视口、权限与监听挂载；新增启动类 `PlaywrightApp` 与配置类 `PlaywrightAppConfig`、统一响应体与参数绑定两节，使用示例改为完整响应体并新增 `get_dom_text` 示例。
- [操作浏览器指令](<./docs/zh/63_ai-brower/07.md>)：新增通用约定（统一响应体、参数绑定、元素索引）与全部 79 个接口的完整 URL、参数、返回示例，覆盖超时提示、前进后退的历史记录判断、弹窗默认确认、凭据重建上下文、截图与 PDF 落盘、路由拦截与模拟、控制台日志与请求记录上限等实现细节。
- [dom构建- 将网页可点击元素提取与可视化](<./docs/zh/63_ai-brower/04.md>)：按源码改正 `DOMState` 的 6 参数构造器与页面高度字段，把 `DomService` 改为静态入口 `buildExpression()`、`evaluate(...)`、`getClickableElements(page, ...)`、`getSimpleText(page)`，同步更新核心类说明、代码块与测试示例。

### 验证范围

- `grep` 确认 4 篇文档中已无旧包名与旧接口名，接口名统一为 `get_dom_text`，启动类全名为 `nexus.io.ai.browser.PlaywrightApp`。
- 接口清单与参数名逐条比对控制器源码，共 79 个接口，分组顺序与控制器一致；未新增源码中不存在的接口或参数。
- 本次只修改文档，未启动服务实测接口；文档不记录底层依赖版本号，也不写入本机绝对路径。
- 未覆盖真实网站的登录态、验证码与反爬场景。

## 2026-09-15：tio-boot 核心文档检查

本次扫描了 719 个 Markdown 源文件，并按本地 `nexus.io` 源码核对核心启动、路由和测试行为。扫描只检查正文内可识别的本地 Markdown 链接与中文侧边栏，不验证外部站点、页内锚点或所有示例语义。

### 已补齐

- [Web Handler 方法与错误响应](<./docs/zh/06_web/32.md>)：完整 Java 示例、参数与状态码边界。
- [TioBootTest](<./docs/zh/17_tests/01.md>)：修正初始化、扫描、JUnit 注解和失败行为说明。
- [真实 HTTP 测试](<./docs/zh/17_tests/02.md>) 与 [数据库隔离测试](<./docs/zh/17_tests/03.md>)。
- [源码入口](<docs/zh/76_tio-boot/01.md>)、[启动与关闭](<docs/zh/76_tio-boot/03.md>)、[请求分发](<docs/zh/76_tio-boot/04.md>)。
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
| [docs/zh/70_tio-im/06.md](<./docs/zh/70_tio-im/06.md>) | 登录 |
| [docs/zh/70_tio-im/07.md](<./docs/zh/70_tio-im/07.md>) | 历史消息 |
| [docs/zh/70_tio-im/08.md](<./docs/zh/70_tio-im/08.md>) | 发消息 |
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
| [docs/zh/74_tio-log-server/01.md](<./docs/zh/74_tio-log-server/01.md>) | 简介 |
| [docs/zh/74_tio-log-server/02.md](<./docs/zh/74_tio-log-server/02.md>) | 收集 docker 日志 |
| [docs/zh/74_tio-log-server/03.md](<./docs/zh/74_tio-log-server/03.md>) | 入库 |
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
