import { pwaPlugin } from "@vuepress/plugin-pwa";
import { seoPlugin } from "@vuepress/plugin-seo";
import { searchProPlugin } from "vuepress-plugin-search-pro";
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
    favicon: "/logo.png",
    themeColor: "#3eaf7c",
    manifest: {
      name: "Tio Boot Docs",
      short_name: "tio-boot",
      description: "Java 高性能Web 快速开发框架",
      lang: "zh-CN",
      start_url: "/",
      scope: "/",
      display: "standalone",
      theme_color: "#3eaf7c",
      background_color: "#ffffff",
      orientation: "portrait-primary",
      prefer_related_applications: false,
      icons: [
        {
          src: "/logo-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/logo-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      screenshots: [
        {
          src: "/screenshot-desktop-1024x750.png",
          sizes: "1024x768",
          type: "image/png",
          form_factor: "wide",
        },
      ],
    },
    apple: {
      icon: "/logo-192x192.png",
      statusBarColor: "black",
    },
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
  // autoCatalogPlugin({
  //   //插件选项
  // }),
  sitemapPlugin({
    // 选项
    hostname: "tio-boot.com",
  }),
];
