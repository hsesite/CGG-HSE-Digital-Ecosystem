/* ==========================================
   CGG HDOS Service Worker
   Build 16.2
   Clean Cache Foundation
   ========================================== */

const VERSION = "16.3";
const CACHE_NAME = `cgg-hdos-${VERSION}`;

// Classic service workers tidak mendukung import.meta. Scope dihitung dari
// URL service worker agar tetap benar di root maupun GitHub Pages subpath.
const APP_ROOT = (() => {
  const path = self.location.pathname || "/service-worker.js";
  const marker = "/service-worker.js";
  const index = path.lastIndexOf(marker);
  return index >= 0
    ? path.slice(0, index).replace(/\/+$/, "") || "/"
    : "/";
})();

const CORE = [
  `${APP_ROOT}/`,
  `${APP_ROOT}/index.html`,
  `${APP_ROOT}/manifest.json`,
  `${APP_ROOT}/assets/Logo/logo-cgg.png`
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE))
      .catch(error => console.warn("HDOS cache install:", error))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil((async() => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  if(event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if(url.origin !== self.location.origin) return;

  if(event.request.mode === "navigate"){
    event.respondWith((async() => {
      try {
        return await fetch(event.request, {cache:"no-store"});
      } catch {
        return await caches.match(`${APP_ROOT}/index.html`)
          || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async() => {
    const cached = await caches.match(event.request);
    if(cached) return cached;

    try {
      return await fetch(event.request);
    } catch {
      return Response.error();
    }
  })());
});
