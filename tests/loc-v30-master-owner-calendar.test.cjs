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


const carnetStart=html.indexOf('async function loadReservationCarnet(){');
const carnetEnd=html.indexOf('$("sendCode").onclick=sendCode;',carnetStart);
const parseStart=html.indexOf('const parseDay=value=>');
const parseEnd=html.indexOf('};',parseStart)+2;
assert(carnetStart>0&&carnetEnd>carnetStart&&parseStart>0&&parseEnd>parseStart,
  'expected V30 private booking functions and local date parser');
const carnetCode=html.slice(parseStart,parseEnd)+'\n'+html.slice(carnetStart,carnetEnd);

function fakeNode(kind='div'){
  const node={
    kind,children:[],attributes:{},listeners:{},textContent:'',value:'',
    disabled:false,className:'',
    classList:{add(){}},
    append(...items){this.children.push(...items)},
    appendChild(item){this.children.push(item)},
    replaceChildren(...items){this.children=[...items]},
    setAttribute(k,v){this.attributes[k]=v},
    addEventListener(k,cb){this.listeners[k]=cb}
  };
  return node;
}
function carnetHarness({v2=[],v1=[],cancelReply={data:{ok:true,status:'cancelled',released_days:2,retained_blocked_days:0},error:null},saveReply={data:[{id:'book-new'}],error:null}}={}){
  const elements={};
  const el=id=>elements[id]||(elements[id]=fakeNode());
  el('guestName').value='Client exemple';
  el('guestPhone').value='000-TEST';
  el('reservationSource').value='Direct';
  const calls=[],notices=[],events=[];
  const db={rpc:async (name,args)=>{
    calls.push({name,args});
    if(name==='digiy_loc_master_list_reservations_v2')
      return v2.length?v2.shift():{data:[],error:null};
    if(name==='digiy_loc_master_list_reservations_v1')
      return v1.length?v1.shift():{data:[],error:null};
    if(name==='digiy_loc_master_cancel_reservation_v1')return cancelReply;
    if(name==='digiy_loc_master_save_reservation_v1')return saveReply;
    throw new Error('Unexpected RPC: '+name);
  }};
  const context={
    $,db,document:{createElement:fakeNode},
    window:{confirm:()=>true},
    today:()=>new Date(2026,9,8,12),
    iso:()=> '2026-10-08',
    fmt:d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'),
    setMsg:(_el,message,bad=false)=>notices.push({message,bad}),
    saveStatus:el('saveStatus'),
    loadStates:async()=>events.push('loadStates'),
    render:()=>events.push('render'),
    resetSelection:()=>events.push('resetSelection'),
    selectedDates:()=>['2026-12-20','2026-12-21'],
    $:el
  };
  const api=vm.runInNewContext('let reservations=[],ownerCancelV30Enabled=false,unitId="test-unit";\n'+carnetCode+
    '\n({loadReservationCarnet,renderReservations,cancelPrivateReservation,savePrivateReservation,'+
    'parseDay,getHistory:()=>reservations,canCancel:()=>ownerCancelV30Enabled})',context);
  return {api,el,calls,notices,events};
}
const booking={id:'test-reservation',unit_id:'test-unit',guest_name:'Client fictif de test',
  guest_phone:'000-TEST',start_day:'2026-12-20',end_day:'2026-12-21',
  source:'Direct',note:'Dossier privé',status:'active'};

test('MASTER V30 ISO parser handles local calendar dates',()=>{
 const h=carnetHarness();
 const result=h.api.parseDay('2026-12-20');
 assert.equal(result.getFullYear(),2026);
 assert.equal(result.getMonth(),11);
 assert.equal(result.getDate(),20);
 assert.equal(h.api.parseDay('bad'),null);
});

