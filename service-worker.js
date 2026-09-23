/* ==========================================
   CGG HDOS Service Worker
   Build 16.2
   Clean Cache Foundation
   ========================================== */

const VERSION = "16.2";
const CACHE_NAME = `cgg-hdos-${VERSION}`;

const APP_ROOT = (() => {
  const scriptUrl = new URL(import.meta.url || self.location.href);
  const path = scriptUrl.pathname || self.location.pathname;
  const serviceWorkerPath = "/service-worker.js";
  const index = path.lastIndexOf(serviceWorkerPath);

  if(index > -1){
    return path.slice(0, index).replace(/\/+$/, "") || "/";
  }

  return self.registration?.scope
    ? new URL(self.registration.scope).pathname.replace(/\/+$/, "") || "/"
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
      .catch(() => undefined)
  );

  self.skipWaiting();

});

self.addEventListener("activate", event => {

  event.waitUntil((async() => {

    const keys = await caches.keys();

    await Promise.all(
      keys
        .filter(k => k !== CACHE_NAME)
        .map(k => caches.delete(k))
    );

    await self.clients.claim();

  })());

});

self.addEventListener("fetch", event => {

  if(event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if(url.origin !== self.location.origin) return;

  if(event.request.mode === "navigate"){

    event.respondWith((async() => {
      try{
        return await fetch(event.request, { cache: "no-store" });
      }catch{
        const fallback = new URL("./index.html", self.registration.scope).toString();
        return await caches.match(fallback) || caches.match("./index.html") || Response.redirect("/");
      }
    })());

    return;
  }

  event.respondWith((async() => {
    const cached = await caches.match(event.request);
    if(cached) return cached;
    return fetch(event.request);
  })());

});
