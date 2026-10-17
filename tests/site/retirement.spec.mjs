import { test, expect } from '@playwright/test';
import { serveDocs } from './static-server.mjs';

// Reproduce the former worker's namespace, cached navigation and repair URL.
// No production fixture is published with the site.
const oldWorker = `
const cacheName = 'tio-boot-docs-precache-v2-' + self.registration.scope;
self.addEventListener('install', event => event.waitUntil((async () => {
  const cache = await caches.open(cacheName);
  await cache.put('/cached-document', new Response('<h1>Old cached document</h1>', {
    headers: { 'Content-Type': 'text/html' }
  }));
  await self.skipWaiting();
})()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate' && new URL(event.request.url).pathname === '/legacy-test.html') {
    event.respondWith(caches.open(cacheName).then(cache => cache.match('/cached-document')));
  }
});`;

let site;
test.beforeEach(async () => {
  site = await serveDocs();
  site.overrides.set('/legacy-test.html', { body: '<h1>Setup</h1>' });
  site.overrides.set('/service-worker.js', { body: oldWorker, type: 'text/javascript' });
  site.overrides.set('/other/service-worker.js', {
    body: "self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));",
    type: 'text/javascript',
  });
});
test.afterEach(async () => { await site.close(); });

for (const query of ['', '?repair=previous-install']) {
  test(`旧缓存退役并保留其他应用数据 ${query || '默认脚本地址'}`, async ({ page }) => {
    await page.goto(site.url + '/legacy-test.html');
    await page.evaluate(async query => {
      await navigator.serviceWorker.register('/service-worker.js' + query);
      await navigator.serviceWorker.ready;
      await navigator.serviceWorker.register('/other/service-worker.js', { scope: '/other/' });
      for (const name of ['unrelated-app', 'tio-boot-docs-precache-v2-' + location.origin + '/other/']) {
        const cache = await caches.open(name);
        await cache.put('/keep-me', new Response('preserve'));
      }
      localStorage.setItem('preference', 'keep');
      document.cookie = 'preference=keep; path=/';
    }, query);
    await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
    await page.goto(site.url + '/legacy-test.html?upgrade=1#buffer');
    await expect(page.getByRole('heading', { name: 'Old cached document' })).toBeVisible();

    site.overrides.delete('/service-worker.js');
    // Simulate the browser checking the already-installed worker for an update.
    await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.getRegistration('/');
      await registration.update();
    });
    await expect(page).toHaveURL(/\/legacy-test\.html\?upgrade=1#buffer$/);
    await expect(page.getByRole('heading', { name: 'Setup', exact: true })).toBeVisible();
    await expect.poll(() => page.evaluate(async () => Boolean(await navigator.serviceWorker.getRegistration('/')))).toBe(false);
    expect(await page.evaluate(async () => ({
      cacheNames: (await caches.keys()).sort(),
      registrations: (await navigator.serviceWorker.getRegistrations()).map(item => new URL(item.scope).pathname),
      preference: localStorage.getItem('preference'),
      cookie: document.cookie,
    }))).toEqual({
      cacheNames: ['tio-boot-docs-precache-v2-' + site.url + '/other/', 'unrelated-app'],
      registrations: ['/other/'],
      preference: 'keep',
      cookie: 'preference=keep',
    });
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Setup', exact: true })).toBeVisible();
    expect(await page.evaluate(() => navigator.serviceWorker.controller)).toBeNull();
  });
}

test('现有注册在访问新版页面后自动退役', async ({ page }) => {
  await page.goto(site.url + '/legacy-test.html');
  await page.evaluate(async () => {
    await navigator.serviceWorker.register('/service-worker.js?repair=previous-install');
    await navigator.serviceWorker.ready;
  });
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  site.overrides.delete('/service-worker.js');
  await page.goto(site.url + '/ai-retrieval.html');
  await expect(page.getByRole('heading', { name: '在线检索与语料下载', exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length)).toBe(0);
  await expect.poll(() => page.evaluate(() => caches.keys())).toEqual([]);
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(false);
});
