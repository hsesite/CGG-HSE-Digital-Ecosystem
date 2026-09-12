/* ==========================================
   CGG HDOS Service Worker
   Build 1.0
   Offline Foundation
   ========================================== */

const CACHE_NAME = "cgg-hdos-v1";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./assets/Logo/logo-cgg.png"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

// Fetch
self.addEventListener("fetch", event => {

  if(event.request.method !== "GET") return;

  event.respondWith(

    caches.match(event.request).then(cache => {

      return cache || fetch(event.request).then(response => {

        const copy = response.clone();

        caches.open(CACHE_NAME).then(c => c.put(event.request, copy));

        return response;

      });

    })

  );

});
