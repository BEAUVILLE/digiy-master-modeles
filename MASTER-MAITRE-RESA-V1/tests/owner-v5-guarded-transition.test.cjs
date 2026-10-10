'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');

const page=fs.readFileSync(path.resolve(__dirname,'../gestion.html'),'utf8');
const uuid='ca000000-0000-4000-8000-000000000092';
const requestId='ca000000-0000-4000-8000-000000000091';
const from='function usesOwnerV5(row){';
const to='function statusLabel(s){';
const updateFrom='async function updateBooking(r,status,note,button){';
const updateTo="$('send').onclick=";
const helpers=page.slice(page.indexOf(from),page.indexOf(to));
const update=page.slice(page.indexOf(updateFrom),page.indexOf(updateTo));
assert.ok(helpers.includes('executeOwnerV5')&&update.includes('updateBooking'));

function setup({v5=true,rpc,legacyUpdate}={}){
 const log=[];
 const db={
  rpc:async(name,params)=>{
   log.push({kind:'rpc',name,params});
   return rpc?rpc(name,params):{data:{ok:true,booking_id:params.p_booking_id,
    status:params.p_action==='note'?'pending':params.p_action,action:params.p_action},error:null};
  },
  from:name=>{
   log.push({kind:'from',table:name});
   return {update:payload=>{
    log.push({kind:'update',payload});
    const chain={eq:(name,value)=>{log.push({kind:'eq',name,value});return chain},then:(resolve,reject)=>Promise.resolve(legacyUpdate?legacyUpdate(payload):{error:null}).then(resolve,reject)};
    return chain;
   }};
  }
 };
 let render=0;
 const notices=[];
 const element={classList:{toggle(){}}};
 const ctx={
  RESA_V5_STAGING_ENABLED:v5,
  db,RESA_SLUG:'saly-pro-a',
  '$':()=>element,
  msg:(el,message,bad=false)=>{notices.push({message,bad})},
  renderBookings:()=>{render++},
  Date,Error,String
 };
 vm.runInNewContext(helpers+'\n'+update,ctx);
 return {...ctx,log,notices,get rendered(){return render;}};
}
function row(id=requestId){return {id:uuid,client_request_id:id,status:'pending',note_text:'Note conservée',slug:'saly-pro-a'};}
test('MASTER default is OFF: legacy query avoids absent client_request_id column',()=>{
 assert.match(page,/const RESA_V5_STAGING_ENABLED=false;/);
 assert.match(page,/RESA_V5_STAGING_ENABLED\?',client_request_id':'/);
 assert.match(page,/signInWithOtp/);
 assert.match(page,/shouldCreateUser:false/);
 assert.match(page,/\[SUPABASE_URL\]/);
 assert.doesNotMatch(page,/const RESA_V5_STAGING_ENABLED\s*=\s*(?:location|localStorage|true)/);
});
test('new V0 status uses only guarded RPC; no direct update, no note overwritten',async()=>{
 const c=setup();
 const r=row(),button={disabled:false};
 await c.updateBooking(r,'confirmed','Note conservée',button);
 assert.equal(button.disabled,false);
 assert.equal(r.status,'confirmed');
 assert.equal(r.note_text,'Note conservée');
 assert.equal(c.rendered,1);
 assert.equal(c.log.length,1);
 assert.equal(c.log[0].name,'digiy_resa_universal_owner_manage_v2');
 assert.deepEqual(JSON.parse(JSON.stringify(c.log[0].params)),{
  p_booking_id:uuid,p_action:'confirmed',p_note_text:null
 });
 assert.match(c.notices.at(-1).message,/aucun paiement supposé/);
});
test('private note is a distinct operation and never changes status',async()=>{
 const c=setup(),r=row(),button={disabled:false};
 await c.updateBooking(r,'pending','  Nouvelle note  ',button);
 assert.equal(r.status,'pending');
 assert.equal(r.note_text,'Nouvelle note');
 assert.equal(c.log.length,1);
 assert.equal(c.log[0].params.p_action,'note');
 assert.equal(c.log[0].params.p_note_text,'Nouvelle note');
 assert.equal(button.disabled,false);
});
test('stale dirty note blocks status change instead of losing it',async()=>{
 const c=setup(),r=row(),button={disabled:false};
 await c.updateBooking(r,'confirmed','Note non enregistrée',button);
 assert.equal(c.log.length,0);
 assert.equal(r.status,'pending');
 assert.equal(c.rendered,0);
 assert.equal(button.disabled,false);
 assert.equal(c.notices.at(-1).bad,true);
 assert.match(c.notices.at(-1).message,/note privée/);
});
test('missing owner RPC never falls back to direct table UPDATE',async()=>{
 const c=setup({rpc:async()=>({error:{message:'function unavailable'},data:null})});
 const r=row(),button={disabled:false};
 await c.updateBooking(r,'confirmed','Note conservée',button);
 assert.equal(c.log.filter(e=>e.kind==='rpc').length,1);
 assert.equal(c.log.filter(e=>e.kind==='from').length,0);
 assert.equal(r.status,'pending');
 assert.equal(button.disabled,false);
 assert.equal(c.notices.at(-1).bad,true);
 assert.match(c.notices.at(-1).message,/indisponible/);
});
test('cross-owner refusal, not_found, malformed replies do not mutate UI',async()=>{
 for(const rpc of [
  async()=>({data:{ok:false,error:'not_found_or_forbidden'}}),
  async()=>({data:{ok:true,booking_id:uuid,action:'note',status:'pending'}}),
  async()=>({data:{ok:true,booking_id:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',action:'confirmed',status:'confirmed'}})
 ]){
  const c=setup({rpc}),r=row(),button={disabled:false};
  await c.updateBooking(r,'confirmed','Note conservée',button);
  assert.equal(r.status,'pending');
  assert.equal(r.note_text,'Note conservée');
  assert.equal(c.rendered,0);
  assert.equal(c.log.filter(e=>e.kind==='from').length,0);
  assert.equal(c.notices.at(-1).bad,true);
  assert.equal(button.disabled,false);
 }
});
test('cancelled terminal & pending->done denied locally, not sent',async()=>{
 const c=setup(),r={...row(),status:'cancelled'},button={disabled:false};
 await c.updateBooking(r,'confirmed','Note conservée',button);
 assert.equal(c.log.length,0);
 r.status='pending';
 await c.updateBooking(r,'done','Note conservée',button);
 assert.equal(c.log.length,0);
});
test('historical rows retain previous direct update even in staged mode',async()=>{
 const c=setup(),r=row(null),button={disabled:false};
 await c.updateBooking(r,'confirmed','Note historique',button);
 assert.equal(c.log.some(e=>e.kind==='rpc'),false);
 assert.equal(c.log.filter(e=>e.kind==='from').length,1);
 assert.equal(c.log.find(e=>e.kind==='update').payload.status,'confirmed');
 assert.equal(c.log.find(e=>e.kind==='update').payload.note_text,'Note historique');
 assert.equal(r.status,'confirmed');
 assert.equal(r.note_text,'Note historique');
 assert.equal(button.disabled,false);
});
test('without activation existing rows stay on legacy code path',async()=>{
 const c=setup({v5:false}),r=row(),button={disabled:false};
 await c.updateBooking(r,'cancelled','Note conservée',button);
 assert.equal(c.log.some(e=>e.kind==='rpc'),false);
 assert.equal(c.log.some(e=>e.kind==='from'),true);
});
test('frontend never claims done is independent DIGIY TRUST proof',()=>{
 assert.match(page,/aucun paiement supposé/);
 assert.match(page,/sans preuve automatique DIGIY TRUST/);
 assert.match(page,/client_request_id IS NOT NULL|client_request_id/);
});
