export default [
  "/",
  {
    text: "Database",
    children: [
      { text: "java-db", link: "/zh/09_java-db/01" },
      { text: "api-table", link: "/zh/10_api-table/01" },
      { text: "jooq", link: "/zh/45_jooq/01" },
      { text: "mysql", link: "/zh/25_mysql/01" },
      { text: "postgresql", link: "/zh/24_postgresql/01" },
      { text: "oceanbase", link: "/zh/26_oceanbase/01" }
    ],
  },
  {
    text: "Enjoy",
    children: [{ text: "Enjoy", link: "/zh/15_enjoy/01" }],
  },

  {
    text: "Tio Boot Admin",
    children: [{ text: "Tio Boot Admin", link: "/zh/65_tio-boot-admin/01" }],
  },
  {
    text: "实战项目",
    children: [
      { text: "LLM", link: "/zh/54_LLM/01" },
      { text: "voice-agent", link: "/zh/55_voice-agent/01" },
      { text: "knowlege_base", link: "/zh/56_knowlege_base/01" },
      { text: "ai_agent", link: "/zh/57_ai_agent/01" },
      { text: "ai-search", link: "/zh/58_ai-search/01" },
    ],
  },
  {
    text: "最佳实践",
    children: [{ text: "案例", link: "/zh/76_案例/01" }],
  },

  "/about",
  { text: "AI 检索", link: "/ai-retrieval" },
  {
    text: "Source",
    icon: "info",
    children: [
      { text: "Github", link: "https://github.com/litongjava/tio-boot", icon: "githb" },
      { text: "Gitee", link: "https://gitee.com/ppnt/tio-boot", icon: "gitee" },
    ],
  },
];
