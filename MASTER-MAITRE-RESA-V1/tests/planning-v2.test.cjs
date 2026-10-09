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
