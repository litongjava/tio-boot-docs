import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { splitSections } from '../docs/.vuepress/config/llms.js';

const dest=path.resolve('docs/.vuepress/dist');
const read=p=>fs.readFileSync(path.join(dest,p),'utf8');
const local=url=>path.join(dest,decodeURIComponent(new URL(url).pathname).replace(/^\//,''));
const hash=text=>createHash('sha256').update(text).digest('hex');
const index=JSON.parse(read('ai/index.json'));
assert.equal(index.schemaVersion,1);
assert(index.pages.length>700);
assert(!index.pages.some(p=>/^zh\/(?:69|77)_manim\//.test(p.source)));
assert(!fs.existsSync(path.join(dest,'zh/69_manim')));
assert(!fs.existsSync(path.join(dest,'zh/77_manim')));
const ids=new Set();
for(const page of index.pages) {
  assert(!ids.has(page.id),'Duplicate page '+page.id);ids.add(page.id);
  const pageFile=local(page.url);
  assert(fs.existsSync(pageFile.endsWith(path.sep)?path.join(pageFile,'index.html'):pageFile),page.url);
  const markdown=fs.readFileSync(local(page.markdownUrl),'utf8').replace(/^<!-- Source: .* -->\n\n/,'').trim();
  assert.equal(hash(markdown),page.sha256,page.id);
  assert(fs.existsSync(path.join('docs',page.source)),page.source);
}
const chunks=read('ai/chunks.jsonl').trim().split('\n').map(s=>JSON.parse(s));
const chunkIds=new Set();
for(const chunk of chunks) {
  assert(ids.has(chunk.pageId),chunk.pageId);
  assert(!chunkIds.has(chunk.id),chunk.id);chunkIds.add(chunk.id);
  assert.equal(hash(chunk.content),chunk.sha256,chunk.id);
}
const example='# Page\n\n## Setup\n\n```sh\n# shell comment\n## still code\n```\n\n## Next\ntext';
const sections=splitSections(example);
assert.equal(sections.length,3);
assert.equal(splitSections(example.replaceAll('\n','\r\n')).length,3);
assert(sections[1].content.includes('## still code\n```'));
const llms=read('llms.txt');
assert(llms.includes('## zh/19_redis'));
assert(llms.includes('## zh/23_kafka'));
assert(!llms.includes('## zh\n'));
for(const m of llms.matchAll(/\]\((https?:\/\/[^)]+)\)/g))assert(fs.existsSync(local(m[1])),m[1]);
const redirects=JSON.parse(read('ai/redirects.json'));
const pages=new Map(index.pages.map(p=>[p.source,p]));
let redirectCount=0;
for(const [from,to] of Object.entries(redirects)) {
  assert(pages.has(to),to);
  const oldHtml=from.replace(/readme\.md$/i,'index.html').replace(/\.md$/,'.html');
  const newUrl=pages.get(to).url;
  if(('/'+oldHtml).toLowerCase()===decodeURIComponent(new URL(newUrl).pathname).replace(/\/$/,'/index.html').toLowerCase())continue;
  const html=read(oldHtml);
  assert(html.includes('name="robots" content="noindex"'),oldHtml);
  assert(html.includes(newUrl.replaceAll('&','&amp;')),oldHtml);
  redirectCount++;
}
assert(read('_redirects').includes('/zh/22_MQ/01.html /zh/22_mq/01.html 301'));
assert(read('robots.txt').includes('Sitemap: https://tio-boot.com/sitemap.xml'));
console.log(JSON.stringify({pages:index.pages.length,chunks:chunks.length,redirectPages:redirectCount,checks:'passed'},null,2));
