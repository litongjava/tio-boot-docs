import { pwaPlugin } from "@vuepress/plugin-pwa";
import { seoPlugin } from "@vuepress/plugin-seo";
import { searchProPlugin } from "vuepress-plugin-search-pro";
import { prismjsPlugin } from "@vuepress/plugin-prismjs";
import { sitemapPlugin } from "@vuepress/plugin-sitemap";

export default [
  // searchPlugin({}),
  // pwaPlugin({}),
  seoPlugin({
    hostname: "tio-boot.com",
    // 选项
  }),
  searchProPlugin({
    // your options
  }),
  pwaPlugin({
    serviceWorker: true,
    updatePopup: {
      "/": {
        message: "New content is available.",
        buttonText: "Refresh",
      },
      "/zh/": {
        message: "发现新内容可用",
        buttonText: "刷新",
      },
    },
  }),
  prismjsPlugin({
    themes: {
      light: "vs", // 选择适合的浅色主题
      dark: "nord", // 选择适合的深色主题
    },
  }),
  // autoCatalogPlugin({
  //   //插件选项
  // }),
  sitemapPlugin({
    // 选项
    hostname: "tio-boot.com",
  }),
];
