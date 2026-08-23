(() => {
  "use strict";

  const Store = window.DIGIY_CARNET_STORE;
  const C = window.DIGIY_CARNET_MASTER || {};
  if(!Store) throw new Error("DIGIY_CARNET_STORE manquant");

  async function user(){ return Store.requireUser(); }

  async function list(){
    const u = await user();
    const db = Store.client();
    const {data,error} = await db
      .from("digiy_carnet_receivables")
      .select("id,member_slug,client_label,client_phone,amount_due_xof,amount_paid_xof,currency_code,debt_date,due_date,status,note_text,created_at,updated_at")
      .eq("owner_id",u.id)
      .eq("member_slug",C.identity.memberSlug)
      .neq("status","cancelled")
      .order("created_at",{ascending:false});
    if(error) throw error;
    return Array.isArray(data) ? data : [];
  }

  async function create(input){
    const u = await user();
    await Store.access();
    const label = String(input?.client_label || "").trim();
    const amount = Math.round(Number(input?.amount_due_xof || 0));
    if(!label) throw new Error("client_name_required");
    if(!(amount > 0)) throw new Error("bad_amount");

    const clientId = globalThis.crypto?.randomUUID ? crypto.randomUUID() : "d_"+Date.now().toString(36)+Math.random().toString(36).slice(2,10);
    const payload = {
      owner_id:u.id,
      member_slug:C.identity.memberSlug,
      client_label:label,
      client_phone:String(input?.client_phone || "").trim() || null,
      amount_due_xof:amount,
      amount_paid_xof:0,
      currency_code:C.identity?.currency || "XOF",
      debt_date:input?.debt_date || new Date().toISOString().slice(0,10),
      due_date:input?.due_date || null,
      note_text:String(input?.note_text || "").trim() || null,
      client_id:clientId,
      status:"open"
    };

    const {data,error} = await Store.client()
      .from("digiy_carnet_receivables")
      .insert(payload)
      .select("*")
      .single();
    if(error) throw error;
    return data;
  }

  async function payments(receivableId){
    const u = await user();
    const {data,error} = await Store.client()
      .from("digiy_carnet_receivable_payments")
      .select("id,receivable_id,amount_xof,channel,movement_id,paid_at,note_text,created_at")
      .eq("owner_id",u.id)
      .eq("receivable_id",receivableId)
      .order("paid_at",{ascending:true});
    if(error) throw error;
    return Array.isArray(data) ? data : [];
  }

  async function recordPayment(receivableId,input){
    await Store.access();
    const amount = Math.round(Number(input?.amount_xof || 0));
    const channel = String(input?.channel || "").trim();
    if(!(amount > 0)) throw new Error("bad_amount");
    if(!channel) throw new Error("channel_required");
    const clientId = globalThis.crypto?.randomUUID ? crypto.randomUUID() : "rp_"+Date.now().toString(36)+Math.random().toString(36).slice(2,10);

    const {data,error} = await Store.client().rpc("digiy_carnet_record_receivable_payment",{
      p_receivable_id:receivableId,
      p_amount_xof:amount,
      p_channel:channel,
      p_client_id:clientId,
      p_paid_at:input?.paid_at || new Date().toISOString(),
      p_note_text:String(input?.note_text || "").trim() || null
    });
    if(error) throw error;
    if(!data?.ok) throw new Error(data?.error || "receivable_payment_failed");
    return data;
  }

  async function cancel(receivableId){
    const u = await user();
    const {data,error} = await Store.client()
      .from("digiy_carnet_receivables")
      .update({status:"cancelled",updated_at:new Date().toISOString()})
      .eq("owner_id",u.id)
      .eq("member_slug",C.identity.memberSlug)
      .eq("id",receivableId)
      .select("id")
      .single();
    if(error) throw error;
    return data;
  }

  window.DIGIY_CARNET_DEBTS = Object.freeze({list,create,payments,recordPayment,cancel});
})();
