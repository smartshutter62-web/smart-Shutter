// Smart Shutter mobile repair. Only this app's cache is managed.
const V = 'shutter-pwa-v7-sale-import-20261123';
const FILES = ['./', './index.html', './manifest.webmanifest', './html2canvas.min.js',
  './icon-192.png', './icon-512.png', './icon-maskable-512.png', './mobile.js', './mobile.css'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(V).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('shutter-pwa-') && key !== V).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(new URL('./', self.location).pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(V);
    // Online-first document loads allow deployed repairs to reach existing users.
    if (event.request.mode === 'navigate') {
      try {
        const response = await fetch(event.request);
        if (response.ok) { await cache.put('./index.html', response.clone()); return response; }
        return await cache.match('./index.html') || response;
      } catch (_) { return await cache.match('./index.html') || Response.error(); }
    }
    const hit = await cache.match(event.request, {ignoreSearch: true});
    if (hit) return hit;
    return fetch(event.request);
  })());
});
