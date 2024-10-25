import { pwaPlugin } from "@vuepress/plugin-pwa";
import { seoPlugin } from "@vuepress/plugin-seo";
import { searchProPlugin } from "vuepress-plugin-search-pro";
export default [
  // searchPlugin({}),
  // pwaPlugin({}),
  seoPlugin({
    hostname: "tio-boot-docs.vercel.app",
    // 选项
  }),
  searchProPlugin({
    // your options
  }),
  pwaPlugin({
    serviceWorker: true,
    manifest: {
      name: "Tio Boot Docs",
      short_name: "tio-boot",
      lang: "zh-CN",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#3eaf7c",
      icons: [
        {
          src: "/images/logo-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/images/logo-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    updatePopup: {
      message: "发现新内容可用",
      buttonText: "刷新",
    },
  }),
  // autoCatalogPlugin({
  //   //插件选项
  // }),
];
