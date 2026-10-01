import { test, expect } from '@playwright/test';
import { readdir, readFile } from 'node:fs/promises';

test('发布产物保留退役脚本和正常资源，移除离线包', async () => {
  const dest = 'docs/.vuepress/dist/';
  const files = await readdir(dest);
  expect(files.filter(name => /^(?:offline-|workbox-)|^manifest\.webmanifest$/.test(name))).toEqual([]);
  expect(files).toEqual(expect.arrayContaining(['service-worker.js', '_headers', 'search-pro.worker.js', 'llms.txt', 'llms-full.txt', 'ai']));
  expect(await readFile(dest + 'service-worker.js', 'utf8')).toBe(await readFile('docs/.vuepress/public/service-worker.js', 'utf8'));
  expect(await readFile(dest + '_headers', 'utf8')).toContain('Cache-Control: no-cache');
  const page = await readFile(dest + 'ai-retrieval.html', 'utf8');
  expect(page).not.toMatch(/data-offline-state|rel="manifest"|离线已就绪/);
  expect(page).toContain('download="tio-boot-ai-corpus.jsonl"');
});
