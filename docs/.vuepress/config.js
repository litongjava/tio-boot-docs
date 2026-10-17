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
  shouldPrefetch: false,
  head: head,
  plugins: plugins,

  markdown: {
    lineNumbers: true,
    math: {
      type: "katex", // 或 'mathjax'
    },
  },
  theme: themeConfig,
  bundler: viteBundler(),
  extendsPage: (page) => {
    // 在 routeMeta 中设置目录信息
    page.routeMeta = {
      // 目录标题
      title: page.title,
      // ... 其他信息
    };
  },
});
