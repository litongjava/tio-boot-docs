export default [
  "/",
  { text: "文档导航", link: "/zh/guide" },
  {
    text: "Database",
    children: [
      { text: "java-db", link: "/zh/15_java-db/01" },
      { text: "api-table", link: "/zh/16_api-table/01" },
      { text: "jooq", link: "/zh/18_jooq/01" },
      { text: "mysql", link: "/zh/20_mysql/01" },
      { text: "postgresql", link: "/zh/19_postgresql/01" },
      { text: "oceanbase", link: "/zh/21_oceanbase/01" }
    ],
  },
  {
    text: "Enjoy",
    children: [{ text: "Enjoy", link: "/zh/11_enjoy/01" }],
  },

  {
    text: "Tio Boot Admin",
    children: [{ text: "Tio Boot Admin", link: "/zh/74_tio-boot-admin/01" }],
  },
  {
    text: "实战项目",
    children: [
      { text: "java-openai", link: "/zh/59_java-openai/01" },
      { text: "ai_agent", link: "/zh/60_ai-agent/01" },
      { text: "knowlege_base", link: "/zh/61_knowledge-base/01" },
      { text: "voice-agent", link: "/zh/63_voice-agent/01" },
      { text: "ai-search", link: "/zh/62_ai-search/01" },
      { text: "ai-coding", link: "/zh/64_ai-coding/01" },
      { text: "ai-browser", link: "/zh/65_ai-browser/01" },
    ],
  },
  {
    text: "最佳实践",
    children: [{ text: "案例", link: "/zh/75_examples/01" }],
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
