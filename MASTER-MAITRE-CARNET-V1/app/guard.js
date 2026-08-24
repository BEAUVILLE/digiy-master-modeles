// MASTER CARNET — garde OTP autour du rail PRO CARNET existant.
// Cette couche ne modifie ni l'interface ni la logique métier du cockpit.
(() => {
  "use strict";

  try { document.documentElement.style.visibility = "hidden"; } catch (_) {}

  const root = "../";
  const scripts = [
    root + "master-config.js",
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.3",
    root + "assets/carnet-contract.js",
    root + "assets/carnet-store.js"
  ];

  for (const src of scripts) {
    document.write('<script src="' + src + '"><\\/script>');
  }

  const show = () => {
    try { document.documentElement.style.visibility = ""; } catch (_) {}
  };

  const goDoor = () => {
    location.replace(root + "index.html");
  };

  async function verify() {
    const Store = window.DIGIY_CARNET_STORE;
    if (!Store) throw new Error("carnet_store_missing");
    const access = await Store.access();
    if (!access?.ok) throw new Error(access?.error || "carnet_access_denied");
    show();
    window.DIGIY_CARNET_GUARD = Object.freeze({ ok: true, access });
    return access;
  }

  verify().catch(() => goDoor());
})();
