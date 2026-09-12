/* ==========================================
   CGG HDOS Service Worker
   Build 1.3
   Minimal Offline Foundation
   ========================================== */

const CACHE = "cgg-hdos-core-v1";

const FILES = [
  "/CGG-HSE-Digital-Ecosystem/",
  "/CGG-HSE-Digital-Ecosystem/index.html",
  "/CGG-HSE-Digital-Ecosystem/manifest.json",
  "/CGG-HSE-Digital-Ecosystem/assets/Logo/logo-cgg.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {

  if (event.request.mode === "navigate") {

    event.respondWith(

      fetch(event.request).catch(() =>
        caches.match("/CGG-HSE-Digital-Ecosystem/index.html")
      )

    );

    return;
  }

  event.respondWith(
    caches.match(event.request).then(r => r || fetch(event.request))
  );

});
