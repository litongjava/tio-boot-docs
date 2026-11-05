import { readFileSync } from "node:fs";
import { appendFile, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { defineConfig } from "vitepress";
import navbar from "./config/nav-en.js";
import sidebarSource from "./config/sidebar-zh.json";
import { generateLegacyRedirects } from "./config/legacy-redirects.js";
import { generateLlms } from "./config/llms.js";

const siteUrl = "https://tio-boot.com";
const alternateSiteUrl = "https://tio-boot.cn";
const siteName = "Tio Boot Docs";
const siteDescription = "Tio Boot 是基于 Java 的高性能 Web 快速开发框架文档，覆盖快速开始、数据库、AI 应用、实战项目与最佳实践。";
const siteKeywords = "Tio Boot,tio,tio-boot,Java Web,高性能 Web 框架,快速开发框架,Java AIO,后端开发";
const srcRoot = resolve(import.meta.dirname, "..");

const sourceOf = (link: string) => link.replace(/^\//, "").replace(/readme\.md$/i, "index.md");
const pathOf = (source: string) => "/" + source.replace(/(^|\/)index\.md$/, "$1").replace(/\.md$/, ".html");
const titleOf = (source: string) => {
  const text = readFileSync(join(srcRoot, source), "utf8").replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
  const body = text.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gm, "");
  const heading = body.match(/^#\s+(.+)$/m);
  return heading ? heading[1].replace(/`/g, "").trim() : source.split("/").pop()!.replace(/\.md$/, "");
};
const toSidebar = (items: any[]): any[] => items.map((item) => {
  if (typeof item === "string") {
    const source = sourceOf(item);
    return { text: source.endsWith("index.md") ? "概览" : titleOf(source), link: pathOf(source) };
  }
  if (item.children) return { text: item.text, collapsed: true, items: toSidebar(item.children) };
  return { text: item.text, link: item.link };
});
// Each page renders its sidebar into the HTML, so a page only carries its own
// chapter plus one link per chapter instead of every page on the site.
const firstPage = (items: any[]): string => {
  for (const item of items) {
    if (typeof item === "string") return pathOf(sourceOf(item));
    if (item.link) return item.link;
    if (item.children) return firstPage(item.children);
  }
  return "/zh/";
};
const allChapters = sidebarSource.map((group: any) => ({
  text: group.text,
  collapsed: true,
  items: group.children.map((chapter: any) => ({ text: chapter.text, link: chapter.link || firstPage(chapter.children) })),
}));
const buildSidebar = () => {
  const sidebar: Record<string, any[]> = { "/zh/": allChapters };
  for (const group of sidebarSource as any[]) for (const chapter of group.children) {
    if (!chapter.children) continue;
    const name = chapter.children.find((c: any) => typeof c === "string")?.match(/^\/zh\/([^/]+)\//)?.[1];
    if (name) sidebar[`/zh/${name}/`] = [
      { text: chapter.text, items: toSidebar(chapter.children) },
      { text: "全部章节", collapsed: true, items: allChapters },
    ];
  }
  return sidebar;
};
const toNav = (items: any[]): any[] => items.map((item) => {
  if (item === "/") return { text: "首页", link: "/" };
  if (typeof item === "string") return { text: item.replace(/^\//, "").replace(/^./, (c) => c.toUpperCase()), link: item + ".html" };
  if (item.children) return { text: item.text, items: toNav(item.children) };
  return { text: item.text, link: item.link };
});
const excerptOf = (source: string) => {
  try {
    return readFileSync(join(srcRoot, source), "utf8")
      .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "")
      .replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, " ")
      .replace(/^\s*#\s+.*$/m, " ")
      .replace(/!?(\[[^\]]*\])\([^)]*\)/g, "$1").replace(/<[^>]+>/g, " ")
      .replace(/[#>*_\[\]`]/g, " ").replace(/\[\[toc\]\]/g, " ").replace(/\s+/g, " ").trim().slice(0, 160);
  } catch { return ""; }
};

