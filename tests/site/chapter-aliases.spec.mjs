import { test, expect } from '@playwright/test';
import { serveDocs } from './static-server.mjs';

let site;
test.beforeAll(async () => { site = await serveDocs(); });
test.afterAll(async () => { await site.close(); });
test.beforeEach(() => { site.failPaths.clear(); });

test('章节别名支持无尾斜杠、文章地址及查询参数和锚点', async ({ page }) => {
  await page.goto(site.url + '/zh/java-openai?from=readme#文章');
  await expect(page).toHaveURL(/\/zh\/59_java-openai\/\?from=readme#/);
  await expect(page.locator('h1')).toContainText('java-openai');
  await page.goto(site.url + '/zh/java-openai/01.html?from=readme#overview');
  await expect(page).toHaveURL(/\/zh\/59_java-openai\/01.html\?from=readme#overview$/);
  await expect(page.getByRole('heading', { name: '简介', exact: true })).toBeVisible();
  await page.goto(site.url + '/zh/tio/');
  await expect(page).toHaveURL(/\/zh\/34_tio\/$/);
  await expect(page.locator('.vp-sidebar')).toContainText('33 · AIO');
  await expect(page.locator('.vp-sidebar')).toContainText('34 · t-io');
});

test('历史地址和迁出的 Logback 文章仍然可访问', async ({ page }) => {
  await page.goto(site.url + '/zh/31_tio/33-buffer-reuse.html');
  await expect(page).toHaveURL(/\/zh\/34_tio\/33-buffer-reuse.html$/);
  await expect(page.locator('h1')).toContainText('缓冲区复用');
  await page.goto(site.url + '/zh/01_tio-boot%20%E7%AE%80%E4%BB%8B/04.html');
  await expect(page).toHaveURL(/\/zh\/03_logging\/01-logback.html$/);
  await expect(page.locator('h1')).toContainText('Logback');
});

