import { defineClientConfig, withBase } from 'vuepress/client';
import { onMounted } from 'vue';
import legacyPaths from './config/legacy-paths.json';

const pagePath = source => '/' + source.replace(/readme\.md$/i, '').replace(/\.md$/, '.html');
const redirects = new Map();
for (const [source, target] of Object.entries(legacyPaths)) {
  const from = pagePath(source), to = pagePath(target);
  if (from === to) continue;
  redirects.set(from, to);
  if (from.endsWith('/')) {
    redirects.set(from.slice(0, -1), to);
    redirects.set(from + 'index.html', to);
    redirects.set(from + 'readme.html', to);
  } else if (from.endsWith('.html')) {
    redirects.set(from.slice(0, -5), to);
  }
}

export default defineClientConfig({
  enhance({router}) {
    // Resolve stable and historical addresses during client-side navigation too.
    router.beforeEach(to => {
      let path;
      try { path = decodeURI(to.path); } catch { return; }
      const target = redirects.get(path);
      if (target && target !== path) return { path: target, query: to.query, hash: to.hash, replace: true };
    });
  },
  setup() {
    onMounted(async () => {
      if (__VUEPRESS_DEV__ || !window.isSecureContext || !('serviceWorker' in navigator)) return;
      // Update existing installations to the retirement worker. New visitors
      // never register a worker or download a site-wide cache.
      try {
        const scope = new URL(withBase('/'), location.origin).href;
        const script = new URL(withBase('/service-worker.js'), location.origin);
        const registration = await navigator.serviceWorker.getRegistration(scope);
        if (registration?.scope !== scope) return;
        const worker = registration.active || registration.waiting || registration.installing;
        if (!worker) return;
        const installed = new URL(worker.scriptURL);
        if (installed.origin === script.origin && installed.pathname === script.pathname) {
          await registration.update();
        }
      } catch (error) {
        console.warn('Unable to retire the previous documentation cache:', error);
      }
    });
  },
});
