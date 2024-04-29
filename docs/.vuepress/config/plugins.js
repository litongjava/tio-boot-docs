// import { searchPlugin } from "@vuepress/plugin-search";
// import { pwaPlugin } from "@vuepress/plugin-pwa";
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
];