test('MASTER v1 fallback displays history but does NOT offer cancellation',async()=>{
 const h=carnetHarness({
   v2:[{data:null,error:{code:'PGRST202',message:'function not found'}}],
   v1:[{data:[booking],error:null}]
 });
 assert.equal(await h.api.loadReservationCarnet(),true);
 assert.equal(h.api.canCancel(),false);
 assert.equal(h.api.getHistory().length,1);
 assert.equal(h.el('reservationList').children.length,1);
 const card=h.el('reservationList').children[0];
 assert.equal(card.children.filter(x=>x.kind==='div'&&x.className==='reservation-actions').length,0);
 assert.deepEqual(h.calls.map(x=>x.name),
   ['digiy_loc_master_list_reservations_v2','digiy_loc_master_list_reservations_v1']);
});

test('MASTER V30 active booking exposes a labelled owner cancellation action',async()=>{
 const h=carnetHarness({v2:[{data:[booking],error:null}]});
 await h.api.loadReservationCarnet();
 assert.equal(h.api.canCancel(),true);
 const card=h.el('reservationList').children[0];
 const actions=card.children.find(x=>x.className==='reservation-actions');
 assert(actions);
 const cancel=actions.children[0];
 assert.equal(cancel.attributes['aria-label'],'Annuler la réservation de Client fictif de test');
});

test('MASTER V30 cancellation preserves history and reloads calendar, no outbound traffic',async()=>{
 const cancelled={...booking,status:'cancelled',cancelled_at:'2026-10-08T00:00:00Z'};
 const h=carnetHarness({v2:[{data:[booking],error:null},{data:[cancelled],error:null}]});
 await h.api.loadReservationCarnet();
 const card=h.el('reservationList').children[0];
 const button=card.children.find(x=>x.className==='reservation-actions').children[0];
 await h.api.cancelPrivateReservation(booking,button);
 assert.equal(h.calls.filter(x=>x.name==='digiy_loc_master_cancel_reservation_v1').length,1);
 assert.deepEqual(h.events,['loadStates','render']);
 assert.match(h.notices.at(-1).message,/historique conservé/);
 assert.equal(h.api.getHistory()[0].status,'cancelled');
 assert.equal(button.disabled,false);
 assert.equal(h.api.canCancel(),true);
});

test('MASTER V30 cancellation denial does not claim success or reload calendar',async()=>{
 const h=carnetHarness({v2:[{data:[booking],error:null}],
   cancelReply:{data:null,error:{message:'OWNER_FORBIDDEN'}}});
 await h.api.loadReservationCarnet();
 const button=h.el('reservationList').children[0].children
  .find(x=>x.className==='reservation-actions').children[0];
 await h.api.cancelPrivateReservation(booking,button);
 assert.deepEqual(h.events,[]);
 assert.equal(h.notices.at(-1).bad,true);
 assert.match(h.notices.at(-1).message,/OWNER_FORBIDDEN/);
 assert.equal(button.disabled,false);
});

test('MASTER V30 owner booking uses RPC and does not contact client',async()=>{
 const h=carnetHarness({v2:[{data:[],error:null}]});
 await h.api.savePrivateReservation();
 assert.equal(h.calls[0].name,'digiy_loc_master_save_reservation_v1');
 assert.equal(h.calls[0].args.p_unit_id,'test-unit');
 assert.equal(h.calls[0].args.p_start_day,'2026-12-20');
 assert.deepEqual(h.events,['loadStates','resetSelection','render']);
 assert.match(h.notices.at(-1).message,/Réservation enregistrée/);
 assert.equal(h.el('guestName').value,'');
 assert.equal(h.el('guestPhone').value,'');
});

test('MASTER template remains configurable and does not hardcode existing territory',()=>{
 assert.match(html,/SITE_SLUG="\[SITE-SLUG-A-CONFIGURER\]"/);
 assert.doesNotMatch(html,/const SITE_SLUG=["'](?:saly|sarlat)/);
 assert.doesNotMatch(html,/Chez Baptiste Saly|Chez Baptiste Sarlat/);
 assert.match(html,/digiy_loc_master_cancel_reservation_v1/);
 assert.match(html,/digiy_loc_master_list_reservations_v2/);
});