export default defineConfig({
  lang: "zh-CN",
  title: siteName,
  description: siteDescription,
  // Existing links use .html addresses; keep them unchanged.
  cleanUrls: false,
  // Examples point at services on localhost.
  ignoreDeadLinks: "localhostLinks",
  lastUpdated: true,
  metaChunk: true,
  head: [
    ["link", { rel: "icon", href: "/logo.png" }],
    ["meta", { name: "author", content: "litongjava@qq.com,jfinal@qq.com" }],
    ["meta", { name: "keywords", content: siteKeywords }],
    ["meta", { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" }],
    ["meta", { name: "googlebot", content: "index,follow" }],
    ["meta", { name: "baiduspider", content: "index,follow" }],
    ["meta", { property: "og:site_name", content: siteName }],
    ["link", { rel: "alternate", href: "/llms.txt", type: "text/plain", title: "LLMs.txt" }],
  ],
  sitemap: { hostname: siteUrl },
  markdown: { lineNumbers: true },
  transformPageData(pageData) {
    const path = pathOf(pageData.relativePath);
    const description = pageData.frontmatter.description || excerptOf(pageData.relativePath) || siteDescription;
    pageData.description = description;
    (pageData.frontmatter.head ??= []).push(
      ["link", { rel: "canonical", href: siteUrl + encodeURI(path) }],
      ["link", { rel: "alternate", href: alternateSiteUrl + encodeURI(path), hreflang: "zh-CN" }],
      ["meta", { property: "og:title", content: pageData.title ? `${pageData.title} | ${siteName}` : siteName }],
      ["meta", { property: "og:description", content: description }],
      ["meta", { property: "og:url", content: siteUrl + encodeURI(path) }],
      ["meta", { property: "og:image", content: `${siteUrl}/logo-512x512.png` }],
      ["meta", { name: "twitter:card", content: "summary" }],
      ["script", { type: "application/ld+json" }, JSON.stringify({
        "@context": "https://schema.org",
        "@type": pageData.frontmatter.layout === "home" ? "WebSite" : "TechArticle",
        [pageData.frontmatter.layout === "home" ? "name" : "headline"]: pageData.title || siteName,
        description,
        url: siteUrl + encodeURI(path),
        inLanguage: "zh-CN",
      }).replaceAll("<", "\\u003c")],
    );
  },
  async buildEnd(siteConfig) {
    const sources = siteConfig.pages.map((p) => p.replaceAll("\\", "/"));
    await generateLlms({ srcDir: siteConfig.srcDir, outDir: siteConfig.outDir, sources, hostname: siteUrl, siteName, siteDescription });
    await generateLegacyRedirects({ configDir: join(siteConfig.root, ".vitepress/config"), outDir: siteConfig.outDir, sources, hostname: siteUrl });
    const robots = join(siteConfig.outDir, "robots.txt");
    if (!(await readFile(robots, "utf8")).includes("Sitemap:")) await appendFile(robots, `\nSitemap: ${siteUrl}/sitemap.xml\n`);
  },
  themeConfig: {
    logo: "/logo.png",
    footer: { message: "MIT Licensed", copyright: "Copyright © 2023-present litongjava" },
    nav: toNav(navbar),
    sidebar: buildSidebar(),
    socialLinks: [{ icon: "github", link: "https://github.com/litongjava/tio-boot" }],
    editLink: { pattern: "https://github.com/litongjava/tio-boot-docs/edit/main/docs/:path", text: "编辑此页" },
    outline: { level: [2, 3], label: "本页目录" },
    docFooter: { prev: "上一页", next: "下一页" },
    lastUpdated: { text: "最后更新" },
    search: {
      provider: "local",
      options: {
        miniSearch: {
          options: {
            // The default tokenizer splits on whitespace only, which cannot index Chinese.
            tokenize: (text: string) => [...new Intl.Segmenter("zh-CN", { granularity: "word" }).segment(text)].filter((s) => s.isWordLike).map((s) => s.segment),
          },
          searchOptions: { prefix: true, fuzzy: 0.1, combineWith: "AND" },
        },
      },
    },
  },
});
