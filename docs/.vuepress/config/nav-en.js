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
    children: [{ text: "Tio Boot Admin", link: "/zh/70_tio-boot-admin/01" }],
  },
  {
    text: "实战项目",
    children: [
      { text: "ai_agent", link: "/zh/61_ai_agent/01" },
      { text: "translator", link: "/zh/62_translator/01" },
      { text: "knowlege_base", link: "/zh/63_knowlege_base/01" },
      { text: "ai-search", link: "/zh/64_ai-search/01" },
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
