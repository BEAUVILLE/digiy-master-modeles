'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const atelier=path.join(root,'ATELIER-V35');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const site=read('index.html'),hub=read('ATELIER-V35/index.html');
const weekly=read('ATELIER-V35/plats-du-jour.html'),weeklyJs=read('ATELIER-V35/plats-du-jour.js');
const regular=read('ATELIER-V35/plats-salades.html');
const doc=read('CONTRAT-RESTO-V31-V35.md');
const api=require(path.join(atelier,'weekly-core.js'));

test('site complet MASTER V2, huit langues et PWA toujours présents',()=>{
 for(const id of ['accueil','histoire','carte','galerie','infos','reservation'])assert.match(site,new RegExp('id="'+id+'"'));
 assert.match(site,/const CFG=/);
 assert.match(site,/id="menuTabs"/);
 assert.match(site,/id="menuPanels"/);
 assert.match(site,/manifest\.webmanifest/);
 assert.match(site,/serviceWorker/);
 for(const lang of ['fr:','en:','es:','pt:','it:','de:','nl:','ar:'])assert.ok(site.includes(lang),'WORLD8 '+lang);
 assert.doesNotMatch(site,/ATELIER-V35|test-resa-resto-saly|resto-v35-plats-salades-apercu-valide/);
});

test('atelier comporte deux éditeurs locaux distincts, sans accès client ou propriétaire prétendu',()=>{
 assert.match(hub,/id="weekBtn" aria-pressed="true"/);
 assert.match(hub,/id="carteBtn" aria-pressed="false"/);
 assert.match(hub,/src="\.\/plats-du-jour\.html"/);
 assert.match(hub,/src="\.\/plats-salades\.html"/);
 assert.match(hub,/n'est pas un espace propriétaire authentifié/);
 assert.match(hub,/rien n'est enregistré|Rien n'est enregistré/);
 assert.match(hub,/show\('semaine'\)/);
 assert.match(hub,/show\('carte'\)/);
 assert.doesNotMatch(hub,/supabase|auth\.getUser|owner_id|service_role|localStorage|fetch\s*\(/i);
});

test('semaine importée fonctionne avec des dépendances relatives, pas des dépendances manquantes',()=>{
 assert.match(weekly,/src="\.\/weekly-core\.js" defer/);
 assert.match(weekly,/src="\.\/plats-du-jour\.js" defer/);
 assert.doesNotMatch(weekly,/src="\.\.\/src\//);
 assert.match(weekly,/PUBLICATION|Publication/);
 assert.match(weekly,/MAQUETTE DE PRÉPARATION — NON CONNECTÉE/);
 assert.match(weeklyJs,/DigiyWeeklyMenuCore/);
 for(const p of ['weekly-core.js','plats-du-jour.js','plats-du-jour.html','plats-salades.html']){
  assert.ok(fs.existsSync(path.join(atelier,p)),'missing '+p);
 }
});
test('règles calendrier : lundi correct, sept jours, fuseau et pas de reconduction implicite',()=>{
 assert.equal(api.mondayOf('2026-10-09'),'2026-10-05');
 assert.deepEqual(Array.from(api.weekDates('2026-10-09')),[
  '2026-10-05','2026-10-06','2026-10-07','2026-10-08',
  '2026-10-09','2026-10-10','2026-10-11'
 ]);
 assert.equal(api.localDay(new Date('2026-10-09T00:30:00Z'),'Africa/Dakar'),'2026-10-09');
 assert.equal(api.localDay(new Date('2026-10-09T23:30:00Z'),'Europe/Paris'),'2026-10-10');
 assert.match(fs.readFileSync(path.join(atelier,'weekly-core.js'),'utf8'),/Week menus cannot automatically claim/);
});
test('carte approuvée est conservée : uniquement plats et salades, aperçu client, photos locales',()=>{
 assert.match(regular,/ESSAI INTERACTIF — NON PUBLIÉ/);
 assert.match(regular,/id="category"/);
 assert.match(regular,/<option value="plats">Plats<\/option>/);
 assert.match(regular,/<option value="salades">Salades<\/option>/);
 assert.doesNotMatch(regular,/<option value="(menus|formules|boissons|desserts)"/);
 assert.match(regular,/id="previewBtn"/);
 assert.match(regular,/id="publicPreview"/);
 assert.match(regular,/PUBLIE?R SUR MA FICHE|PUBLIER SUR MA FICHE/);
 assert.match(regular,/disabled>PUBLIER SUR MA FICHE<\/button>/);
 assert.match(regular,/4 Mo maximum/);
 assert.match(regular,/image\/webp/);
 assert.match(regular,/URL\.revokeObjectURL/);
 assert.doesNotMatch(regular,/fetch\s*\(|XMLHttpRequest|localStorage|indexedDB|service_role|supabase/i);
});
test('aucune identité test ou clé cliente codée dans les éditeurs MASTER',()=>{
 for(const h of [hub,regular,weekly,weeklyJs]){
  assert.doesNotMatch(h,/test-resa-resto-saly|modele-resa-resto-sarlat|entre2-sarlat|le-malraux-sarlat|wesqmwjjtsefyjnluosj|sb_publishable_|sk_test_/i);
 }
});
test('MAÎTRE exige vérification propriétaire serveur, approbation, pas de caisse',()=>{
 for(const x of ['auth.getUser()','owner_id === user.id','RLS','brouillon','versions publiées','aucun logiciel de caisse','0 % commission']){
  assert.ok(doc.includes(x),x);
 }
 assert.match(doc,/PR #19[\s\S]*brouillon non fusionné/i);
 assert.match(doc,/PR #21[\s\S]*brouillon non fusionné/i);
 assert.match(doc,/PR #24[\s\S]*brouillon non fusionné/i);
 assert.match(doc,/PR #31/);
 assert.match(doc,/PR #32/);
 assert.match(doc,/PR #33/);
 assert.match(read('README.md'),/Héritage terrain RESTO V31–V35/);
});
