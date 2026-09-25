/* Pétillante — service worker : l'app marche hors ligne.
   Portée limitée à /petillante/ : n'intercepte rien d'autre sur le domaine. */
const CACHE = "petillante-v1";
const SHELL = [
  "./", "./index.html", "./app.css", "./app.js", "./content.js", "./manifest.webmanifest",
  "./fonts/fraunces.woff2", "./fonts/fraunces-italic.woff2", "./fonts/outfit.woff2",
  "./icons/icon.svg", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("petillante-") && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Réseau d'abord pour les pages (mises à jour rapides), cache d'abord pour le reste.
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put("./index.html", copy)); return res; })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});
