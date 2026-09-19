/* DIGIY DRIVER PUBLIC PROFILE V1 — MASTER MAÎTRE */
(()=>{
'use strict';
const meta=document.querySelector('meta[name="digiy-driver-slug"]');
const slug=(meta?.content||'').trim();
if(!slug || /^\[.*\]$/.test(slug)) return;
const ENDPOINT='https://wesqmwjjtsefyjnluosj.supabase.co/functions/v1/driver-public-presence?slug='+encodeURIComponent(slug);
const $=id=>document.getElementById(id);
const T={
fr:{title:'Disponibilité maintenant',available:'🟢 Disponible',busy:'🟠 Occupé',unavailable:'⚫ Indisponible',confirm:'⚪ À confirmer',sector:'Secteur actuel',none:'Secteur à confirmer',note:'Statut déclaré par le chauffeur. Après 4 heures sans mise à jour, la fiche revient automatiquement à « À confirmer ».',acYes:'Climatisation',acNo:'Sans climatisation',networkYes:'Ouvert aux demandes du réseau professionnel',networkNo:'Clients particuliers uniquement'},
en:{title:'Availability now',available:'🟢 Available',busy:'🟠 Busy',unavailable:'⚫ Unavailable',confirm:'⚪ To confirm',sector:'Current area',none:'Area to confirm',note:'Status set by the driver. After 4 hours without an update, the profile automatically returns to “To confirm”.',acYes:'Air conditioning',acNo:'No air conditioning',networkYes:'Open to professional network requests',networkNo:'Private clients only'},
es:{title:'Disponibilidad ahora',available:'🟢 Disponible',busy:'🟠 Ocupado',unavailable:'⚫ No disponible',confirm:'⚪ Por confirmar',sector:'Zona actual',none:'Zona por confirmar',note:'Estado indicado por el conductor. Tras 4 horas sin actualización, la ficha vuelve automáticamente a “Por confirmar”.',acYes:'Climatización',acNo:'Sin climatización',networkYes:'Abierto a solicitudes de la red profesional',networkNo:'Solo clientes particulares'},
pt:{title:'Disponibilidade agora',available:'🟢 Disponível',busy:'🟠 Ocupado',unavailable:'⚫ Indisponível',confirm:'⚪ A confirmar',sector:'Zona atual',none:'Zona a confirmar',note:'Estado indicado pelo motorista. Após 4 horas sem atualização, a ficha volta automaticamente a “A confirmar”.',acYes:'Ar condicionado',acNo:'Sem ar condicionado',networkYes:'Aberto a pedidos da rede profissional',networkNo:'Apenas clientes particulares'},
it:{title:'Disponibilità adesso',available:'🟢 Disponibile',busy:'🟠 Occupato',unavailable:'⚫ Non disponibile',confirm:'⚪ Da confermare',sector:'Zona attuale',none:'Zona da confermare',note:'Stato indicato dall’autista. Dopo 4 ore senza aggiornamento, la scheda torna automaticamente a “Da confermare”.',acYes:'Aria condizionata',acNo:'Senza aria condizionata',networkYes:'Aperto alle richieste della rete professionale',networkNo:'Solo clienti privati'},
de:{title:'Verfügbarkeit jetzt',available:'🟢 Verfügbar',busy:'🟠 Beschäftigt',unavailable:'⚫ Nicht verfügbar',confirm:'⚪ Zu bestätigen',sector:'Aktueller Bereich',none:'Bereich zu bestätigen',note:'Status vom Fahrer angegeben. Nach 4 Stunden ohne Aktualisierung wechselt das Profil automatisch zu „Zu bestätigen“.',acYes:'Klimaanlage',acNo:'Keine Klimaanlage',networkYes:'Offen für Anfragen aus dem professionellen Netzwerk',networkNo:'Nur Privatkunden'},
nl:{title:'Beschikbaarheid nu',available:'🟢 Beschikbaar',busy:'🟠 Bezet',unavailable:'⚫ Niet beschikbaar',confirm:'⚪ Te bevestigen',sector:'Huidige zone',none:'Zone te bevestigen',note:'Status door de chauffeur ingesteld. Na 4 uur zonder update gaat het profiel automatisch terug naar “Te bevestigen”.',acYes:'Airconditioning',acNo:'Geen airconditioning',networkYes:'Open voor aanvragen uit het professionele netwerk',networkNo:'Alleen particuliere klanten'},
ar:{title:'التوفر الآن',available:'🟢 متاح',busy:'🟠 مشغول',unavailable:'⚫ غير متاح',confirm:'⚪ يحتاج إلى تأكيد',sector:'المنطقة الحالية',none:'المنطقة تحتاج إلى تأكيد',note:'يحدد السائق حالته بنفسه. بعد 4 ساعات دون تحديث تعود البطاقة تلقائياً إلى «يحتاج إلى تأكيد».',acYes:'مكيف',acNo:'بدون مكيف',networkYes:'متاح لطلبات الشبكة المهنية',networkNo:'للعملاء الأفراد فقط'}
};
let row=null;
function lang(){const l=(document.documentElement.lang||'fr').slice(0,2).toLowerCase();return T[l]?l:'fr'}
function setText(id,value){const el=$(id);if(el && value!==undefined && value!==null && String(value).trim()!=='')el.textContent=String(value)}
function renderList(container,items){
 if(!container || !Array.isArray(items) || !items.length)return;
 container.replaceChildren();
 items.forEach(item=>{const d=document.createElement('div');d.textContent=String(item);container.appendChild(d)});
}
function renderServices(items){
 const box=$('servicesGrid');
 if(!box || !Array.isArray(items) || !items.length)return;
 box.replaceChildren();
 items.forEach((item,i)=>{const c=document.createElement('article');c.className='card';const ico=document.createElement('div');ico.className='ico';ico.textContent=['🚗','✈️','🛣️','🕒','🧭','🤝'][i%6];const h=document.createElement('h3');h.textContent=String(item);const p=document.createElement('p');p.textContent='Service déclaré par le chauffeur.';c.append(ico,h,p);box.appendChild(c)});
}
function render(){
 const t=T[lang()],status=row?.effective_status||'confirm';
 setText('liveTitle',t.title);setText('liveStatus',t[status]||t.confirm);setText('liveSectorLabel',t.sector);
 if($('liveSector'))$('liveSector').textContent=row?.current_sector||t.none;
 setText('liveNote',t.note);
 if(!row)return;
 if(row.seats!=null){setText('vehicleSeats',row.seats);setText('quickSeats',row.seats)}
 if(row.luggage_capacity){setText('vehicleBags',row.luggage_capacity);setText('quickBags',row.luggage_capacity)}
 if(row.has_ac===true){setText('vehicleComfort',t.acYes);setText('quickComfort',t.acYes)}
 if(row.has_ac===false){setText('vehicleComfort',t.acNo);setText('quickComfort',t.acNo)}
 if(Array.isArray(row.languages)&&row.languages.length)setText('driverLanguages',row.languages.join(' · '));
 if(row.indicative_rates)setText('indicativeRates',row.indicative_rates);
 if(row.pro_network_enabled===true)setText('proNetworkStatus',t.networkYes);
 if(row.pro_network_enabled===false)setText('proNetworkStatus',t.networkNo);
 renderList(document.querySelector('.zone-summary'),row.service_zones);
 renderServices(row.services);
}
async function load(){
 try{const r=await fetch(ENDPOINT,{cache:'no-store'});row=r.ok?await r.json():null}catch(_){row=null}
 render();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{render();load()});else{render();load()}
window.addEventListener('focus',load);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')load()});
new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
setInterval(load,60000);
})();