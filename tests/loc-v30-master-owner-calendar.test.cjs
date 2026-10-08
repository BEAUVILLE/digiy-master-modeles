'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');

const html=fs.readFileSync(path.join(__dirname,'../LOC/MASTER-MAITRE-LOC/gestion.html'),'utf8');
const start=html.indexOf('async function applyState(status){');
const end=html.indexOf('$("sendCode").onclick=sendCode;',start);
assert(start>0&&end>start,'expected MASTER calendar handler');
const handler=html.slice(start,end);

test('full MASTER inline script is valid JavaScript',()=>{
  const tags=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
  const inline=tags.map(t=>t[1]).filter(Boolean);
  assert.equal(inline.length,1);
  assert.doesNotThrow(()=>new vm.Script(inline[0]));
});

test('MASTER owner handler must not directly write calendar table',()=>{
  assert.match(handler,/digiy_loc_set_unit_calendar_state_v2/);
  assert.doesNotMatch(handler,/\.delete\s*\(|\.upsert\s*\(|\.insert\s*\(|\.update\s*\(/);
  assert.match(handler,/BOOKING_DATES_PROTECTED_USE_CANCELLATION/);
});

function harness({status='occupied',reply=null,rows=null,readError=null}={}){
  const dates=['2026-12-20','2026-12-21'];
  const responses=[];const rpcCalls=[];const fromCalls=[];const events=[];
  const buttons={makeAvailable:{disabled:false},makeOccupied:{disabled:false},makeClosed:{disabled:false}};
  const actualRows=rows!==null?rows:status==='available'?[]:dates.map(day=>({day,status}));
  const db={
    rpc:async(name,args)=>{rpcCalls.push({name,args});return reply||{data:dates.map(day=>({day,status})),error:null};},
    from:table=>{
      fromCalls.push(table);
      const q={select:()=>q,eq:()=>q,in:async()=>({data:actualRows,error:readError})};
      return q;
    }
  };
  const context={
    selectedDates:()=>dates,unitId:'00000000-0000-4000-8000-000000000001',
    saveStatus:{},db,$:id=>buttons[id],
    setMsg:(_node,message,isError=false)=>responses.push({message,isError}),
    loadStates:async()=>events.push('reload'),
    resetSelection:()=>events.push('reset'),
    render:()=>events.push('render')
  };
  const applyState=vm.runInNewContext(handler+'\napplyState',context);
  return {applyState,dates,responses,rpcCalls,fromCalls,events,buttons};
}

test('occupied dates are written by RPC, verified by readback, and controls unlocked',async()=>{
 const h=harness();await h.applyState('occupied');
 assert.equal(h.rpcCalls.length,1);
 assert.equal(h.rpcCalls[0].name,'digiy_loc_set_unit_calendar_state_v2');
 assert.equal(h.fromCalls.length,1);
 assert.deepEqual(h.events,['reload','reset','render']);
 assert.match(h.responses.at(-1).message,/confirmé côté serveur/);
 assert(Object.values(h.buttons).every(x=>!x.disabled));
});

test('opening available dates confirms absent calendar rows',async()=>{
 const h=harness({status:'available'});await h.applyState('available');
 assert.match(h.responses.at(-1).message,/confirmé côté serveur/);
 assert.deepEqual(h.events,['reload','reset','render']);
});

test('a booked day cannot be freed from calendar UI',async()=>{
 const h=harness({reply:{data:null,error:{message:'BOOKING_DATES_PROTECTED_USE_CANCELLATION'}}});
 await h.applyState('available');
 assert.equal(h.fromCalls.length,0);
 assert.deepEqual(h.events,[]);
 assert.match(h.responses.at(-1).message,/Dates réservées/);
 assert.equal(h.responses.at(-1).isError,true);
 assert(Object.values(h.buttons).every(x=>!x.disabled));
});

test('RPC response without all days fails closed',async()=>{
 const h=harness({reply:{data:[{day:'2026-12-20',status:'occupied'}],error:null}});
 await h.applyState('occupied');
 assert.equal(h.fromCalls.length,0);assert.deepEqual(h.events,[]);
 assert.match(h.responses.at(-1).message,/incomplète/);
});

test('RPC success but inconsistent readback stops without confirming availability',async()=>{
 const h=harness({rows:[{day:'2026-12-20',status:'occupied'}]});
 await h.applyState('occupied');
 assert.deepEqual(h.events,[]);
 assert.match(h.responses.at(-1).message,/non conforme/);
 assert(Object.values(h.buttons).every(x=>!x.disabled));
});
