# tio-boot-docs

[github](https://litongjava.github.io/tio-boot-docs)
[gitee](https://gitee.com/ppnt/tio-boot-docs/tree/main/docs)

[文档地址 1](https://litongjava.github.io/tio-boot-docs/)
[备用文档地址 1](https://env-00jxgnx7m5of-static.normal.cloudstatic.cn/tio-boot-docs/)

## build

```
nvm use 20.13.1
```

```
pnpm install
```

```
pnpm docs:dev
```

```
pnpm docs:build
```

```
NODE_OPTIONS="--max-old-space-size=4096" pnpm docs:build
```

```
ls docs/.vuepress/dist
```

or
```
npx wrangler pages deploy docs/.vuepress/dist --project-name=tio-boot-docs
```

```
NODE_OPTIONS="--max-old-space-size=8192" npx wrangler deploy
```

vi /lib/systemd/system/tio-boot-docs.service

```
[Unit]
Description=HTTP Server
After=network.target

[Service]
Type=simple
User=root
Restart=on-failure
RestartSec=5s
ExecStart=/usr/bin/http-server -port 10062 -dir /root/code/tio-boot-docs/docs/.vuepress/dist/

[Install]
WantedBy=multi-user.target
```

```
systemctl enable tio-boot-docs
systemctl start tio-boot-docs
systemctl status tio-boot-docs
systemctl stop tio-boot-docs
```