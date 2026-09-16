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

章节已连续编号；第 18—23 章为 MyBatis、Redis、MongoDB、Elasticsearch、MQ、Kafka。旧路径映射见 [legacy-paths.json](./docs/.vuepress/config/legacy-paths.json)，构建时生成兼容跳转。

AI 检索入口与数据字段见 [AI 检索说明](./docs/ai-retrieval.md)。构建后运行 `pnpm docs:check-ai` 核验单页 Markdown、JSON/JSONL、内容哈希与旧页面跳转；所有检索产物随站点一起部署。

站内搜索和 AI 语料支持离线使用：首次通过 HTTPS 或 localhost 联网访问，等待 AI 检索页面显示“离线已就绪”，之后可在同一浏览器中断网搜索、打开结果、读取或下载语料。首次准备约需下载 100 MB；清除站点数据或浏览器回收缓存后需要重新准备。下载的 JSONL 也可直接供本地检索工具读取。

`pnpm docs:check-offline` 校验缓存清单，`pnpm docs:test-offline` 执行浏览器断网测试。测试需先安装 Playwright Chromium，或设置 `PLAYWRIGHT_CHANNEL=chrome` 使用已安装的 Chrome。测试同时关闭浏览器网络、清除普通 HTTP 缓存并拒绝本地服务器请求，覆盖搜索、结果页刷新、完整语料读取与下载，以及缓存缺失和首次下载中断。

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
