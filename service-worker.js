/* ==========================================
   CGG HDOS Service Worker
   Build 1.1
   Offline Cache Engine
   ========================================== */

const CACHE_NAME = "cgg-hdos-v1.1";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",

  "./assets/Logo/logo-cgg.png",

  "./css/desktop.css",
  "./css/mobile.css",
  "./css/mobile-sidebar.css",
  "./css/mobile-performance.css",

  "./js/app.js",
  "./js/router.js",
  "./js/sidebar.js",
  "./js/mobile-engine.js"
];

/* Install */

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))

  );

  self.skipWaiting();

});

/* Activate */

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

/* Fetch */

self.addEventListener("fetch", event => {

  if(event.request.method !== "GET") return;

  event.respondWith(

    caches.match(event.request).then(cached => {

      if(cached) return cached;

      return fetch(event.request).then(response => {

        const copy = response.clone();

        caches.open(CACHE_NAME).then(cache => {

          cache.put(event.request, copy);

        });

        return response;

      }).catch(() => {

        return caches.match("./index.html");

      });

    })

  );

});
