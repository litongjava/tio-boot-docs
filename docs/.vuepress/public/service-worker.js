// Keep this URL available for browsers running the former offline worker,
// including registrations with a ?repair= query. Do not add a fetch handler.
self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    // Replace the old cache-first worker before clearing its resources.
    await self.clients.claim();
    const suffix = `-${self.registration.scope}`;
    const names = await caches.keys();
    await Promise.all(names
      .filter(name => name.startsWith('tio-boot-docs-') && name.endsWith(suffix))
      .map(name => caches.delete(name)));

    // Capture only our controlled windows, leaving other registrations alone.
    const windows = await self.clients.matchAll({ type: 'window' });
    await self.registration.unregister();
    // Leave cached pages and old runtime code behind while preserving each URL.
    await Promise.allSettled(windows.map(client => client.navigate(client.url)));
  })());
});
