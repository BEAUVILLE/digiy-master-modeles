'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const folder=path.resolve(__dirname,'..');
const contract=fs.readFileSync(path.join(folder,'CONTRAT-RESA-MULTI-20261009.md'),'utf8');
const readme=fs.readFileSync(path.join(folder,'README.md'),'utf8');
const data=JSON.parse(fs.readFileSync(path.join(folder,'capabilities-resa-multi.json'),'utf8'));
const owner=fs.readFileSync(path.join(folder,'gestion.html'),'utf8');

test('provenance source et 30 PR fusionnées, dont le rail V6 isolé',()=>{
 assert.equal(data.source_repository,'BEAUVILLE/digiy-resa-table-resto');
 assert.deepEqual(data.source_prs_merged,Array.from({length:30},(_,i)=>i+1));
 assert.equal(data.universal_booking_track.last_merged_pr,30);
 assert.equal(data.universal_booking_track.end_to_end_pg17_ci_passed,true);
 assert.equal(data.universal_booking_track.automatic_booking_production_ready,false);
 assert.match(contract,/portage est documentaire et réutilisable/);
 assert.match(readme,/CONTRAT-RESA-MULTI-20261009\.md/);
 assert.match(readme,/capabilities-resa-multi\.json/);
});
test('séparation REAL et DEMO, correction de compteur non simulée',()=>{
 assert.equal(data.catalogue_source_inventory.real_driver_entries,3);
 assert.equal(data.catalogue_source_inventory.demo_entries,7);
 assert.equal(data.catalogue_source_inventory.published_label_examples_claim,6);
 assert.equal(data.catalogue_source_inventory.requires_label_correction,true);
 assert.match(contract,/3 entrées chauffeurs REAL/);
 assert.match(contract,/7 objets DEMO/);
});
test('héritage de quatre modules : DRIVER, RESTO, BEAUTY, PORTAL',()=>{
 assert.deepEqual(data.capabilities.map(x=>x.module),['DRIVER','RESTO','BEAUTY','PORTAL']);
 for(const c of data.capabilities){
  assert.equal(c.source_code_merged,true);
  assert.equal(c.production_e2e_verified,false);
  assert.ok(Array.isArray(c.proof_prs)&&c.proof_prs.length>0);
  assert.ok(Array.isArray(c.requires)&&c.requires.length>0);
 }
 assert.equal(data.capabilities[2].master_portage,'review_before_adoption');
});
test('MAÎTRE protégé et aucune activation ni caisse ni migration ajoutée',()=>{
 assert.equal(data.business_rules.zero_commission,true);
 assert.equal(data.business_rules.direct_payment,true);
 assert.equal(data.business_rules.direct_professional_confirmation,true);
 assert.equal(data.business_rules.universal_checkout,false);
 assert.equal(data.business_rules.universal_restaurant_table_engine,false);
 assert.equal(data.business_rules.loc_housing_in_scope,false);
 assert.equal(data.migration_included,false);
 assert.equal(data.secrets_included,false);
 assert.equal(data.owner_data_included,false);
 assert.match(contract,/auth_user_id/);
 assert.match(contract,/ancien champ .owner_id./);
 assert.match(contract,/RLS/);
 assert.match(contract,/double réservation simultanée/);
 assert.match(readme,/Aucune URL TEST SALY/);
});
test('gestion propriétaire MASTER existante préservée',()=>{
 assert.match(owner,/digiy_resa_profiles/);
 assert.match(owner,/signInWithOtp/);
 assert.match(owner,/db\.auth\.getSession\(\)/);
 assert.match(owner,/eq\('slug',RESA_SLUG\)/);
 assert.match(owner,/shouldCreateUser:false/);
 assert.doesNotMatch(owner,/test-resa-beauty-saly/);
});
