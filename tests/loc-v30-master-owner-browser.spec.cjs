'use strict';
const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {pathToFileURL}=require('node:url');

// Never alter the reusable GitHub source template: configure synthetic slug in a
// temporary copy solely for the isolated browser test.
const template=fs.readFileSync(path.resolve(__dirname,'../LOC/MASTER-MAITRE-LOC/gestion.html'),'utf8');
if(!template.includes('[SITE-SLUG-A-CONFIGURER]'))throw Error('Factory slug placeholder unexpectedly missing');
const workdir=fs.mkdtempSync(path.join(os.tmpdir(),'digiy-loc-master-v30-browser-'));
const fixture=path.join(workdir,'gestion.html');
fs.writeFileSync(fixture,template.replace('[SITE-SLUG-A-CONFIGURER]','synthetic-site'));
const uri=mode=>pathToFileURL(fixture).href+'?mode='+mode;

test.beforeEach(async({page})=>{
  await page.addInitScript(()=>{
    window.__calls=[];window.__outbound=[];window.__confirmations=0;
    window.confirm=()=>{window.__confirmations++;return true};
    window.open=(...args)=>{window.__outbound.push(args);return null};
    window.fetch=async()=>{throw Error('LIVE NETWORK DISABLED IN TEST')};
    const reservation={
      id:'00000000-0000-4000-8000-000000000a90',
      unit_id:'00000000-0000-4000-8000-000000000a02',
      guest_name:'Client fictif de test',guest_phone:'000-TEST',
      start_day:'2027-12-20',end_day:'2027-12-21',
      source:'Direct',note:'Simulation isolée',status:'active',cancelled_at:null
    };
    window.__booking=reservation;
    const mode=new URL(location.href).searchParams.get('mode')||'v30';
    const site={id:'00000000-0000-4000-8000-000000000a01',slug:'synthetic-site',display_name:'Hébergement exemple'};
    const unit={id:reservation.unit_id,slug:'unit-test',display_name:'Unité fictive',is_active:true};
    let calendar=[{day:'2027-12-20',status:'occupied'},{day:'2027-12-21',status:'occupied'}];
    let existing=[{...reservation}];
    const query=table=>{
      const q={select:()=>q,eq:()=>q,gte:()=>q,order:()=>q,
        maybeSingle:async()=>({data:site,error:null}),
        then:(resolve,reject)=>Promise.resolve({
          data:table==='digiy_loc_master_units'?[unit]:
            table==='digiy_loc_master_unit_calendar'?calendar:[],
          error:null
        }).then(resolve,reject)
      };return q;
    };
    window.supabase={createClient:()=>({
      auth:{
        getSession:async()=>({data:{session:{user:{email:'owner@synthetic.test'}}}}),
        onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}}),
        signOut:async()=>({error:null}),
        signInWithOtp:async()=>{throw Error('NO OTP IN BROWSER FIXTURE')}
      },
      from:query,
      rpc:async(name,args)=>{
        window.__calls.push({name,args});
        if(name==='digiy_loc_master_list_reservations_v2'){
          if(mode==='legacy')return {data:null,error:{code:'PGRST202',message:'Could not find the function in schema cache'}};
          if(mode==='denied')return {data:null,error:{code:'42501',message:'OWNER_FORBIDDEN'}};
          return {data:existing.map(r=>({...r})),error:null};
        }
        if(name==='digiy_loc_master_list_reservations_v1')
          return {data:existing.map(({status,cancelled_at,...r})=>r),error:null};
        if(name==='digiy_loc_master_cancel_reservation_v1'){
          if(mode==='cancelerror')return {data:null,error:{code:'P0001',message:'OWNER_FORBIDDEN'}};
          reservation.status='cancelled';reservation.cancelled_at='2026-10-08T00:00:00Z';
          existing=[{...reservation}];calendar=[];
          return {data:{ok:true,status:'cancelled',released_days:2,retained_blocked_days:0},error:null};
        }
        if(name==='digiy_loc_master_save_reservation_v1'){
          const item={...reservation,id:'synthetic-new-booking',guest_name:args.p_guest_name,
            guest_phone:args.p_guest_phone,start_day:args.p_start_day,end_day:args.p_end_day};
          existing.push(item);
          calendar.push({day:args.p_start_day,status:'occupied'});
          return {data:[{id:item.id}],error:null};
        }
        if(name==='digiy_loc_set_unit_calendar_state_v2')
          return {data:null,error:{code:'P0001',message:'BOOKING_DATES_PROTECTED_USE_CANCELLATION'}};
        throw Error('Unexpected RPC '+name);
      }
    })};
  });
  await page.route('**/*',route=>{
    const url=route.request().url();
    if(url.startsWith('file:'))return route.continue();
    if(url.startsWith('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'))
      return route.fulfill({status:200,contentType:'application/javascript',body:'/* mock from addInitScript */'});
    return route.abort();
  });
});

test('V30 template shows private owner history and cancels only via controlled RPC',async({page})=>{
  await page.goto(uri('v30'),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#managerPanel')).toBeVisible();
  await expect(page.getByText('Client fictif de test').first()).toBeVisible();
  const cancel=page.getByRole('button',{name:/Annuler la réservation de Client fictif/});
  await expect(cancel).toBeVisible();
  await cancel.click();
  await expect(page.getByText('Annulée',{exact:true})).toBeVisible();
  await expect(page.getByRole('button',{name:/Annuler la réservation de/})).toHaveCount(0);
  const record=await page.evaluate(()=>({calls:window.__calls.map(x=>x.name),
    booking:window.__booking.status,confirmations:window.__confirmations,outbound:window.__outbound}));
  expect(record.calls).toContain('digiy_loc_master_cancel_reservation_v1');
  expect(record.booking).toBe('cancelled');
  expect(record.confirmations).toBe(1);
  expect(record.outbound).toEqual([]);
});

test('legacy backend lists owner records but does NOT expose cancellation',async({page})=>{
  await page.goto(uri('legacy'),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#managerPanel')).toBeVisible();
  await expect(page.getByText('Client fictif de test').first()).toBeVisible();
  await expect(page.getByRole('button',{name:/Annuler la réservation de/})).toHaveCount(0);
  const calls=await page.evaluate(()=>window.__calls.map(c=>c.name));
  expect(calls).toContain('digiy_loc_master_list_reservations_v1');
  expect(calls).not.toContain('digiy_loc_master_cancel_reservation_v1');
});

test('permission denial fails closed without a legacy fallback',async({page})=>{
  await page.goto(uri('denied'),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#managerPanel')).toBeVisible();
  await expect(page.getByRole('button',{name:/Annuler la réservation de/})).toHaveCount(0);
  const calls=await page.evaluate(()=>window.__calls.map(c=>c.name));
  expect(calls).not.toContain('digiy_loc_master_list_reservations_v1');
});

test('V30 owner private booking uses server RPC, never direct table mutation',async({page})=>{
  await page.goto(uri('v30'),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#managerPanel')).toBeVisible();
  const available=page.locator('#calendarGrid .day:not([disabled])').first();
  await expect(available).toBeVisible();
  await available.click();
  await page.locator('#guestName').fill('Nouveau client fictif');
  await page.locator('#guestPhone').fill('000-TEST-NEW');
  await page.getByRole('button',{name:/Enregistrer la réservation/}).click();
  await expect(page.getByText('Nouveau client fictif').first()).toBeVisible();
  const names=await page.evaluate(()=>window.__calls.map(c=>c.name));
  expect(names).toContain('digiy_loc_master_save_reservation_v1');
  expect(names).not.toContain('insert');
});
