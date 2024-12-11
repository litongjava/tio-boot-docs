export default [
  "/",
  {
    text: "Database",
    children: [
      { text: "java-db", link: "/zh/09_java-db/01" },
      { text: "api-table", link: "/zh/10_api-table/01" },
    ],
  },
  {
    text: "Enjoy",
    children: [{ text: "Enjoy", link: "/zh/15_enjoy/01" }],
  },

  {
    text: "Tio Boot Admin",
    children: [{ text: "Tio Boot Admin", link: "/zh/60_tio-boot-admin/01" }],
  },
  {
    text: "实战项目",
    children: [
      { text: "translator", link: "/zh/56_translator/01" },
      { text: "agent", link: "/zh/57_agent/01" },
      { text: "knowlege_base", link: "/zh/58_knowlege_base/01" },
      { text: "ai-search", link: "/zh/59_ai-search/01" },
    ],
  },
  {
    text: "最佳实践",
    children: [{ text: "案例", link: "/zh/99_案例/01" }],
  },

  "/about",
  {
    text: "Source",
    icon: "info",
    children: [
      { text: "Github", link: "https://github.com/litongjava/tio-boot", icon: "githb" },
      { text: "Gitee", link: "https://gitee.com/ppnt/tio-boot", icon: "gitee" },
    ],
  },
];
