# tio-boot-docs

`tio-boot-docs` 是 tio-boot 项目的文档站点，基于 VuePress 构建。

## 项目地址

* GitHub Pages：https://litongjava.github.io/tio-boot-docs/
* Gitee 仓库：https://gitee.com/ppnt/tio-boot-docs/tree/main/docs

## 文档地址

* 主站：https://litongjava.github.io/tio-boot-docs/
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
