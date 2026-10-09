// DIGIY TRUST — RÉSA public widget V1. Render ONLY verified aggregates delivered
// by a secured server endpoint. Never fetch or publish private reviews here.
// This module does not verify a client, authorize a booking or accept a review.
export const BUSINESS_CRITERIA=Object.freeze([
  ['punctuality','Ponctualité / fiabilité'],
  ['quality','Qualité de la prestation'],
  ['welcome','Accueil / attitude'],
  ['availability','Disponibilité'],
  ['proximity','Proximité / accessibilité'],
  ['followup','Suivi / fidélité']
]);
const isScore=n=>typeof n==='number'&&Number.isFinite(n)&&n>=1&&n<=5;
const isCount=n=>Number.isSafeInteger(n)&&n>=1;
const round=n=>Math.round(n*10)/10;
export function verifiedResaRatingView(raw){
 const empty={hasVerifiedReviews:false,label:'Pas encore d’évaluation vérifiée',
   reviewCount:0,overall:null,qualityPrice:null,details:[]};
 // Only accept explicitly verified PUBLIC aggregates, never raw feedback rows.
 if(!raw||raw.status!=='verified_public_aggregate'||!isCount(raw.review_count)
   ||!isScore(raw.overall_stars)||!isScore(raw.value_for_money_stars))return empty;
 const details=[];
 for(const [id,label] of BUSINESS_CRITERIA){
   const entry=raw.criteria?.[id];
   if(!entry)continue;
   if(!isScore(entry.stars)||!isCount(entry.count)||entry.count>raw.review_count)continue;
   details.push({id,label,stars:round(entry.stars),count:entry.count});
 }
 return {hasVerifiedReviews:true,label:'Avis vérifiés',reviewCount:raw.review_count,
  overall:round(raw.overall_stars),qualityPrice:round(raw.value_for_money_stars),details};
}
const el=(tag,cls,text)=>{
 const n=document.createElement(tag);
 if(cls)n.className=cls;
 if(text!==undefined)n.textContent=text;
 return n;
};
export function mountResaTrustPublic(target,verifiedAggregate){
 if(!target||typeof target.replaceChildren!=='function')throw Error('trust_mount_target_required');
 const v=verifiedResaRatingView(verifiedAggregate);
 const panel=el('section','digiy-trust');
 panel.setAttribute('aria-label','Évaluations DIGIY TRUST');
 panel.append(el('h3','','⭐ DIGIY TRUST'));
 if(!v.hasVerifiedReviews){
   panel.append(el('p','trust-empty',v.label));
   target.replaceChildren(panel);
   return v;
 }
 const top=el('div','trust-metrics');
 const overall=el('div','trust-metric');
 overall.append(el('strong','','Note générale'));
 overall.append(el('p','trust-score',v.overall.toFixed(1)+' / 5'));
 overall.append(el('small','',v.reviewCount+' avis vérifié'+(v.reviewCount>1?'s':'')));
 top.append(overall);
 const price=el('div','trust-metric trust-price');
 price.append(el('strong','','Rapport qualité-prix'));
 price.append(el('p','trust-score',v.qualityPrice.toFixed(1)+' / 5'));
 price.append(el('small','','Valeur reçue, pas prix le plus bas'));
 top.append(price);panel.append(top);
 const detail=el('details','trust-breakdown');
 detail.append(el('summary','','Voir les notes par critère'));
 if(v.details.length){
   const list=el('ul','');
   for(const item of v.details){
     const li=el('li','');
     li.append(el('span','',item.label+' : '));
     li.append(el('strong','',item.stars.toFixed(1)+' / 5'));
     li.append(el('small','',' ('+item.count+' note'+(item.count>1?'s':'')+')'));
     list.append(li);
   }
   detail.append(list);
 }else detail.append(el('p','trust-empty','Détail non disponible'));
 panel.append(detail);
 target.replaceChildren(panel);
 return v;
}
