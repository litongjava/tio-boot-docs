FROM node:22-alpine AS builder
LABEL "language"="nodejs"
LABEL "framework"="vitepress"

WORKDIR /src

RUN npm install -f -g pnpm@latest || npm install -f -g pnpm@8
COPY . .
RUN pnpm install
RUN pnpm docs:build

FROM zeabur/caddy-static
COPY --from=builder /src/docs/.vitepress/dist /usr/share/caddy

EXPOSE 8080