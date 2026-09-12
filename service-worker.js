/* ==========================================
   CGG HDOS Service Worker
   Build 1.2
   Offline Navigation Fix
   ========================================== */

const CACHE_NAME = "cgg-hdos-v1.2";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./assets/Logo/logo-cgg.png"
];

/* INSTALL */

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {

      for (const file of APP_SHELL) {
        try {
          await cache.add(file);
        } catch (e) {
          console.warn("Cache gagal:", file);
        }
      }

    })
  );

  self.skipWaiting();
});

/* ACTIVATE */

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

/* FETCH */

self.addEventListener("fetch", event => {

  if (event.request.method !== "GET") return;

  /* Navigasi halaman */
  if (event.request.mode === "navigate") {

    event.respondWith(

      fetch(event.request)
        .then(response => {

          const copy = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put("./index.html", copy);
          });

          return response;

        })
        .catch(async () => {

          return await caches.match("./index.html");

        })

    );

    return;
  }

  /* Asset biasa */

  event.respondWith(

    caches.match(event.request).then(cached => {

      if (cached) return cached;

      return fetch(event.request)
        .then(response => {

          if (!response || response.status !== 200) return response;

          const copy = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, copy);
          });

          return response;

        });

    })

  );

});
