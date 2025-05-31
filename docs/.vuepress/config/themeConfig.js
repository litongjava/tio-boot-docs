import { defaultTheme } from "@vuepress/theme-default";
import navEn from "./nav-en";
import sidebarZh from "./sidebar-zh.json";
// import sidebarEn = require("./sidebar-en.json");

export default defaultTheme({
  logo: "./logo.png",
  lastUpdated: "Last Updated", // string | boolean,K
  editLink: true,
  docsRepo: "https://github.com/litongjava/tio-boot-docs",
  docsBranch: "main",
  editLinkPattern: ":repo/edit/:branch/docs/:path",
  navbar: navEn,
  sidebar: {
    "/zh/": sidebarZh,
    // "/en/": sidebarEn,
  },
});
