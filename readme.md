# tio-boot-docs

`tio-boot-docs` 是 tio-boot 项目的文档站点，基于 VuePress 构建。

## 项目地址

* 文档主站：https://tio-boot.com/
* GitHub Pages：https://litongjava.github.io/tio-boot-docs/
* Gitee 仓库：https://gitee.com/ppnt/tio-boot-docs/tree/main/docs

## 文档地址

* 主站：https://tio-boot.com/
* 备用地址：https://env-00jxgnx7m5of-static.normal.cloudstatic.cn/tio-boot-docs/

## 本地开发

### 1. 切换 Node.js 版本

```bash
nvm use 20.13.1
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 启动开发服务器

```bash
pnpm docs:dev
```

## 构建文档

修改章节后先运行 `pnpm docs:check`，检查本地链接、侧边栏、顶部导航、遗漏的章节页面和连续编号。脚本不访问网络、不改写文件；链接、导航或编号错误返回非零退出码，短内容占位页作为人工审阅清单输出。它不验证外部链接、页内锚点或代码示例语义。

本次补全文档及剩余缺口见 [文档维护记录](./docs-maintenance.md)。

章节按 13 个学习主题分组，78 个目录使用连续编号与英文名称。阅读顺序见[文档导航](./docs/zh/guide.md)，旧路径映射见 [legacy-paths.json](./docs/.vuepress/config/legacy-paths.json)，构建时生成兼容跳转。

AI 检索入口与数据字段见 [AI 检索说明](./docs/ai-retrieval.md)。构建后运行 `pnpm docs:check-ai` 核验单页 Markdown、JSON/JSONL、内容哈希与旧页面跳转；所有检索产物随站点一起部署。

站内浏览与搜索在线使用，资源按需加载；浏览器和 CDN 使用正常的 HTTP 缓存。AI 检索页面提供 JSONL、检索目录和完整文档下载，保存后可供本地检索工具离线读取。

`pnpm docs:test` 执行浏览器测试，覆盖在线搜索、语料下载、章节别名、历史跳转和旧缓存退役。测试需先安装 Playwright Chromium，或设置 `PLAYWRIGHT_CHANNEL=chrome` 使用已安装的 Chrome。

发布时保留 `service-worker.js` 退役脚本及 `_headers`：已安装旧版离线功能的浏览器更新后，会清理本站对应作用域的缓存、注销旧 Service Worker，并重新打开当前地址。新访客不会注册 Service Worker。其他静态服务器也应对该脚本设置 `Cache-Control: no-cache`，并让带查询参数的请求返回同一脚本；不要将其改成 404 或首页。

执行以下命令：

```bash
pnpm docs:build
```

构建过程中内存不足时，可以增加 Node.js 最大可用内存：

```bash
NODE_OPTIONS="--max-old-space-size=8192" pnpm docs:build
```

构建完成后，生成文件位于：

```bash
docs/.vuepress/dist
```

可以使用以下命令查看构建结果：

```bash
ls docs/.vuepress/dist
```

## 部署到 Cloudflare Pages

使用 Wrangler 部署构建后的静态文件：

```bash
NODE_OPTIONS="--max-old-space-size=8192" pnpm docs:build
npx wrangler pages deploy docs/.vuepress/dist --project-name=tio-boot-docs
```

各部分含义：

- NODE_OPTIONS="--max-old-space-size=8192"：允许 Node.js 最多使用约 8GB 内存
- wrangler pages deploy：部署到 Cloudflare Pages
- docs/.vuepress/dist：本地待上传的静态文件目录
- --project-name=tio-boot-docs：部署到名为 tio-boot-docs 的 Pages 项目
执行后，Wrangler 会把该目录中的 HTML、JavaScript、CSS、图片等文件上传到 Cloudflare。它不会上传整个项目源码

## 使用 http-server 部署

创建 systemd 服务文件：

```bash
vi /lib/systemd/system/tio-boot-docs.service
```

写入以下内容：

```ini
[Unit]
Description=tio-boot-docs HTTP Server
After=network.target

[Service]
Type=simple
User=root
Restart=on-failure
RestartSec=5
ExecStart=/usr/bin/http-server -p 10062 /root/code/tio-boot-docs/docs/.vuepress/dist

[Install]
WantedBy=multi-user.target
```

保存后重新加载 systemd 配置：

```bash
systemctl daemon-reload
```

启用开机启动：

```bash
systemctl enable tio-boot-docs
```

启动服务：

```bash
systemctl start tio-boot-docs
```

查看服务状态：

```bash
systemctl status tio-boot-docs
```

停止服务：

```bash
systemctl stop tio-boot-docs
```

重启服务：

```bash
systemctl restart tio-boot-docs
```

服务启动后，可通过服务器的 `10062` 端口访问文档站点。

## 稳定的文档地址

对外引用文档时，使用不带章节编号的别名。例如：

- java-openai 章节：<https://tio-boot.cn/zh/java-openai/>
- java-openai 单篇文章：<https://tio-boot.cn/zh/java-openai/01.html>
- t-io 章节：<https://tio-boot.cn/zh/tio/>

别名通过静态跳转页和部署重定向指向当前章节，保留查询参数与页内锚点。目录继续使用 `序号_英文`，内部 Markdown 相对链接指向真实源文件。章节编号变化时，只需维护映射，源码仓库 README 无需再次改号。

映射见 [chapter-aliases.json](./docs/.vuepress/config/chapter-aliases.json)；完整页面跳转由 [legacy-paths.json](./docs/.vuepress/config/legacy-paths.json) 维护。构建后发布站点即可生效。
