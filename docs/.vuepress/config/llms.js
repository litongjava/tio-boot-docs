import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const stripFrontmatter = (content) => content.replace(/^---[\s\S]*?---\s*/, "").trim();

const getSectionTitle = (filePathRelative) => {
  if (filePathRelative === "README.md") {
    return "Overview";
  }

  if (filePathRelative === "about.md") {
    return "About";
  }

  const section = filePathRelative.split("/")[0] || "Docs";
  return section.replace(/^\d+_/, "").replaceAll("_", " ");
};

const getPageDescription = async (app, page) => {
  const frontmatterDescription = page.frontmatter.description;

  if (typeof frontmatterDescription === "string" && frontmatterDescription.trim()) {
    return frontmatterDescription.trim();
  }

  if (page.frontmatter.home) {
    return page.frontmatter.tagline || app.siteData.description || "";
  }

  const sourcePath = app.dir.source(page.filePathRelative);
  const sourceContent = existsSync(sourcePath)
    ? stripFrontmatter(await readFile(sourcePath, "utf8"))
    : page.excerpt || page.contentRendered || page.content || "";

  return sourceContent
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_[\]()`-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
};

const getPageUrl = (hostname, pagePath) => {
  const normalizedHost = hostname.replace(/\/$/, "");
  return `${normalizedHost}${pagePath}`;
};

const getPages = (app) =>
  app.pages
    .filter((page) => page.filePathRelative && page.path !== "/404.html")
    .sort((left, right) => left.path.localeCompare(right.path, "zh-CN"));

const createLlmsIndex = async ({ app, hostname, siteName, siteDescription }) => {
  const groupedPages = new Map();

  for (const page of getPages(app)) {
    const sectionTitle = getSectionTitle(page.filePathRelative);
    const pages = groupedPages.get(sectionTitle) || [];
    pages.push(page);
    groupedPages.set(sectionTitle, pages);
  }

  const lines = [
    `# ${siteName}`,
    "",
    `> ${siteDescription}`,
    "",
    "This file helps AI assistants and agentic search tools discover the Tio Boot documentation.",
    "",
    "## Core Resources",
    "",
    `- [Full documentation](${getPageUrl(hostname, "/llms-full.txt")}): Complete Markdown content for all generated documentation pages.`,
    `- [Sitemap](${getPageUrl(hostname, "/sitemap.xml")}): Search engine sitemap for all generated pages.`,
    "",
  ];

  for (const [sectionTitle, pages] of groupedPages) {
    lines.push(`## ${sectionTitle}`, "");

    for (const page of pages) {
      const description = await getPageDescription(app, page);
      const suffix = description ? `: ${description}` : "";
      lines.push(`- [${page.title || page.path}](${getPageUrl(hostname, page.path)})${suffix}`);
    }

    lines.push("");
  }

  return `${lines.join("\n").trim()}\n`;
};

const createLlmsFull = async ({ app, hostname, siteName, siteDescription }) => {
  const lines = [
    `# ${siteName}`,
    "",
    `> ${siteDescription}`,
    "",
    `Source: ${hostname}`,
    "",
  ];

  for (const page of getPages(app)) {
    const sourcePath = app.dir.source(page.filePathRelative);

    if (!existsSync(sourcePath)) {
      continue;
    }

    const markdown = stripFrontmatter(await readFile(sourcePath, "utf8"));

    lines.push("---", "");
    lines.push(`# ${page.title || page.path}`, "");
    lines.push(`URL: ${getPageUrl(hostname, page.path)}`, "");

    if (markdown) {
      lines.push(markdown, "");
    }
  }

  return `${lines.join("\n").trim()}\n`;
};

export const llmsPlugin = ({ hostname, siteName, siteDescription }) => ({
  name: "tio-boot-llms",

  async onGenerated(app) {
    const options = { app, hostname, siteName, siteDescription };
    const llmsIndex = await createLlmsIndex(options);
    const llmsFull = await createLlmsFull(options);

    await writeFile(join(app.dir.dest(), "llms.txt"), llmsIndex);
    await writeFile(join(app.dir.dest(), "llms-full.txt"), llmsFull);
  },
});
