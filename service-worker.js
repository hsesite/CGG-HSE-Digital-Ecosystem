/* ==========================================
   CGG HDOS Service Worker
   Master Blueprint v1.0
   Offline First Application Shell
   ========================================== */

"use strict";

const VERSION = "17.0";
const CACHE_NAME = `cgg-hdos-${VERSION}`;

const APP_ROOT = (() => {
  const path = self.location.pathname || "/service-worker.js";
  const marker = "/service-worker.js";
  const index = path.lastIndexOf(marker);

  if (index >= 0) {
    return path.slice(0, index).replace(/\/+$/, "") || "/";
  }

  return "/";
})();

const CORE_FILES = [
  `${APP_ROOT}/`,
  `${APP_ROOT}/index.html`,
  `${APP_ROOT}/manifest.json`,
  `${APP_ROOT}/assets/Logo/logo-cgg.png`
];

function applicationUrl(path) {
  return new URL(path, self.location.origin).toString();
}

async function getOfflinePage() {
  const candidates = [
    `${APP_ROOT}/index.html`,
    `${APP_ROOT}/`,
    "/index.html",
    "/"
  ];

  for (const candidate of candidates) {
    const cached = await caches.match(applicationUrl(candidate));

    if (cached) {
      return cached;
    }
  }

  return new Response(
    "<h1>CGG HDOS Offline</h1><p>Application shell belum tersedia di cache.</p>",
    {
      status: 503,
      headers: {
        "Content-Type": "text/html; charset=utf-8"
      }
    }
  );
}

async function cacheCoreFiles() {
  const cache = await caches.open(CACHE_NAME);

  for (const file of CORE_FILES) {
    try {
      await cache.add(applicationUrl(file));
    } catch (error) {
      console.warn("HDOS cache gagal:", file, error);
    }
  }
}

self.addEventListener("install", event => {
  event.waitUntil(
    cacheCoreFiles().then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();

      await Promise.all(
        cacheNames
          .filter(name => name.startsWith("cgg-hdos-"))
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );

      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  /*
   * Navigation:
   * Online memakai halaman terbaru.
   * Offline memakai application shell dari cache.
   */
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);

          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, response.clone());
          }

          return response;
        } catch {
          return getOfflinePage();
        }
      })()
    );

    return;
  }

  /*
   * Static assets:
   * Cache first agar CSS dan JavaScript tetap tersedia offline.
   * Jika belum ada di cache, ambil dari network lalu simpan.
   */
  event.respondWith(
    (async () => {
      const cached = await caches.match(request);

      if (cached) {
        return cached;
      }

      try {
        const response = await fetch(request);

        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
        }

        return response;
      } catch {
        return new Response("", {
          status: 503,
          statusText: "Asset tidak tersedia offline."
        });
      }
    })()
  );
});
