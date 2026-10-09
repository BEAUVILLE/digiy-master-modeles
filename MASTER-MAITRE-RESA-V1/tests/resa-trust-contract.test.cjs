'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const cfg=JSON.parse(read('trust/resa-trust-contract-v1.json'));
const preview=read('trust/resa-trust-empty-preview.html');
const doc=read('CONTRAT-DIGIY-TRUST-RESA-V1.md');
const load=()=>import(pathToFileURL(path.join(root,'trust/resa-trust-public-widget.mjs')));

test('RÉSA hérite de LOC : étoiles sans commentaires, vraie prestation, note qualité-prix à part',()=>{
 assert.equal(cfg.status,'REFERENCE_READY_NOT_DEPLOYED');
 assert.equal(cfg.comments_allowed,false);
 assert.equal(cfg.scoring_type,'stars_1_to_5');
 assert.equal(cfg.one_booking_one_review,true);
 assert.equal(cfg.booking_evidence.booking_state_alone_not_proof,true);
 assert.equal(cfg.booking_evidence.completion_verified_by_trusted_server,true);
 assert.equal(cfg.booking_evidence.independent_client_verification,true);
 assert.equal(cfg.booking_evidence.self_review_denied,true);
 assert.equal(cfg.booking_evidence.transactional_submission,true);
 assert.equal(cfg.separate_criterion.id,'value_for_money');
 assert.equal(cfg.separate_criterion.required,true);
 assert.equal(cfg.separate_criterion.include_in_overall,false);
 assert.ok(cfg.common_criteria.every(c=>c.include_in_overall===true));
 assert.equal(cfg.common_criteria.find(c=>c.id==='quality').required,true);
 assert.equal(cfg.no_activation.no_sql_applied,true);
 assert.equal(cfg.no_activation.no_public_feedback_enabled,true);
 assert.deepEqual(cfg.specialized_engines,['RESTO','LOC','DRIVER']);
});

test('Pas encore de note : ni zéro, ni témoignage inventé, ni bouton qui enregistre',async()=>{
 const {verifiedResaRatingView}=await load();
 for(const input of [undefined,null,{}, {status:'verified_public_aggregate',review_count:0,overall_stars:0,value_for_money_stars:0},
  {status:'visitor_submitted',review_count:2,overall_stars:5,value_for_money_stars:5}]) {
  let result=verifiedResaRatingView(input);
  assert.equal(result.hasVerifiedReviews,false);
  assert.equal(result.overall,null);
  assert.equal(result.qualityPrice,null);
 }
 assert.match(preview,/noindex,nofollow/);
 assert.match(preview,/sans aucune donnée réelle ni fictive/);
 assert.match(preview,/null\)/);
 assert.doesNotMatch(preview,/<button|<textarea|<select/i);
});

test('Le rapport qualité-prix est indépendant de la moyenne générale et n’a pas le sens de prix le plus bas',async()=>{
 const {verifiedResaRatingView}=await load();
 const v=verifiedResaRatingView({
  status:'verified_public_aggregate',review_count:3,
  overall_stars:4.67,value_for_money_stars:3.33,
  criteria:{quality:{stars:4.7,count:3},punctuality:{stars:5,count:2},
  followup:{stars:3.5,count:2},unknown:{stars:5,count:3}}
 });
 assert.equal(v.hasVerifiedReviews,true);
 assert.equal(v.overall,4.7);
 assert.equal(v.qualityPrice,3.3);
 assert.notEqual(v.overall,v.qualityPrice);
 assert.equal(v.reviewCount,3);
 assert.equal(v.details.length,3);
 assert.ok(v.details.every(d=>d.id!=='value_for_money'));
 assert.match(doc,/pas.*prix le plus bas/i);
 assert.match(doc,/Note générale/);
 assert.match(doc,/Rapport qualité-prix/);
});

test('Widget accessible : deux notes visibles et critères repliés, pas d’identité client',async()=>{
 const {mountResaTrustPublic}=await load();
 class Node {
   constructor(tag){this.tag=tag;this.className='';this.attrs={};this.children=[];this.textContent='';}
   append(...children){this.children.push(...children)}
   replaceChildren(...children){this.children=children}
   setAttribute(k,v){this.attrs[k]=v}
   flattened(){return [this.textContent,...this.children.map(c=>c.flattened())].join(' ')}
 }
 const saved=global.document;
 global.document={createElement:tag=>new Node(tag)};
 try{
  const root=new Node('div');
  mountResaTrustPublic(root,null);
  assert.match(root.flattened(),/Pas encore d’évaluation vérifiée/);
  const data={status:'verified_public_aggregate',review_count:2,overall_stars:4.5,
   value_for_money_stars:3.5,criteria:{quality:{stars:5,count:2},welcome:{stars:4,count:1}}};
  mountResaTrustPublic(root,data);
  const t=root.flattened();
  assert.match(t,/Note générale.*4\.5/);
  assert.match(t,/Rapport qualité-prix.*3\.5/);
  assert.match(t,/Voir les notes par critère/);
  assert.ok(root.children[0].children.some(x=>x.tag==='details'));
  assert.doesNotMatch(t,/Téléphone|contact du client|nom du client/);
 }finally{global.document=saved}
});

test('RÉSA valeurs invalides refusées plutôt que scores trompeurs',async()=>{
 const {verifiedResaRatingView}=await load();
 const baseline={status:'verified_public_aggregate',review_count:2,overall_stars:4.2,value_for_money_stars:3.9};
 for(const change of [{review_count:-2},{overall_stars:0},{overall_stars:6},{value_for_money_stars:0},
  {value_for_money_stars:undefined},{status:'unverified'}]){
  assert.equal(verifiedResaRatingView({...baseline,...change}).hasVerifiedReviews,false);
 }
 const v=verifiedResaRatingView({...baseline,criteria:{quality:{stars:3,count:5},followup:{stars:4,count:1}}});
 assert.equal(v.details.length,1);
 assert.equal(v.details[0].id,'followup');
});
