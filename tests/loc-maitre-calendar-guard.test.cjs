// LOC MAÎTRE current production-template calendar: isolated browser-script contract.
// Uses synthetic dates and test-only mocks, never an Auth session or real Supabase.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const html=fs.readFileSync(path.resolve(__dirname,'../LOC/MASTER-MAITRE-LOC/gestion.html'),'utf8');
const begin=html.indexOf('async function applyState(status){');
const end=html.indexOf('$("sendCode").onclick=sendCode;',begin);
assert.ok(begin>=0 && end>begin,'MAITRE owner calendar function and event binding must exist');
const unit=html.slice(begin,end);

function prepare({dates=['2026-11-11','2026-11-12'],unitId='synthetic-unit',reply,rows,readError,rpcThrows}={}){
  const journal={calls:[],read:[],messages:[],renders:0,resets:0,loads:0};
  const db={
    rpc:async (name,args)=>{
      journal.calls.push({name,args});
      if(rpcThrows)throw Error('SYNTHETIC_RPC_OFFLINE');
      return reply ?? {data:dates.map(day=>({day,status:'occupied'})),error:null};
    },
    from:table=>{
      if(table!=='digiy_loc_master_unit_calendar')throw Error('wrong table');
      return {
        select:columns=>({
          eq:(column,value)=>({
            in:async(field,days)=>{
              journal.read.push({table,columns,column,value,field,days});
              return {data:rows ?? dates.map(day=>({day,status:'occupied'})),error:readError??null};
            }
          })
        })
      };
    }
  };
  const scope={
    db,
    unitId,
    selectedDates:()=>dates,
    saveStatus:{},
    setMsg:(_target,message,failed)=>journal.messages.push({message,failed:!!failed}),
    loadStates:async()=>{journal.loads++},
    resetSelection:()=>{journal.resets++},
    render:()=>{journal.renders++}
  };
  vm.createContext(scope);
  vm.runInContext(unit+'\nthis.applyState=applyState;',scope,{timeout:1000});
  return {run:scope.applyState,journal};
}

test('No direct table mutations remain in MAITRE calendar',()=>{
  assert.match(unit,/db\.rpc\("digiy_loc_set_unit_calendar_state_v2"/);
  assert.doesNotMatch(unit,/\.delete\s*\(|\.upsert\s*\(|\.insert\s*\(|\.update\s*\(/);
  assert.doesNotMatch(unit,/service_role|serviceRole|SUPABASE_SERVICE|PULSE|NDIMBAL/i);
});
test('Protected owner RPC updates only after full reply and persisted re-read',async()=>{
  const {run,journal}=prepare();
  await run('occupied');
  assert.equal(journal.calls.length,1);
  assert.equal(journal.calls[0].name,'digiy_loc_set_unit_calendar_state_v2');
  assert.equal(journal.calls[0].args.p_unit_id,'synthetic-unit');
  assert.deepEqual(Array.from(journal.calls[0].args.p_days),['2026-11-11','2026-11-12']);
  assert.equal(journal.calls[0].args.p_status,'occupied');
  assert.equal(journal.read.length,1);
  assert.equal(journal.loads,1);
  assert.equal(journal.resets,1);
  assert.equal(journal.renders,1);
  assert.equal(journal.messages.at(-1).failed,false);
});
test('A reservation lock refusal must not silently open dates',async()=>{
  const {run,journal}=prepare({reply:{data:null,error:{message:'BOOKING_DATES_PROTECTED_USE_CANCELLATION'}}});
  await run('available');
  assert.equal(journal.calls.length,1);
  assert.equal(journal.read.length,0);
  assert.equal(journal.renders,0);
  assert.equal(journal.messages.at(-1).failed,true);
  assert.match(journal.messages.at(-1).message,/Dates réservées/);
});
test('A cross-owner denial is a hard stop, no privileged fallback',async()=>{
  const {run,journal}=prepare({reply:{data:null,error:{message:'not_authorized'}}});
  await run('closed');
  assert.equal(journal.read.length,0);
  assert.equal(journal.renders,0);
  assert.equal(journal.messages.at(-1).failed,true);
});
test('Incomplete RPC confirmation is never called success',async()=>{
  const {run,journal}=prepare({reply:{data:[{day:'2026-11-11',status:'occupied'}],error:null}});
  await run('occupied');
  assert.equal(journal.read.length,0);
  assert.equal(journal.renders,0);
  assert.equal(journal.messages.at(-1).failed,true);
});
test('Persisted calendar mismatch is never called success',async()=>{
  const {run,journal}=prepare({rows:[{day:'2026-11-11',status:'occupied'},{day:'2026-11-12',status:'closed'}]});
  await run('occupied');
  assert.equal(journal.read.length,1);
  assert.equal(journal.renders,0);
  assert.equal(journal.messages.at(-1).failed,true);
});
test('Available date is confirmed only if its row is removed',async()=>{
  const dates=['2026-11-11'];
  const {run,journal}=prepare({dates,reply:{data:[{day:'2026-11-11',status:'available'}],error:null},rows:[]});
  await run('available');
  assert.equal(journal.renders,1);
  assert.equal(journal.messages.at(-1).failed,false);
});
test('Unexpected persisted occupied row blocks available confirmation',async()=>{
  const dates=['2026-11-11'];
  const {run,journal}=prepare({dates,reply:{data:[{day:'2026-11-11',status:'available'}],error:null},rows:[{day:'2026-11-11',status:'occupied'}]});
  await run('available');
  assert.equal(journal.renders,0);
  assert.equal(journal.messages.at(-1).failed,true);
});
test('Network failure cannot lead to success or direct calendar mutation',async()=>{
  const {run,journal}=prepare({rpcThrows:true});
  await run('closed');
  assert.equal(journal.renders,0);
  assert.equal(journal.read.length,0);
  assert.equal(journal.messages.at(-1).failed,true);
});
test('No unit or selection refuses before any RPC',async()=>{
  const a=prepare({unitId:null});await a.run('occupied');
  assert.equal(a.journal.calls.length,0);
  const b=prepare({dates:[]});await b.run('closed');
  assert.equal(b.journal.calls.length,0);
});
