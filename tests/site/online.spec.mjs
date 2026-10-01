import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { serveDocs } from './static-server.mjs';

let site;
test.beforeAll(async () => { site = await serveDocs(); });
test.afterAll(async () => { await site.close(); });

test('新访客按需访问、在线搜索及下载语料，不注册离线缓存', async ({ page }) => {
  site.requests.length = 0;
  await page.goto(site.url + '/ai-retrieval.html');
  await expect(page.getByRole('heading', { name: '在线检索与语料下载', exact: true })).toBeVisible();
  await page.waitForLoadState('networkidle');
  expect(await page.evaluate(async () => ({
    registrations: (await navigator.serviceWorker.getRegistrations()).length,
    caches: await caches.keys(),
  }))).toEqual({ registrations: 0, caches: [] });
  expect(site.requests.filter(url => /(?:service-worker|offline-manifest|llms-full|chunks\.jsonl|\/ai\/)/.test(url))).toEqual([]);
  await expect(page.locator('[data-offline-state], link[rel="manifest"]')).toHaveCount(0);

  await page.keyboard.press('Control+k');
  await page.locator('#search-pro').fill('RedisPlugin');
  const result = page.locator('#search-pro-results a[href*="/zh/28_redis/"]').first();
  await expect(result).toBeVisible();
  await result.click();
  await expect(page).toHaveURL(/\/zh\/28_redis\//);
  await page.reload();
  await expect(page.locator('h1').first()).toContainText(/Redis/i);

  await page.goto(site.url + '/ai-retrieval.html');
  for (const [name, file] of [
    ['下载完整 AI 语料', 'ai/chunks.jsonl'],
    ['下载检索目录', 'ai/index.json'],
    ['下载完整文档', 'llms-full.txt'],
  ]) {
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('link', { name, exact: true }).click();
    const download = await downloadPromise;
    expect(await download.failure()).toBeNull();
    const digest = data => createHash('sha256').update(data).digest('hex');
    expect(digest(await readFile(await download.path()))).toBe(digest(await readFile('docs/.vuepress/dist/' + file)));
  }
  const chapter = await page.request.get(site.url + '/ai/chapters/zh/28_redis.txt');
  expect(chapter.ok()).toBe(true);
  expect(await chapter.text()).toContain('Redis');
});
