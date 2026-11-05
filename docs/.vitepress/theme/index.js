import { h } from 'vue';
import DefaultTheme from 'vitepress/theme';
import { inBrowser, withBase } from 'vitepress';
import CopyMarkdown from './CopyMarkdown.vue';

// Update existing installations to the retirement worker. New visitors never
// register a worker or download a site-wide cache.
async function retireServiceWorker() {
  if (import.meta.env.DEV || !window.isSecureContext || !('serviceWorker' in navigator)) return;
  try {
    const scope = new URL(withBase('/'), location.origin).href;
    const script = new URL(withBase('/service-worker.js'), location.origin);
    const registration = await navigator.serviceWorker.getRegistration(scope);
    if (registration?.scope !== scope) return;
    const worker = registration.active || registration.waiting || registration.installing;
    if (!worker) return;
    const installed = new URL(worker.scriptURL);
    if (installed.origin === script.origin && installed.pathname === script.pathname) await registration.update();
  } catch (error) {
    console.warn('Unable to retire the previous documentation cache:', error);
  }
}

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, { 'doc-before': () => h(CopyMarkdown) }),
  enhanceApp() {
    if (inBrowser) retireServiceWorker();
  },
};
