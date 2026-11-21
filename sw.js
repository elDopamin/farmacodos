// Service worker: guarda todo en el celular la primera vez y después funciona sin internet.
// Si cambiás algo de la app, subí el número de VERSION para que los celulares se actualicen.
const VERSION = 'farmacodos-v1';
const FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './fonts/archivo-latin-400-normal.woff2',
  './fonts/archivo-latin-500-normal.woff2',
  './fonts/archivo-latin-600-normal.woff2',
  './fonts/archivo-latin-700-normal.woff2',
  './fonts/archivo-latin-800-normal.woff2',
  './fonts/source-serif-4-latin-400-normal.woff2',
  './fonts/source-serif-4-latin-600-normal.woff2',
  './fonts/source-serif-4-latin-700-normal.woff2',
  './fonts/source-serif-4-latin-400-italic.woff2'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // links externos (e-lactancia) van directo a internet
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(e.request).catch(() =>
        e.request.mode === 'navigate' ? caches.match('./index.html') : Response.error()
      );
    })
  );
});
