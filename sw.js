const CACHE_NAME = 'ilart-offline-v1';

const ASSETS = [
  '/IlArtClock/',
  '/IlArtClock/index.html',
  '/IlArtClock/manifest.json',
  '/IlArtClock/icon-192.png',
  '/IlArtClock/icon-512.png'
];

// Установка — кэшируем всё нужное
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Активация — чистим старые кэши
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => k !== CACHE_NAME && caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// OFFLINE-FIRST стратегия
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      // Если есть в кэше — отдаём сразу
      if (cached) return cached;

      // Иначе пробуем сеть и кэшируем на будущее
      return fetch(event.request).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
