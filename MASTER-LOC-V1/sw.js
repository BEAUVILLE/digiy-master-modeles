/* Strictly scoped shell cache; never cache booking, availability, or Supabase data. */
const CACHE="digiy-loc-master-shell-v1";
self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(["./index.html","./manifest.webmanifest"])));self.skipWaiting()});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("digiy-loc-master-shell-")&&k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener("fetch",event=>{const url=new URL(event.request.url);if(event.request.method!=="GET"||url.origin!==self.location.origin||!url.pathname.includes("/MASTER-LOC-V1/"))return;if(event.request.mode==="navigate"){event.respondWith(fetch(event.request).catch(()=>caches.match("./index.html")));return}if(url.pathname.endsWith("/manifest.webmanifest"))event.respondWith(caches.match(event.request).then(r=>r||fetch(event.request)))});
