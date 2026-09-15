/* ==========================================
   CGG HDOS Service Worker
   Build 1.4 LTS
   Stable Cache + Auto Update
   ========================================== */

const CACHE_NAME = "cgg-hdos-v25-2";

const APP_SHELL = [
  "/CGG-HSE-Digital-Ecosystem/",
  "/CGG-HSE-Digital-Ecosystem/index.html",
  "/CGG-HSE-Digital-Ecosystem/manifest.json",
  "/CGG-HSE-Digital-Ecosystem/assets/Logo/logo-cgg.png"
];

/* ==========================================
   Install
   ========================================== */

self.addEventListener("install", event => {

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );

  self.skipWaiting();

});

/* ==========================================
   Activate
   ========================================== */

self.addEventListener("activate", event => {

  event.waitUntil((async()=>{

    const keys = await caches.keys();

    await Promise.all(
      keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
    );

    await self.clients.claim();

  })());

});

/* ==========================================
   Fetch Strategy
   Navigation : Network First
   Assets     : Cache First
   ========================================== */

self.addEventListener("fetch", event => {

  const req = event.request;

  if (req.method !== "GET") return;

  /* HTML */

  if (req.mode === "navigate") {

    event.respondWith((async()=>{

      try{

        const fresh = await fetch(req);

        const cache = await caches.open(CACHE_NAME);

        cache.put(req, fresh.clone());

        return fresh;

      }catch{

        return (
          await caches.match(req) ||
          await caches.match("/CGG-HSE-Digital-Ecosystem/index.html")
        );

      }

    })());

    return;

  }

  /* Static Assets */

  event.respondWith((async()=>{

    const cached = await caches.match(req);

    if(cached) return cached;

    try{

      const fresh = await fetch(req);

      const cache = await caches.open(CACHE_NAME);

      cache.put(req, fresh.clone());

      return fresh;

    }catch{

      return cached;

    }

  })());

});
