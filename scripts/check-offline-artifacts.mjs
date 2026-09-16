import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const dest = path.resolve('docs/.vuepress/dist');
const manifest = JSON.parse(fs.readFileSync(path.join(dest, 'offline-manifest.json'), 'utf8'));
const ai = JSON.parse(fs.readFileSync(path.join(dest, 'ai/index.json'), 'utf8'));
const resources = new Map(manifest.resources.map(resource => [resource.url, resource]));
const required = ['search-pro.worker.js', 'index.html', 'ai-retrieval.html', 'offline-shell.html', 'llms.txt', 'llms-full.txt',
  'ai/index.json', 'ai/chunks.jsonl', 'ai/redirects.json',
  ...ai.pages.map(page => `ai/pages/${page.source}`),
  ...new Set(ai.pages.map(page => `ai/chapters/${page.chapter}.txt`))];
for (const url of required) assert(resources.has(url), `Missing offline resource: ${url}`);
for (const resource of manifest.resources) {
  const data = fs.readFileSync(path.join(dest, resource.url));
  assert.equal(data.length, resource.size, resource.url);
  if (resource.revision) assert.equal(createHash('md5').update(data).digest('hex'), resource.revision, resource.url);
}
const worker = fs.readFileSync(path.join(dest, 'service-worker.js'), 'utf8');
for (const url of required) assert(worker.includes(JSON.stringify(url)), `Missing SW entry: ${url}`);
assert(worker.includes('offline-manifest.json'));
assert(worker.includes('NavigationRoute'));
const shell = fs.readFileSync(path.join(dest, 'offline-shell.html'), 'utf8');
assert(shell.includes('<div id="app"></div>'));
assert(!shell.includes('class="vp-home"'));
assert(shell.includes('type="module"'));
console.log(JSON.stringify({version: manifest.version, resources: resources.size,
  megabytes: +(manifest.totalBytes / 1024 / 1024).toFixed(1), checks: 'passed'}, null, 2));
