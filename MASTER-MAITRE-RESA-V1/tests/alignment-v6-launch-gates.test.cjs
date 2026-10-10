'use strict';
// Cross-check the MASTER/MAÎTRE state against confirmed merged RÉSA V6.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const folder=path.resolve(__dirname,'..');
const capabilities=JSON.parse(fs.readFileSync(path.join(folder,'capabilities-resa-multi.json'),'utf8'));
const owner=fs.readFileSync(path.join(folder,'gestion.html'),'utf8');
const planning=fs.readFileSync(path.join(folder,'planning.html'),'utf8');
const doc=fs.readFileSync(path.join(folder,'ALIGNEMENT-MASTER-MAITRE-RESA-V6-20261010.md'),'utf8');
const track=capabilities.universal_booking_track;
const alignment=capabilities.master_maitre_alignment;
const decision=capabilities.release_decision;

test('source RÉSA V6 and MASTER V5 lineage match actual merged revisions',()=>{
 assert.equal(capabilities.snapshot_date,'2026-10-10');
 assert.equal(track.source_repository,'BEAUVILLE/digiy-resa-table-resto');
 assert.match(track.source_main_merged_commit,/^[0-9a-f]{40}$/);
 assert.equal(track.source_main_merged_commit,'38770f95232be480735790651f4ef3178faac4e6');
 assert.equal(track.last_merged_pr,30);
 assert.deepEqual(track.stages.map(x=>x.proof_pr),[22,23,25,26,27,28,29,30]);
 assert.ok(track.stages.every(x=>x.production_activated===false));
 assert.equal(alignment.master_owner_v5_proof_pr,20);
 assert.equal(track.end_to_end_pg17_ci_passed,true);
});
test('MAÎTRE and MASTER are contract-aligned, not falsely declared production parity',()=>{
 assert.equal(alignment.state,'reference_and_owner_client_contract_aligned__runtime_not_at_same_level');
 assert.equal(alignment.source_v4_client_module_copied_to_master,false);
 assert.equal(alignment.public_planning_read_only,true);
 assert.equal(alignment.backend_v0_v1_v2_v5_deployed_to_core,false);
 assert.equal(track.source_pages_user_booking_activated,false);
 assert.equal(track.live_owner_login_A_B_tested,false);
 assert.equal(track.real_staging_environment_confirmed,false);
 assert.equal(track.real_professional_BAT_approved,false);
 assert.equal(track.backup_recent_restore_verified,false);
 assert.equal(track.production_sql_authorized,false);
 assert.equal(track.automatic_booking_production_ready,false);
 assert.match(doc,/parité.*fonctionnelle|fonctionnelle.*parité/i);
});
test('owner V5 remains physically gated OFF, client planning only reads legacy week',()=>{
 assert.match(owner,/const RESA_V5_STAGING_ENABLED=false;/);
 assert.match(owner,/digiy_resa_universal_owner_manage_v2/);
 assert.match(owner,/usesOwnerV5\(r\)/);
 assert.match(owner,/if\(usesOwnerV5\(r\)\)/);
 assert.match(owner,/LEGACY PATH: intentionally preserved/);
 assert.match(planning,/digiy_resa_public_week_v1/);
 assert.doesNotMatch(planning,/digiy_resa_universal_request_v0|staging-booking-flow-v4/);
 assert.doesNotMatch(owner,/RESA_V5_STAGING_ENABLED\s*=\s*true/);
});
test('production launch gate is NO-GO and cannot silently authorize payments',()=>{
 assert.equal(decision.phase,'pilot_readiness_only');
 assert.equal(decision.gates.production_launch,'NO_GO');
 for(const gate of ['backup_latest_archive_restore','supabase_staging_real_A_B',
  'non_destructive_migration_review','owner_legacy_RPC_impact','first_real_professional_BAT']){
  assert.equal(decision.gates[gate],'BLOCKED');
 }
 for(const forbidden of ['apply_SQL_to_digiy_core','enable_real_public_booking',
  'enable_master_v5_in_production','create_fake_professional_or_booking',
  'claim_client_payment_from_booking_state']) assert.ok(decision.forbidden.includes(forbidden));
 assert.equal(capabilities.business_rules.zero_commission,true);
 assert.equal(capabilities.business_rules.direct_payment,true);
 assert.equal(capabilities.migration_included,false);
 assert.equal(capabilities.owner_data_included,false);
});
