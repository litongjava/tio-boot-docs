import { test, expect } from '@playwright/test';
import { serveDocs } from './static-server.mjs';
import { readFile } from 'node:fs/promises';

let site;
test.beforeAll(async () => { site = await serveDocs(); });
test.afterAll(async () => { await site.close(); });
test.beforeEach(() => { site.failPaths.clear(); site.failedRequests.length = 0; });

async function ready(page) {
  await page.goto(site.url+'/ai-retrieval.html');
  await expect(page.locator('[data-offline-state]')).toHaveAttribute('data-offline-state','ready',{timeout:180_000});
}

test('断网后刷新、搜索、打开结果并读取全部 AI 语料', async ({page,context}, testInfo) => {
  await ready(page);
  await page.screenshot({path:testInfo.outputPath('offline-ready.png'),fullPage:false});
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.clearBrowserCache');
  site.failPaths.add('*'); // Also fail every origin request, including SW requests.
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('[data-offline-state]')).toHaveAttribute('data-offline-state','ready');
  await page.keyboard.press('Control+k');
  await page.locator('#search-pro').fill('RedisPlugin');
  const result = page.locator('#search-pro-results a[href*="/zh/19_redis/"]').first();
  await expect(result).toBeVisible();
  await result.click();
  await expect(page).toHaveURL(/\/zh\/19_redis\//);
  await page.reload(); // a deep link that was never loaded as HTML while online
  await expect(page.locator('h1')).toContainText(/Redis/i);
  const corpus = await page.evaluate(async () => {
    const manifest = await (await fetch('/offline-manifest.json')).json();
    const index = await (await fetch('/ai/index.json')).json();
    const chunks = (await (await fetch('/ai/chunks.jsonl')).text()).trim().split('\n').map(JSON.parse);
    const full = await (await fetch('/llms-full.txt')).text();
    const aiResources = manifest.resources.filter(resource => resource.url.startsWith('ai/') || resource.url.startsWith('llms'));
    let next = 0, verified = 0;
    await Promise.all(Array.from({length:6},async () => {
      while (next < aiResources.length) {
        const resource = aiResources[next++];
        const response = await fetch('/'+resource.url);
        if (!response.ok || (await response.arrayBuffer()).byteLength !== resource.size) throw new Error(resource.url);
        verified++;
      }
    }));
    return {pages:index.pages.length,chunks:chunks.length,verified,
      redis:chunks.some(chunk=>chunk.pageId==='zh/19_redis/00.md'),full:full.includes('使用 Docker 安装 Redis')};
  });
  expect(corpus.pages).toBeGreaterThan(700);
  expect(corpus.chunks).toBeGreaterThan(9000);
  expect(corpus.verified).toBeGreaterThan(800);
  expect(corpus.redis && corpus.full).toBe(true);
  await testInfo.attach('offline-corpus-verification',{body:JSON.stringify({...corpus,browser:context.browser().version()},null,2),contentType:'application/json'});
  // A separate browser tab must also work offline, not just an already-running app.
  const secondPage = await context.newPage();
  await secondPage.goto(site.url+'/zh/19_redis/00.html');
  await expect(secondPage.locator('h1')).toContainText('使用 Docker 安装 Redis');
  await secondPage.goto(site.url+'/ai-retrieval.html');
  const downloadPromise = secondPage.waitForEvent('download');
  await secondPage.getByRole('link',{name:'下载完整 AI 语料',exact:true}).click();
  const download = await downloadPromise;
  expect(await download.failure()).toBeNull();
  const savedCorpus = await readFile(await download.path(),'utf8');
  expect(savedCorpus.trim().split('\n').length).toBe(corpus.chunks);
  console.log('Offline verification:', JSON.stringify({...corpus,browser:context.browser().version(),downloaded:true}));
});

test('丢失语料缓存时不宣称离线就绪', async ({page,context}) => {
  await ready(page);
  const removed = await page.evaluate(async () => {
    let removed = 0;
    for (const name of await caches.keys()) {
      const cache = await caches.open(name);
      for (const request of await cache.keys()) {
        if (new URL(request.url).pathname==='/ai/chunks.jsonl') {
          await cache.delete(request); removed++;
        }
      }
    }
    return removed;
  });
  expect(removed).toBeGreaterThan(0);
  await context.setOffline(true);
  await page.getByRole('button',{name:'检查状态 / 重试下载'}).click();
  await expect(page.locator('[data-offline-state]')).toHaveAttribute('data-offline-state','incomplete');
  await context.setOffline(false);
  await page.getByRole('button',{name:'检查状态 / 重试下载'}).click();
  await expect(page.locator('[data-offline-state]')).toHaveAttribute('data-offline-state','ready',{timeout:90_000});
});

test('首次下载中断不就绪，恢复联网下载后才就绪', async ({page}) => {
  site.failPaths.add('/llms-full.txt');
  await page.goto(site.url+'/ai-retrieval.html');
  await expect.poll(()=>site.failedRequests.length,{timeout:90_000}).toBeGreaterThan(0);
  await expect(page.locator('[data-offline-state]')).not.toHaveAttribute('data-offline-state','ready');
  site.failPaths.clear();
  await page.reload();
  await expect(page.locator('[data-offline-state]')).toHaveAttribute('data-offline-state','ready',{timeout:180_000});
});
