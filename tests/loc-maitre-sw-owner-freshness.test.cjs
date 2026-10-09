'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const source=fs.readFileSync(path.resolve(__dirname,'../LOC/MASTER-MAITRE-LOC/sw.js'),'utf8');
function harness({offline=false,cached=true}={}){
  const listeners={},calls=[],stored={status:200,ok:true,clone(){return this}};
  class SafeResponse{
    constructor(body,options={}){this.body=body;this.status=options.status||200;this.headers=options.headers||{}}
  }
  const caches={
    match:async request=>{calls.push('cache-match');return cached?{cached:true}:undefined},
    open:async name=>({put:async()=>{calls.push('cache-write:'+name)},addAll:async()=>{}}),
    keys:async()=>['digiy-master-loc-v1'],
    delete:async name=>{calls.push('purge:'+name);return true}
  };
  const self={
    location:{origin:'https://example.test'},
    addEventListener:(type,listener)=>{listeners[type]=listener},
    skipWaiting:async()=>{},
    clients:{claim:async()=>{}}
  };
  const fetch=async(request,options)=>{
    calls.push({type:'network',url:request.url,options:options||{}});
    if(offline)throw Error('synthetic offline');
    return stored;
  };
  vm.runInNewContext(source,{self,caches,fetch,URL,Response:SafeResponse},{timeout:1200});
  async function visit(url,{mode='navigate',destination='document',method='GET'}={}){
    let result=null;const pending=[];
    listeners.fetch({
      request:{url,method,mode,destination},
      respondWith:v=>{result=Promise.resolve(v)},
      waitUntil:v=>pending.push(Promise.resolve(v))
    });
    if(result)result=await result;
    await Promise.all(pending);
    return result;
  }
  return {visit,calls,listeners};
}
test('owner gestion.html loads from live network, never old cache',async()=>{
  const h=harness({cached:true});
  const r=await h.visit('https://example.test/LOC/MASTER-MAITRE-LOC/gestion.html');
  assert.equal(r.status,200);
  assert.equal(h.calls.some(x=>x==='cache-match'),false);
  assert.equal(h.calls.some(x=>typeof x==='string'&&x.startsWith('cache-write:')),false);
  assert.equal(h.calls[0].options.cache,'no-store');
});
test('owner /gestion/index.html is also network-only',async()=>{
  const h=harness();
  await h.visit('https://example.test/gestion/index.html');
  assert.equal(h.calls[0].options.cache,'no-store');
  assert.equal(h.calls.some(x=>x==='cache-match'),false);
});
test('offline owner cannot receive stale cached HTML',async()=>{
  const h=harness({offline:true,cached:true});
  const r=await h.visit('https://example.test/gestion.html');
  assert.equal(r.status,503);
  assert.equal(h.calls.some(x=>x==='cache-match'),false);
});
test('nonowner public document prefers current network HTML',async()=>{
  const h=harness();
  const r=await h.visit('https://example.test/index.html');
  assert.equal(r.status,200);
  assert.equal(h.calls[0].options.cache,'no-store');
  assert.equal(h.calls.some(x=>x==='cache-match'),false);
  assert.ok(h.calls.some(x=>typeof x==='string'&&x.startsWith('cache-write:')));
});
test('static media may use cache first',async()=>{
  const h=harness({cached:true});
  const r=await h.visit('https://example.test/icon-192.png',{mode:'same-origin',destination:'image'});
  assert.equal(r.cached,true);
  assert.deepEqual(h.calls,['cache-match']);
});
test('cross-origin Supabase calls never intercepted',async()=>{
  const h=harness();
  const res=await h.visit('https://database.example.org/rest/v1/rpc/booking',{mode:'cors',destination:''});
  assert.equal(res,null);
  assert.equal(h.calls.length,0);
});
test('updating service worker purges previous MAITRE caches on activation',async()=>{
  const h=harness();
  const pending=[];
  h.listeners.activate({waitUntil:x=>pending.push(Promise.resolve(x))});
  await Promise.all(pending);
  assert.ok(h.calls.includes('purge:digiy-master-loc-v1'));
});
test('network-only owner rule is pinned to secure version',()=>{
  assert.match(source,/const CACHE='digiy-master-loc-v30-network-first-20261009'/);
  assert.doesNotMatch(source,/caches.match\(request\).*fetch\(request\)/s);
});
