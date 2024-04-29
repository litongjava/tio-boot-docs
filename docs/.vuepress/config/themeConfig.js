import { defaultTheme } from "@vuepress/theme-default";
import navEn from "./nav-en";
import sidebarZh from "./sidebar-zh.json";
// import sidebarEn = require("./sidebar-en.json");

export default defaultTheme({
  logo: "./logo.png",
  lastUpdated: "Last Updated", // string | boolean,K
  navbar: navEn,
  sidebar: {
    "/zh/": sidebarZh,
    // "/en/": sidebarEn,
  },
});
