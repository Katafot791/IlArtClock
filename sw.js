const CACHE_NAME = 'ilart-clock-v3';

const urlsToCache = [
  '/IlArtClock/',
  '/IlArtClock/index.html',
  '/IlArtClock/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
