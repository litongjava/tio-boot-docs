import { pwaPlugin } from '@vuepress/plugin-pwa';
import { writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

// Keep this plugin last: search-pro, llms and redirects must finish before scanning.
export const offlinePwaPlugin = options => app => {
  const plugin = pwaPlugin({
  ...options,
  maxSize: 64 * 1024,
  generateSWConfig: {
    cacheId: 'tio-boot-docs',
    globPatterns: [
      '**/*.{js,css,svg,woff,woff2,eot,ttf,otf}',
      'index.html', '404.html', 'ai-retrieval.html', 'offline-shell.html',
      'llms*.txt', 'ai/**/*.{json,jsonl,md,txt}',
      'logo*.png', 'manifest.webmanifest',
    ],
    globIgnores: ['**/service-worker.js', '**/workbox-*.js'],
    // VuePress page modules are precached; the router renders deep links offline.
    navigateFallback: `${app.siteData.base}offline-shell.html`,
    navigateFallbackAllowlist: [new RegExp(`^${app.siteData.base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:zh/|en/|about(?:\\.html)?$|ai-retrieval(?:\\.html)?$)`) ],
    manifestTransforms: [async entries => {
      const urls = new Set(entries.map(entry => entry.url));
      const ai = JSON.parse(await readFile(app.dir.dest('ai/index.json'), 'utf8'));
      const required = ['search-pro.worker.js', 'llms.txt', 'llms-full.txt', 'offline-shell.html',
        'ai/index.json', 'ai/chunks.jsonl', 'ai/redirects.json', 'ai-retrieval.html',
        ...ai.pages.map(page => `ai/pages/${page.source}`),
        ...new Set(ai.pages.map(page => `ai/chapters/${page.chapter}.txt`))];
      for (const url of required) {
        if (!urls.has(url)) throw new Error(`Required offline resource missing: ${url}`);
      }
      const resources = [...entries].sort((a,b) => a.url.localeCompare(b.url, 'en'));
      const data = JSON.stringify({
        schemaVersion: 1,
        version: createHash('sha256').update(JSON.stringify(resources)).digest('hex').slice(0,16),
        totalBytes: resources.reduce((sum, entry) => sum + entry.size, 0),
        resources,
      }, null, 2) + '\n';
      await writeFile(app.dir.dest('offline-manifest.json'), data);
      return {warnings: [], manifest: [...entries, {
        url: 'offline-manifest.json',
        revision: createHash('md5').update(data).digest('hex'),
        size: Buffer.byteLength(data),
      }]};
    }],
  },
  })(app);
  return {
    ...plugin,
    async onGenerated(...args) {
      // Home-page SSR markup cannot hydrate a different route. An empty mount
      // point lets Vue render the requested page from its cached route module.
      const home = await readFile(app.dir.dest('index.html'), 'utf8');
      const head = home.match(/<head>([\s\S]*?)<\/head>/i)?.[1];
      const body = home.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1];
      const scripts = body?.match(/<script\b[^>]*>[\s\S]*?<\/script>/gi)?.join('\n');
      if (!head || !scripts) throw new Error('Unable to create the offline VuePress shell');
      const offlineHead = head.replace(/<meta\b[^>]*name=["']robots["'][^>]*>/gi, '');
      await writeFile(app.dir.dest('offline-shell.html'),
        `<!doctype html><html lang="zh-CN"><head>${offlineHead}<meta name="robots" content="noindex"></head><body><div id="app"></div>${scripts}</body></html>\n`);
      return plugin.onGenerated(...args);
    },
  };
};
