import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname, posix } from 'node:path';

const escapeHtml = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const normalized = value => decodeURI(value).replace(/\/$/, '/index.html');

// Compact uniform chapter moves to stay within Pages' redirect rule limits.
export function buildRedirectRules(entries, occupied) {
  const exact = new Map();
  const groups = new Map();
  for (const [source, target] of entries) {
    exact.set(source, target);
    const parent = posix.dirname(source);
    const rows = groups.get(parent) || [];
    rows.push([source, target]); groups.set(parent, rows);
  }
  const candidates = [];
  for (const [source, rows] of groups) {
    if (rows.length < 2 || rows.some(([from]) => !from.endsWith('.html'))) continue;
    if ([...occupied].some(p => p.startsWith(source.toLowerCase() + '/'))) continue;
    const target = posix.dirname(normalized(rows[0][1]));
    if (rows.every(([from, to]) => normalized(to) === target + '/' + posix.basename(from))) {
      candidates.push({ source, target, rows });
    }
  }
  candidates.sort((a, b) => b.rows.length - a.rows.length || a.source.localeCompare(b.source));
  const dynamic = [];
  for (const candidate of candidates.slice(0, 100)) {
    dynamic.push(`${encodeURI(candidate.source)}/* ${encodeURI(candidate.target)}/:splat 301`);
    for (const [source] of candidate.rows) exact.delete(source);
  }
  const roots = new Map();
  for (const [source, target] of entries) {
    if (!source.endsWith('/index.html')) continue;
    const base = source.slice(0, -11);
    roots.set(base, target);
    // Chapter wildcards also match the trailing-slash entry point.
    if (!dynamic.some(rule => rule.startsWith(encodeURI(base) + '/* '))) roots.set(base + '/', target);
  }
  for (const [source, target] of roots) exact.set(source, target);
  if (exact.size > 2000) throw new Error(`Too many static redirect rules: ${exact.size}`);
  return [...exact].map(([from, to]) => `${encodeURI(from)} ${encodeURI(to)} 301`).concat(dynamic);
}

export const legacyRedirectsPlugin = ({ hostname }) => ({
  name: 'tio-boot-legacy-redirects',
  async onGenerated(app) {
    const mapping = JSON.parse(await readFile(app.dir.source('.vuepress/config/legacy-paths.json'), 'utf8'));
    const pages = new Map(app.pages.filter(p => p.filePathRelative).map(p => [p.filePathRelative, p.path]));
    const occupied = new Set(app.pages.map(p => normalized(p.path).toLowerCase()));
    const entries = [];
    for (const [oldSource, newSource] of Object.entries(mapping)) {
      const target = pages.get(newSource);
      if (!target) throw new Error('Missing redirect target: ' + newSource);
      const oldPath = '/' + oldSource.replace(/readme\.md$/i, 'index.html').replace(/\.md$/, '.html');
      // Canonical routes take precedence, including case-only aliases on Windows.
      if (occupied.has(oldPath.toLowerCase())) continue;
      entries.push([oldPath, target]);
      const targetUrl = new URL(target, hostname).href;
      const output = join(app.dir.dest(), oldPath.slice(1));
      await mkdir(dirname(output), { recursive: true });
      const safeTarget = JSON.stringify(target).replaceAll('<', '\\u003c');
      await writeFile(output, `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="robots" content="noindex"><link rel="canonical" href="${escapeHtml(targetUrl)}"><meta http-equiv="refresh" content="0;url=${escapeHtml(target)}"><title>文档入口</title></head><body><a href="${escapeHtml(target)}">前往文档</a><script>location.replace(${safeTarget}+location.search+location.hash)</script></body></html>`);
    }
    const rules = buildRedirectRules(entries, occupied);
    await writeFile(join(app.dir.dest(), '_redirects'), rules.join('\n') + '\n');
    await mkdir(join(app.dir.dest(), 'ai'), { recursive: true });
    await writeFile(join(app.dir.dest(), 'ai/redirects.json'), JSON.stringify(mapping, null, 2) + '\n');
  }
});
