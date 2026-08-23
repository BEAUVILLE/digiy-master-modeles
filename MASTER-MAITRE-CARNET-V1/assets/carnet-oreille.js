(() => {
  "use strict";

  const Contract = window.DIGIY_CARNET_CONTRACT;
  const C = window.DIGIY_CARNET_MASTER || {};
  if(!Contract) throw new Error("DIGIY_CARNET_CONTRACT manquant");

  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;

  function clean(value){
    return String(value || "")
      .replace(/\s+/g," ")
      .replace(/\s+([,.!?;:])/g,"$1")
      .trim();
  }

  function lower(value){
    return clean(value).toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  }

  function extractAmount(text){
    const raw = clean(text);
    const match = raw.match(/(?:^|\s)(\d[\d\s.,]*)(?:\s*(?:fcfa|f\s*cfa|xof|cfa|francs?))?(?=\s|$)/i);
    if(!match) return 0;
    const normalized = String(match[1] || "")
      .replace(/\s/g,"")
      .replace(/\.(?=\d{3}(?:\D|$))/g,"")
      .replace(",",".");
    const amount = Math.round(Number(normalized));
    return Number.isFinite(amount) && amount > 0 ? amount : 0;
  }

  function extractChannel(text){
    const t = lower(text);
    if(/\bwave\b|\bwav\b/.test(t)) return "wave";
    if(/orange money|\bom\b/.test(t)) return "orange_money";
    if(/espece|cash|liquide/.test(t)) return "cash";
    if(/sendwave/.test(t)) return "sendwave";
    if(/carte|\bcb\b/.test(t)) return "card";
    if(/virement|banque/.test(t)) return "bank";
    return "other";
  }

  function detectDirection(text){
    const t = lower(text);
    if(/depense|sortie|gasoil|essence|carburant|achat|fournisseur|loyer|transport|charge|facture|electricite|senelec|eau|sen.?eau/.test(t)) return "out";
    return "in";
  }

  function removeKnownTokens(text, amount){
    let out = clean(text);
    if(amount){
      const parts = String(amount).split("");
      const spaced = parts.join("\\s*");
      out = out.replace(new RegExp(spaced,"i")," ");
    }
    out = out
      .replace(/\b(?:wave|wav|orange money|om|cash|esp[eè]ces?|liquide|sendwave|carte|cb|virement|banque)\b/ig," ")
      .replace(/\b(?:fcfa|f\s*cfa|xof|cfa|francs?)\b/ig," ")
      .replace(/\b(?:entree|entrée|vente|recette|encaissement|depense|dépense|sortie)\b/ig," ")
      .replace(/\s+/g," ")
      .replace(/^[,.;:\-–—\s]+|[,.;:\-–—\s]+$/g,"")
      .trim();
    return out;
  }

  function parse(text){
    const raw = clean(text);
    const amount = extractAmount(raw);
    const channel = extractChannel(raw);
    const direction = detectDirection(raw);
    const label = removeKnownTokens(raw, amount) || (direction === "out" ? "Dépense" : "Vente");

    return Contract.canonicalMovement({
      member_slug:C.identity?.memberSlug || "",
      scope:"activity",
      direction,
      kind:direction === "out" ? "expense" : "sale",
      category:direction === "out" ? "depense" : "vente",
      channel,
      amount,
      currency:C.identity?.currency || "XOF",
      label,
      note:raw,
      origin:"voice",
      status:"draft",
      meta:{voice_text:raw}
    });
  }

  function readiness(draft){
    const missing = [];
    if(!(draft?.amount > 0)) missing.push("montant");
    if(!draft?.channel || draft.channel === "other") missing.push("mode de paiement");
    if(!draft?.label) missing.push("motif");
    return {ok:missing.length===0,missing};
  }

  function supported(){ return !!Recognition; }

  function listen(options = {}){
    return new Promise((resolve,reject) => {
      if(!Recognition){reject(new Error("speech_recognition_unavailable"));return;}
      const r = new Recognition();
      r.lang = options.lang || "fr-FR";
      r.interimResults = false;
      r.continuous = false;
      r.maxAlternatives = 1;
      let settled = false;

      r.onerror = ev => {
        if(settled) return;
        settled = true;
        reject(new Error(ev?.error || "speech_recognition_error"));
      };
      r.onresult = ev => {
        if(settled) return;
        settled = true;
        const text = ev?.results?.[0]?.[0]?.transcript || "";
        resolve({text:clean(text),draft:parse(text)});
      };
      r.onend = () => {
        if(!settled){settled=true;reject(new Error("speech_recognition_no_result"));}
      };
      try{r.start();}catch(err){reject(err);}
    });
  }

  window.DIGIY_CARNET_OREILLE = Object.freeze({
    supported,
    parse,
    readiness,
    listen
  });
})();
