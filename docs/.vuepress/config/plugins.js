import { pwaPlugin } from "@vuepress/plugin-pwa";
import { seoPlugin } from "@vuepress/plugin-seo";
import { searchProPlugin } from "vuepress-plugin-search-pro";
import { sitemapPlugin } from "@vuepress/plugin-sitemap";
import { llmsPlugin } from "./llms";

const siteUrl = "https://tio-boot.com";
const alternateSiteUrl = "https://tio-boot.cn";
const siteName = "Tio Boot Docs";
const siteDescription = "Tio Boot 是基于 Java 的高性能 Web 快速开发框架文档，覆盖快速开始、数据库、AI 应用、实战项目与最佳实践。";
const siteKeywords = "Tio Boot,tio,tio-boot,Java Web,高性能 Web 框架,快速开发框架,Java AIO,后端开发";
const siteAuthor = {
  name: "Tong Li",
  url: "https://github.com/litongjava",
};

export default [
  // searchPlugin({}),
  // pwaPlugin({}),
  seoPlugin({
    hostname: siteUrl,
    canonical: siteUrl,
    author: siteAuthor,
    autoDescription: true,
    fallBackImage: `${siteUrl}/logo-512x512.png`,
    isArticle: (page) => Boolean(page.filePathRelative && !page.frontmatter.home),
    ogp: (ogp, page, app) => ({
      ...ogp,
      "og:site_name": siteName,
      "og:title": page.title ? `${page.title} | ${siteName}` : siteName,
      "og:description": page.frontmatter.description || app.siteData.description || siteDescription,
      "twitter:card": ogp["og:image"] ? "summary_large_image" : "summary",
      "twitter:title": page.title ? `${page.title} | ${siteName}` : siteName,
      "twitter:description": page.frontmatter.description || app.siteData.description || siteDescription,
    }),
    jsonLd: (jsonLd, page, app) => ({
      ...jsonLd,
      name: page.title || siteName,
      description: page.frontmatter.description || app.siteData.description || siteDescription,
      publisher: {
        "@type": "Organization",
        name: siteName,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/logo-512x512.png`,
        },
      },
    }),
    customHead: (head, page, app) => {
      const description = page.frontmatter.description || app.siteData.description || siteDescription;
      const pagePath = page.path.startsWith("/") ? page.path : `/${page.path}`;
      const addMeta = (name, content) => {
        if (!head.some((item) => item[0] === "meta" && item[1]?.name === name)) {
          head.push(["meta", { name, content }]);
        }
      };
      const addLink = (rel, href, extra = {}) => {
        if (!head.some((item) => item[0] === "link" && item[1]?.rel === rel && item[1]?.href === href)) {
          head.push(["link", { rel, href, ...extra }]);
        }
      };

      addMeta("description", description);
      addMeta("keywords", siteKeywords);
      addMeta("robots", "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1");
      addMeta("googlebot", "index,follow");
      addMeta("baiduspider", "index,follow");
      addLink("alternate", `${alternateSiteUrl}${pagePath}`, { hreflang: "zh-CN" });
      addLink("alternate", "/llms.txt", { type: "text/plain", title: "LLMs.txt" });
    },
  }),
  searchProPlugin({
    // your options
  }),
  pwaPlugin({
    serviceWorker: true,
    favicon: "/logo.png",
    themeColor: "#3eaf7c",
    manifest: {
      name: "Tio Boot Docs",
      short_name: "tio-boot",
      description: "Java 高性能Web 快速开发框架",
      lang: "zh-CN",
      start_url: "/",
      scope: "/",
      display: "standalone",
      theme_color: "#3eaf7c",
      background_color: "#ffffff",
      orientation: "portrait-primary",
      prefer_related_applications: false,
      icons: [
        {
          src: "/logo-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/logo-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      screenshots: [
        {
          src: "/screenshot-desktop-1024x750.png",
          sizes: "1024x768",
          type: "image/png",
          form_factor: "wide",
        },
      ],
    },
    apple: {
      icon: "/logo-192x192.png",
      statusBarColor: "black",
    },
    updatePopup: {
      "/": {
        message: "New content is available.",
        buttonText: "Refresh",
      },
      "/zh/": {
        message: "发现新内容可用",
        buttonText: "刷新",
      },
    },
  }),
  // autoCatalogPlugin({
  //   //插件选项
  // }),
  sitemapPlugin({
    hostname: siteUrl,
  }),
  llmsPlugin({
    hostname: siteUrl,
    siteName,
    siteDescription,
  }),
];
