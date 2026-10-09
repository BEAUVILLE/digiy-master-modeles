'use strict';
// MAÎTRE LOC V30 — do not serve stale owner-management HTML from a PWA cache.
// This worker only affects installations that actually register this script;
// publishing the template does not automatically upgrade distributed copies.
const CACHE='digiy-master-loc-v30-network-first-20261009';
const PREFIX='digiy-master-loc-';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys()
    .then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE)
      .map(key=>caches.delete(key))))
    .then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;

  // Owner screens MUST be obtained fresh on each visit: a cached v1 script
  // could still send direct calendar mutations removed by the V30 release.
  const ownerHtml=/(?:^|\/)gestion(?:\.html|\/|\/index\.html)$/.test(url.pathname);
  if(ownerHtml){
    event.respondWith(
      fetch(request,{cache:'no-store'}).catch(()=>
        new Response('Gestion propriétaire indisponible hors ligne. Reconnectez-vous.',{
          status:503,headers:{'Content-Type':'text/plain; charset=utf-8',
                              'Cache-Control':'no-store'}
        })
      )
    );
    return;
  }

  // Prefer current public HTML; offline fallback only for non-owner pages.
  if(request.mode==='navigate'||request.destination==='document'){
    event.respondWith(fetch(request,{cache:'no-store'})
      .then(response=>{
        if(response.ok){
          const copy=response.clone();
          event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy)));
        }
        return response;
      })
      .catch(async()=>await caches.match(request)||await caches.match('./index.html')||
        new Response('Hors ligne', {status:503})));
    return;
  }

  // Immutable-ish static media may be cached, but never owner HTML.
  event.respondWith(caches.match(request).then(hit=>hit||fetch(request).then(response=>{
    if(response.ok){
      const copy=response.clone();
      event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy)));
    }
    return response;
  })));
});
