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

export async function generateLegacyRedirects({ configDir, outDir, sources, hostname }) {
  const raw = JSON.parse(await readFile(join(configDir, 'legacy-paths.json'), 'utf8'));
  const externalChapters = JSON.parse(await readFile(join(configDir, 'external-chapters.json'), 'utf8'));
  const pathOf = source => '/' + source.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '.html');
  const pages = new Map(sources.map(source => [source, pathOf(source)]));
  // Single pages moved to their own sites. Older aliases keep pointing at the old path, which then
  // redirects, so directory-wide wildcard rules stay intact.
  const externalPages = JSON.parse(await readFile(join(configDir, 'external-pages.json'), 'utf8'));
  for (const source of Object.keys(externalPages)) pages.set(source, pathOf(source));
  const occupied = new Set([...pages.values()].map(p => normalized(p).toLowerCase()));
  // Chapters moved to their own sites keep their old addresses through absolute redirects.
  const externalTarget = source => {
    const match = /^zh\/([^/]+)\/(.*)$/.exec(source);
    const base = match && externalChapters[match[1]];
    if (!base) return null;
    return `${base}/${encodeURI(match[2].replace(/readme\.md$/i, '').replace(/\.md$/, '.html'))}`;
  };
  const mapping = {};
  const entries = [];
  for (const [oldSource, listed] of Object.entries(raw)) {
    const external = externalTarget(listed);
    const newSource = external ? listed : listed.replace(/readme\.md$/i, 'index.md');
    mapping[oldSource] = newSource;
    const target = external || pages.get(newSource);
    if (!target) throw new Error('Missing redirect target: ' + newSource);
    const oldPath = '/' + oldSource.replace(/readme\.md$/i, 'index.html').replace(/\.md$/, '.html');
    // Canonical routes take precedence, including case-only aliases on Windows.
    if (occupied.has(oldPath.toLowerCase())) continue;
    entries.push([oldPath, target]);
    const targetUrl = new URL(target, hostname).href;
    const output = join(outDir, oldPath.slice(1));
    await mkdir(dirname(output), { recursive: true });
    const safeTarget = JSON.stringify(target).replaceAll('<', '\\u003c');
    await writeFile(output, `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="robots" content="noindex"><link rel="canonical" href="${escapeHtml(targetUrl)}"><meta http-equiv="refresh" content="0;url=${escapeHtml(target)}"><title>文档入口</title></head><body><a href="${escapeHtml(target)}">前往文档</a><script>location.replace(${safeTarget}+location.search+location.hash)</script></body></html>`);
  }
  for (const [source, target] of Object.entries(externalPages)) {
    const oldPath = pathOf(source);
    entries.push([oldPath, target]);
    const output = join(outDir, oldPath.slice(1));
    await mkdir(dirname(output), { recursive: true });
    const safeTarget = JSON.stringify(target).replaceAll('<', '\\u003c');
    await writeFile(output, `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="robots" content="noindex"><link rel="canonical" href="${escapeHtml(target)}"><meta http-equiv="refresh" content="0;url=${escapeHtml(target)}"><title>文档入口</title></head><body><a href="${escapeHtml(target)}">前往文档</a><script>location.replace(${safeTarget}+location.search+location.hash)</script></body></html>`);
  }
  const rules = buildRedirectRules(entries, occupied);
  await writeFile(join(outDir, '_redirects'), rules.join('\n') + '\n');
  await mkdir(join(outDir, 'ai'), { recursive: true });
  await writeFile(join(outDir, 'ai/redirects.json'), JSON.stringify(mapping, null, 2) + '\n');
}
