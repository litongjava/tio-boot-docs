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
];
