import { searchPlugin } from "@vuepress/plugin-search";
import { pwaPlugin } from "@vuepress/plugin-pwa";
import { seoPlugin } from "@vuepress/plugin-seo";
export default [
  searchPlugin({}),
  pwaPlugin({}),
  seoPlugin({
    // 选项
  }),
];
