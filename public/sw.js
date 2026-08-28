// Replaced during every production build with the content-derived release id.
const VERSION = 'name-tap-shell-__BUILD_VERSION__';
const CORE = ['/', '/demo/', '/privacy/', '/terms/', '/404.html', '/offline.html', '/manifest.webmanifest', '/icon.svg', '/icon-192.png', '/icon-512.png', '/icon-maskable-512.png', '/apple-touch-icon.png', '/assets/name-tap-hero-720.webp', '/assets/name-tap-hero-1200.webp', '/assets/name-tap-social.webp'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    const response = await fetch('/');
    const html = await response.clone().text();
    const builtAssets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((match) => match[1]);
    await cache.put('/', response);
    await cache.addAll([...new Set([...CORE.slice(1), ...builtAssets])]);
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((name) => name.startsWith('name-tap-') && name !== VERSION).map((name) => caches.delete(name)));
    await self.clients.claim();
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach((client) => client.postMessage({ type: 'SW_UPDATED', version: VERSION }));
  })());
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        const cache = await caches.open(VERSION);
        await cache.put(request, response.clone());
        return response;
      } catch {
        const cache = await caches.open(VERSION);
        const known = new Set(['/', '/demo', '/demo/', '/privacy', '/privacy/', '/terms', '/terms/']);
        if (!known.has(url.pathname)) return (await cache.match('/404.html')) ?? (await cache.match('/offline.html'));
        const fallback = url.pathname.startsWith('/demo') ? '/demo/' : url.pathname === '/' ? '/' : `${url.pathname.replace(/\/$/, '')}/`;
        return (await cache.match(request)) ?? (await cache.match(fallback)) ?? (await cache.match('/offline.html'));
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(VERSION);
        await cache.put(request, response.clone());
      }
      return response;
    } catch {
      return new Response('', { status: 503, statusText: 'Offline' });
    }
  })());
});
