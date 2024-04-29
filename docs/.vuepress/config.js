// 引入JSON文件
const head = require("./config/head");
const plugin = require("./config/plugins");
const themeConfig = require("./config/themeConfig");
const webpack = require("webpack");
module.exports = {
  base: "/",
  title: "Tio Boot Docs",
  description: "Java 高性能Web 快速开发框架",
  head: head,
  plugins: plugin,

  markdown: {
    lineNumbers: true,
  },
  themeConfig: themeConfig,
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        "process.env.CLIENT_ID": JSON.stringify(process.env.CLIENT_ID),
        "process.env.CLIENT_SECRET": JSON.stringify(process.env.CLIENT_SECRET),
        "process.env.GA": JSON.stringify(process.env.GA),
      }),
    ],
  },
};
