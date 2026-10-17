import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { serveDocs } from './static-server.mjs';
import { llmsPlugin } from '../../docs/.vuepress/config/llms.js';
import path from 'node:path';

let site;
test.beforeAll(async () => { site = await serveDocs(); });
test.afterAll(async () => { await site.close(); });

test('开发预览提供与生产构建一致的 Markdown', async () => {
  const index = JSON.parse(await readFile('docs/.vuepress/dist/ai/index.json', 'utf8'));
  const pages = index.pages.map(p => ({ filePathRelative: p.source, path: decodeURI(new URL(p.url).pathname), frontmatter: {} }));
  const app = { pages, siteData: { base: '/preview/' }, dir: { source: p => path.resolve('docs', p) } };
  const options = {};
  llmsPlugin({ hostname: 'https://tio-boot.com' }).extendsBundlerOptions(options, app);
  let middleware;
  options.viteOptions.plugins[0].configureServer({ middlewares: { use: fn => { middleware = fn; } } });
  let body;
  await middleware({ url: '/preview/ai/pages/ai-retrieval.md' }, {
    setHeader() {}, end(value) { body = value; },
  }, error => { throw error || new Error('Markdown endpoint not handled'); });
  expect(body).toBe((await readFile('docs/.vuepress/dist/ai/pages/ai-retrieval.md', 'utf8')).replace(/^<!-- Source: .* -->\n\n/, ''));
});

test('复制当前文章 Markdown，支持移动端和页面切换', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(site.url + '/ai-retrieval.html');
  await page.getByRole('button', { name: '复制 Markdown', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('已复制到剪贴板');
  const expected = (await readFile('docs/.vuepress/dist/ai/pages/ai-retrieval.md', 'utf8'))
    .replace(/^<!-- Source: .* -->\n\n/, '');
  // Windows clipboard converts LF to CRLF; compare the Markdown text across platforms.
  expect((await page.evaluate(() => navigator.clipboard.readText())).replaceAll('\r\n', '\n')).toBe(expected);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('button', { name: '已复制 Markdown', exact: true })).toBeVisible();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.locator('.vp-navbar a[href="/about.html"]').click();
  await expect(page.getByRole('button', { name: '复制 Markdown', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '复制 Markdown', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('已复制到剪贴板');
  expect((await page.evaluate(() => navigator.clipboard.readText())).replaceAll('\r\n', '\n')).toBe(
    (await readFile('docs/.vuepress/dist/ai/pages/about.md', 'utf8')).replace(/^<!-- Source: .* -->\n\n/, ''),
  );
});

test('下载失败和剪贴板拒绝时提示重试及手动复制', async ({ page }) => {
  await page.goto(site.url + '/ai-retrieval.html');
  site.failPaths.add('/ai/pages/ai-retrieval.md');
  try {
    await page.getByRole('button', { name: '复制 Markdown', exact: true }).click();
    await expect(page.getByRole('status')).toContainText('复制失败');
  } finally { site.failPaths.clear(); }
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', {
    configurable: true, value: { writeText: async () => { throw new Error('Denied'); } },
  }));
  await page.getByRole('button', { name: '复制 Markdown', exact: true }).click();
  await expect(page.getByRole('link', { name: '打开 Markdown 手动复制' })).toHaveAttribute('href', '/ai/pages/ai-retrieval.md');
  await page.goto(site.url + '/');
  await expect(page.locator('.copy-markdown')).toHaveCount(0);
});
