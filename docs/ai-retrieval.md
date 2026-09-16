# AI 检索与文档数据入口

站点在每次构建时从当前 Markdown 正文生成检索资源，章节移动、改名或更新后无需手工维护另一份语料。

## 离线搜索与 AI 语料

**本站支持离线搜索和完整 AI 语料读取。** 首次联网访问后，等待下方显示“离线已就绪”，即可在同一浏览器、同一站点地址下断网搜索、打开搜索结果及读取语料。离线缓存包含搜索索引与 worker、页面程序、llms 文件、检索目录、分段语料、章节正文和单页 Markdown。

<OfflineStatus />

首次准备需要下载完整资源，大小以下方状态为准；缓存未完成、安装失败或空间不足时不会显示“离线已就绪”。浏览器需要支持 Service Worker，并通过 HTTPS 或 localhost 访问。清除站点数据、浏览器回收缓存或更换浏览器后，需要联网重新准备。外部网站、外链图片和远程模型 API 仍需要网络。

通过上方下载链接保存 JSONL 或完整文档后，本地检索工具可以直接读取文件，无需浏览器缓存，也无需联网；生成式问答需要另行配置本地模型。浏览器缓存只服务该浏览器中的站点请求，其他 AI 客户端应使用下载的语料文件。

## 资源地址

| 地址 | 用途 |
| --- | --- |
| `/llms.txt` | 按语言和章节组织的目录，链接到可直接读取的 Markdown |
| `/llms-full.txt` | 全站正文，适合离线下载 |
| `/ai/index.json` | 机器可读页面清单，schemaVersion 为 1 |
| `/ai/chunks.jsonl` | 按标题分段的语料，每行一个 JSON 对象 |
| `/ai/chapters/zh/19_redis.txt` | Redis 章节正文；其他章节使用相同路径规则 |
| `/ai/pages/zh/19_redis/01.md` | 单页 Markdown，正文链接已转换为站点绝对地址 |
| `/ai/redirects.json` | 旧 Markdown 源路径到新源路径的迁移映射 |
| `/sitemap.xml` | 可被搜索引擎发现的 HTML 页面清单 |

## 检索流程

1. 读取 llms.txt 或 ai/index.json，按章节、标题、关键词和摘要筛选候选页。
2. 下载 markdownUrl 指向的原文，或将 chunks.jsonl 导入自己的全文/向量索引。分段遵循代码块外的标题，代码示例不会因为其中的 # 字符被切开；单段长度不固定。
3. 将问题、相关段落和对应 url 交给模型，回答时引用 url 指向的正式文档页面。
4. 使用 sha256 判断正文是否变化，按 id 更新或删除索引记录。构建中移除的页面也应从下游索引删除。

页面记录包含 id、source、title、language、chapter、url、markdownUrl、description、keywords、status 和 sha256。分段记录还包含 pageId、heading、content；分段 id 的序号会随标题调整变化，因此应按页面整体更新分段。

status 为 placeholder 表示按长度或仅含标题识别的短内容候选。它不是对所有内容质量的判定；检索时应结合正文中的适用版本、前置条件和功能限制。不要将目录页或占位标题推断为已经实现的功能。

## 构建与部署

运行 `pnpm docs:check` 检查源文档，运行 `pnpm docs:build` 生成页面和语料，再运行 `pnpm docs:check-ai` 验证生成结果。发布整个 `docs/.vuepress/dist`，保留 ai 目录、llms 文件和 robots.txt。

`pnpm docs:check-offline` 检查离线缓存清单；`pnpm docs:test-offline` 启动临时本地站点，用真实浏览器验证准备完成后断网搜索、刷新页面、打开结果和读取 AI 语料。测试需安装 Playwright 浏览器（`pnpm exec playwright install chromium`），也可通过 `PLAYWRIGHT_CHANNEL=chrome` 使用已安装的 Chrome。

构建先生成搜索索引与 AI 语料，再生成 Service Worker，必需语料缺失时构建直接失败。缓存采用内容版本校验；新版本完整下载后再通过更新提示启用，下载中断不会把未完成的版本标为就绪。VuePress 页面在断网时由已缓存的页面程序渲染，外部资源不包含在离线承诺内。

旧章节 URL 在静态站点生成跳转页；Cloudflare Pages 可使用生成的 _redirects 获得 301 跳转。`22_MQ` 到 `22_mq` 仅大小写不同，在 Windows 文件系统上不能同时生成两份页面；使用其他区分大小写的静态服务器时，需要按 _redirects 配置这组旧地址。页面跳转脚本保留查询参数与 hash，但被改写标题的旧锚点不保证存在。

llms.txt 是社区提出的文档发现约定，参见 [llms.txt 提案](https://llmstxt.org/)。本仓库提供可获取、可导入的文本资源，不承诺外部 AI 产品一定抓取或收录，也不包含在线向量数据库或问答服务。
