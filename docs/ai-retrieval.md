# AI 检索与文档数据入口

站点在每次构建时从当前 Markdown 正文生成检索资源，章节移动、改名或更新后无需手工维护另一份语料。

## 在线检索与语料下载

使用站内搜索可以快速定位文档；需要在本地建立检索索引时，可以按需下载以下资源：

<ul>
  <li><a href="/ai/chunks.jsonl" download="tio-boot-ai-corpus.jsonl">下载完整 AI 语料</a></li>
  <li><a href="/ai/index.json" download="tio-boot-ai-index.json">下载检索目录</a></li>
  <li><a href="/llms-full.txt" download="tio-boot-llms-full.txt">下载完整文档</a></li>
</ul>

站内浏览与搜索需要联网，资源按访问需要加载。保存 JSONL、章节正文或完整文档后，本地检索工具可以直接读取文件并离线检索；生成式问答需要另行配置本地模型。

## 资源地址

| 地址 | 用途 |
| --- | --- |
| `/llms.txt` | 按语言和章节组织的目录，链接到可直接读取的 Markdown |
| `/llms-full.txt` | 全站正文，适合离线下载 |
| `/ai/index.json` | 机器可读页面清单，schemaVersion 为 1 |
| `/ai/chunks.jsonl` | 按标题分段的语料，每行一个 JSON 对象 |
| `/ai/chapters/zh/28_redis.txt` | Redis 章节正文；其他章节使用相同路径规则 |
| `/ai/pages/zh/28_redis/01.md` | 单页 Markdown，正文链接已转换为站点绝对地址 |
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

`pnpm docs:test` 启动临时本地站点，用真实浏览器验证在线搜索、语料下载、章节别名与历史地址。测试需安装 Playwright 浏览器（`pnpm exec playwright install chromium`），也可通过 `PLAYWRIGHT_CHANNEL=chrome` 使用已安装的 Chrome。

旧章节 URL 和不带序号的章节别名均生成静态跳转页；Cloudflare Pages 可使用生成的 `_redirects` 获得 301 跳转。例如 `/zh/java-openai` 指向当前 OpenAI 章节，`/zh/java-openai/01.html` 指向对应文章。页面跳转脚本保留查询参数与 hash，但被改写标题的旧锚点不保证存在。

llms.txt 是社区提出的文档发现约定，参见 [llms.txt 提案](https://llmstxt.org/)。本仓库提供可获取、可导入的文本资源，不承诺外部 AI 产品一定抓取或收录，也不包含在线向量数据库或问答服务。
