export default [
  "/",
  {
    text: "Database",
    children: [
      { text: "java-db", link: "/zh/09_java-db/01" },
      { text: "api-table", link: "/zh/10_api-table/01" },
      { text: "jooq", link: "/zh/49_jooq/01" },
      { text: "mysql", link: "/zh/42_mysql/01" },
      { text: "postgresql", link: "/zh/41_postgresql/01" },
      { text: "oceanbase", link: "/zh/43_oceanbase/01" }
    ],
  },
  {
    text: "Enjoy",
    children: [{ text: "Enjoy", link: "/zh/15_enjoy/01" }],
  },

  {
    text: "Tio Boot Admin",
    children: [{ text: "Tio Boot Admin", link: "/zh/71_tio-boot-admin/01" }],
  },
  {
    text: "实战项目",
    children: [
      { text: "LLM", link: "/zh/60_LLM/01" },
      { text: "voice-agent", link: "/zh/61_voice-agent/01" },
      { text: "knowlege_base", link: "/zh/63_knowlege_base/01" },
      { text: "ai_agent", link: "/zh/64_ai_agent/01" },
      { text: "ai-search", link: "/zh/65_ai-search/01" },
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
