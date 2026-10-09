'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const page=read('planning.html'),gestion=read('gestion.html'),
  doc=read('REGLE-PLANNING-V2.md'),readme=read('README.md');
function scripts(html){return [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(Boolean)}
test('les pages MASTER V2 sont syntaxiquement valides',()=>{
 for(const [name,html] of [['planning',page],['gestion',gestion]])
   for(const js of scripts(html))assert.doesNotThrow(()=>new vm.Script(js,{filename:name+'.js'}));
});
test('planning public sept jours : zéro client simulé et aucune réservation automatique',()=>{
 assert.match(page,/i<7;i\+\+/);
 assert.match(page,/digiy_resa_public_week_v1/);
 assert.match(page,/data\.public_whatsapp/);
 assert.match(page,/https:\/\/wa\.me\//);
 assert.match(page,/Aucun créneau disponible/);
 assert.doesNotMatch(page,/digiy_resa_create_booking|resa_create_booking_by_slug/);
 assert.match(page,/\[SUPABASE_URL\]/);
 assert.match(page,/\[SUPABASE_PUBLISHABLE_KEY\]/);
 assert.match(page,/\[PUBLIC_RESA_MULTI_URL\]/);
 assert.doesNotMatch(page,/wesqmwjjtsefyjnluosj|test-resa-beauty-saly|service_role|sb_publishable_tGHItRgeWDmGjnd0CK1DVQ_BIep4Ug3/);
});
test('gestion privé : le planning observe les créneaux qui appartiennent à la session',()=>{
 assert.match(gestion,/function renderWeekBoard/);
 assert.match(gestion,/id="weekBoard"/);
 assert.match(gestion,/weekOffset/);
 assert.match(gestion,/auth\.getSession|auth\.onAuthStateChange/);
 assert.match(gestion,/digiy_resa_slots/);
 assert.match(gestion,/auth_user_id|digiy_resa_profiles/);
});
test('MAÎTRE décrit les limites et les tests opérationnels',()=>{
 for(const word of ['BEAUTY','RESTO','LOC','DRIVER','auth.uid()','RLS','BAT','Aucune caisse'])
   assert.ok(doc.includes(word),word);
 assert.match(readme,/REGLE-PLANNING-V2.md/);
});

test('planning propriétaire : jours et heures entièrement choisis, sans horaires par défaut',()=>{
 assert.match(gestion,/id="bulkMonday"/);
 assert.match(gestion,/id="bulkDuration"/);
 assert.match(gestion,/function weekDraft/);
 assert.match(gestion,/ignoreDuplicates:true/);
 assert.match(gestion,/onConflict:'slug,slot_date,start_time'/);
 assert.doesNotMatch(gestion,/data-bulk-day="[1-7]" checked/);
 const times=[...gestion.matchAll(/<input type="time" class="bulkHour"(?: value="([^"]*)")?>/g)];
 assert.equal(times.length,6);
 assert.ok(times.every(x=>!x[1]));
 assert.match(gestion,/id="openPublicPlanning"/);
 assert.match(gestion,/\[SUPABASE_URL\]/);
 assert.match(gestion,/\[SUPABASE_PUBLISHABLE_KEY\]/);
 assert.doesNotMatch(page,/https:\/\/resa\.digiylyfe\.com\/fiche\.html/);
});
test('semaine propriétaire : vrais choix, chevauchements évités, fermetures conservées',()=>{
 const begin=gestion.indexOf('function weekDraft(){');
 const end=gestion.indexOf('async function openBulkWeek(){',begin);
 assert.ok(begin>=0&&end>begin);
 const extracted=gestion.slice(begin,end);
 const current=new Date();current.setHours(12,0,0,0);
 const monday=new Date(current);monday.setDate(monday.getDate()+((8-monday.getDay())%7));
 const fmt=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
 const day=fmt(monday);
 const values={bulkMonday:day,bulkDuration:'30'};
 const state={
  '$':id=>({value:values[id]}),
  'document':{querySelectorAll:selector=>selector.includes('bulk-day')?[{dataset:{bulkDay:'1'}},{dataset:{bulkDay:'3'}}]:[{value:'09:00'},{value:'10:00'},{value:''}]},
  slots:[],
  RESA_SLUG:'test-private-professional',
  today:()=>fmt(current),
  todayFromDate:fmt,
  Date,Number,Array,Set
 };
 const fresh=vm.runInNewContext(extracted+';weekDraft()',state);
 assert.equal(fresh.error,undefined);
 assert.equal(fresh.rows.length,4);
 assert.ok(fresh.rows.every(r=>r.status==='open'&&r.end_time==='09:30'||r.status==='open'&&r.end_time==='10:30'));
 assert.ok(fresh.rows.every(r=>r.slug==='test-private-professional'));
 const closed={slot_date:day,start_time:'09:00:00',end_time:'09:30:00',status:'closed'};
 const guarded=vm.runInNewContext(extracted+';weekDraft()',{...state,slots:[closed]});
 assert.equal(guarded.rows.length,3);
 const duplicated=vm.runInNewContext(extracted+';weekDraft()',{...state,document:{querySelectorAll:s=>s.includes('bulk-day')?[{dataset:{bulkDay:'1'}}]:[{value:'09:00'},{value:'09:00'}]}});
 assert.match(duplicated.error,/différente/);
});

test('bouton ouvrir semaine : uniquement insertions sans écraser les créneaux existants',async()=>{
 const begin=gestion.indexOf('async function openBulkWeek(){');
 const end=gestion.indexOf("$('bulkOpen').onclick=openBulkWeek;",begin);
 assert.ok(begin>=0&&end>begin);
 const snippet=gestion.slice(begin,end);
 const rows=[{slug:'my-pro',slot_date:'2026-10-12',start_time:'09:00',end_time:'09:45',status:'open'}];
 const calls=[];
 const controls={bulkOpen:{disabled:false},bulkMsg:{textContent:''}};
 const ctx={
  profile:{slug:'my-pro'},weekDraft:()=>({rows}),
  '$':key=>controls[key],
  msg:(el,message)=>{el.textContent=message},
  db:{from:table=>{
   assert.equal(table,'digiy_resa_slots');
   return {upsert:async(payload,options)=>{calls.push({payload,options});return {error:null}}};
  }},
  loadSlots:async()=>{calls.push({refreshed:true})}
 };
 await vm.runInNewContext(snippet+';openBulkWeek()',ctx);
 assert.equal(calls.length,2);
 assert.equal(calls[0].payload.length,1);
 assert.equal(calls[0].options.onConflict,'slug,slot_date,start_time');
 assert.equal(calls[0].options.ignoreDuplicates,true);
 assert.equal(controls.bulkOpen.disabled,false);
 assert.match(controls.bulkMsg.textContent,/Semaine préparée/);
});

test('Doctrine universelle validée : exceptions métier explicites et sécurité pré-activation',()=>{
 const registry=JSON.parse(read('capabilities-resa-multi.json'));
 const contract=read('CONTRAT-RESA-MULTI-20261009.md');
 const ids=registry.target_architecture.specialist_exceptions.map(x=>x.module);
 assert.deepEqual(ids,['RESTO','LOC','DRIVER','OTHER_FIELD_CASES']);
 assert.equal(registry.target_architecture.universal_appointment_booking.status,'planned_not_production_ready');
 assert.equal(registry.target_architecture.universal_appointment_booking.never_claim_automatic_confirmation_without_server_commit,true);
 assert.ok(registry.target_architecture.universal_appointment_booking.requires.includes('atomic_server_booking'));
 assert.equal(registry.business_rules.zero_commission,true);
 assert.equal(registry.business_rules.direct_payment,true);
 assert.equal(registry.business_rules.universal_checkout,false);
 for(const word of ['RESTO','LOC','DRIVER','terrain','atomique']){
  assert.ok(doc.includes(word),'MAÎTRE: '+word);
  assert.ok(contract.includes(word),'CONTRAT: '+word);
 }
 assert.match(readme,/réservation automatique universelle/);
 assert.match(doc,/pas encore déclaré|pas encore|À construire/);
 assert.doesNotMatch(doc,/réservation automatique générique déjà opérationnelle/i);
});
