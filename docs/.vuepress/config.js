import { defineUserConfig } from "vuepress/cli";
import { viteBundler } from "@vuepress/bundler-vite";

// 引入JSON文件
import head from "./config/head";
import plugins from "./config/plugins";
import themeConfig from "./config/themeConfig";
export default defineUserConfig({
  base: "/",
  title: "Tio Boot Docs",
  description: "Java 高性能Web 快速开发框架",
  head: head,
  plugins: plugins,

  markdown: {
    lineNumbers: true,
  },
  theme: themeConfig,
  bundler: viteBundler(),
});
