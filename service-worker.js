/* ==========================================
   CGG HDOS Service Worker
   Build 16.2
   Clean Cache Foundation
   ========================================== */

const VERSION="16.2";
const CACHE_NAME=`cgg-hdos-${VERSION}`;

const APP_ROOT="/CGG-HSE-Digital-Ecosystem";

const CORE=[
 `${APP_ROOT}/`,
 `${APP_ROOT}/index.html`,
 `${APP_ROOT}/manifest.json`,
 `${APP_ROOT}/assets/Logo/logo-cgg.png`
];

self.addEventListener("install",event=>{

 event.waitUntil(
  caches.open(CACHE_NAME).then(c=>c.addAll(CORE))
 );

 self.skipWaiting();

});

self.addEventListener("activate",event=>{

 event.waitUntil((async()=>{

  const keys=await caches.keys();

  await Promise.all(
   keys
    .filter(k=>k!==CACHE_NAME)
    .map(k=>caches.delete(k))
  );

  await self.clients.claim();

 })());

});

self.addEventListener("fetch",event=>{

 if(event.request.method!=="GET") return;

 const url=new URL(event.request.url);

 if(url.origin!==location.origin) return;

 if(event.request.mode==="navigate"){

  event.respondWith((async()=>{

   try{

    return await fetch(event.request);

   }catch{

    return await caches.match(`${APP_ROOT}/index.html`);

   }

  })());

  return;

 }

 event.respondWith((async()=>{

  const cache=await caches.match(event.request);

  if(cache) return cache;

  return fetch(event.request);

 })());

});
