(() => {
  "use strict";

  const C = window.DIGIY_CARNET_MASTER || {};
  const Contract = window.DIGIY_CARNET_CONTRACT;
  if(!Contract) throw new Error("DIGIY_CARNET_CONTRACT manquant");

  let db = null;

  function configured(){
    const a = C.auth || {}, i = C.identity || {};
    return /^https:\/\/.+\.supabase\.co$/i.test(String(a.supabaseUrl || "")) &&
      !!a.publishableKey && !String(a.publishableKey).startsWith("[") &&
      !!i.memberSlug && !String(i.memberSlug).startsWith("[");
  }

  function client(){
    if(db) return db;
    if(!configured()) throw new Error("carnet_master_not_configured");
    if(!window.supabase?.createClient) throw new Error("supabase_js_missing");
    db = window.supabase.createClient(C.auth.supabaseUrl, C.auth.publishableKey, {
      auth:{persistSession:true,detectSessionInUrl:true,autoRefreshToken:true}
    });
    return db;
  }

  async function requireUser(){
    const {data,error} = await client().auth.getUser();
    if(error) throw error;
    if(!data?.user) throw new Error("auth_required");
    return data.user;
  }

  async function access(){
    await requireUser();
    const {data,error} = await client().rpc("digiy_carnet_my_access", {
      p_slug:C.identity.memberSlug
    });
    if(error) throw error;
    if(!data?.ok) throw new Error(data?.error || "carnet_access_denied");
    return data;
  }

  async function listMovements(limit = 100){
    await access();
    const {data,error} = await client().rpc("digiy_carnet_list_movements", {
      p_slug:C.identity.memberSlug,
      p_limit:Math.max(1,Math.min(Number(limit)||100,100))
    });
    if(error) throw error;
    if(!data?.ok) throw new Error(data?.error || "carnet_list_failed");
    return (Array.isArray(data.items) ? data.items : []).map(Contract.fromLegacy);
  }

  async function insertMovement(input){
    await access();
    const movement = Contract.canonicalMovement(Object.assign({}, input, {
      member_slug:C.identity.memberSlug,
      status:"posted"
    }));
    const validation = Contract.validateConfirmed(movement);
    if(!validation.ok) throw new Error("carnet_invalid:" + validation.errors.join(","));

    // IMPORTANT : l’appel est fait uniquement après validation humaine par l’UI.
    const payload = Contract.toLegacyPayload(movement);
    const {data,error} = await client().rpc("digiy_carnet_insert_movement", {
      p_slug:C.identity.memberSlug,
      p_payload:payload
    });
    if(error) throw error;
    if(!data?.ok) throw new Error(data?.error || "carnet_insert_failed");
    return Object.assign({}, movement, {id:data.id || movement.id, status:"posted"});
  }

  async function deleteMovement(id){
    if(!id) throw new Error("movement_id_missing");
    await access();
    const {data,error} = await client().rpc("digiy_carnet_delete_movement", {
      p_slug:C.identity.memberSlug,
      p_id:id
    });
    if(error) throw error;
    if(!data?.ok) throw new Error(data?.error || "carnet_delete_failed");
    return true;
  }

  async function daySummary(date = new Date()){
    const rows = await listMovements(100);
    // Les lignes sont déjà canoniques : on recalcule ici pour éviter que le vieux
    // résumé PAY confonde toutes les entrées avec le CA.
    const day = new Date(date).toDateString();
    const out = {
      salesRevenue:0,
      income:0,
      expenses:0,
      net:0,
      receivableOpen:0,
      byChannel:{}
    };
    Object.keys(Contract.channels).forEach(k => out.byChannel[k] = {in:0,out:0});
    rows.forEach(m => {
      if(m.status !== "posted") return;
      if(new Date(m.occurred_at).toDateString() !== day) return;
      if(m.direction === "in"){
        out.income += m.amount;
        if(m.kind === "sale" && m.scope === "activity") out.salesRevenue += m.amount;
      }else{
        out.expenses += m.amount;
      }
      if(!out.byChannel[m.channel]) out.byChannel[m.channel] = {in:0,out:0};
      out.byChannel[m.channel][m.direction] += m.amount;
    });
    out.net = out.income - out.expenses;
    return out;
  }

  function queueKey(){
    return "DIGIY_CARNET_QUEUE_V1:" + String(C.identity?.memberSlug || "master");
  }

  function readQueue(){
    try{
      const parsed = JSON.parse(localStorage.getItem(queueKey()) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    }catch(_){ return []; }
  }

  function queueDraft(input){
    const movement = Contract.canonicalMovement(Object.assign({}, input, {
      member_slug:C.identity?.memberSlug || "",
      status:"queued",
      origin:"offline_sync"
    }));
    const validation = Contract.validateConfirmed(movement);
    if(!validation.ok) throw new Error("carnet_invalid:" + validation.errors.join(","));
    const q = readQueue();
    if(!q.some(x => x.client_id === movement.client_id)) q.push(movement);
    localStorage.setItem(queueKey(), JSON.stringify(q.slice(-200)));
    return movement;
  }

  function queued(){ return readQueue(); }

  async function syncQueued(){
    // DÉLIBÉRÉMENT BLOQUÉ en V1 atelier : la file existe, mais l’envoi automatique
    // attend une garantie d’idempotence serveur testée. On refuse de risquer un
    // double encaissement dans l’historique.
    throw new Error("offline_sync_not_enabled_until_server_idempotence_is_verified");
  }

  window.DIGIY_CARNET_STORE = Object.freeze({
    configured,
    client,
    requireUser,
    access,
    listMovements,
    insertMovement,
    deleteMovement,
    daySummary,
    queueDraft,
    queued,
    syncQueued
  });
})();
