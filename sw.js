// 1. Définissez la nouvelle version du cache
const CACHE_NAME = 'klon-edgev3'; // <-- À incrémenter à chaque mise à jour (v2, v3, etc.)

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', (e) => {
  // Force le Service Worker en attente à devenir le Service Worker actif immédiatement
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 2. Supprime automatiquement l'ancien cache ('klon-edge=-v1', etc.) dès que la v2 s'active
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // Prend immédiatement le contrôle des pages ouvertes
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
