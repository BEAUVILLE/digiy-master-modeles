// MASTER CARNET — adaptateur de session pour les rails historiques PRO CARNET.
// L'autorité d'accès reste app/guard.js + Supabase Auth + droit CARNET.
(() => {
  "use strict";

  function loadGuard() {
    if (window.DIGIY_CARNET_GUARD || document.querySelector('script[data-master-carnet-guard]')) return;
    const script = document.createElement("script");
    script.src = "./guard.js?v=master-otp-rail-v1";
    script.async = false;
    script.dataset.masterCarnetGuard = "1";
    document.head.appendChild(script);
  }

  function accessSnapshot() {
    const access = window.DIGIY_CARNET_GUARD?.access;
    if (!access?.ok) return null;
    return {
      module: "CARNET",
      slug: access.slug || window.DIGIY_CARNET_MASTER?.identity?.memberSlug || "",
      access: true,
      access_ok: true,
      authenticated: true
    };
  }

  function cleanVisibleUrl() {
    try {
      const url = new URL(location.href);
      ["token","code","otp","email","phone","pin","slug","access_token","refresh_token"].forEach(k => url.searchParams.delete(k));
      history.replaceState({}, document.title, url.pathname + url.search + url.hash);
    } catch (_) {}
  }

  async function requireSession() {
    for (let i = 0; i < 120; i += 1) {
      const session = accessSnapshot();
      if (session) return session;
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    location.replace("../index.html");
    return null;
  }

  async function logout(redirect = true) {
    try { await window.DIGIY_CARNET_STORE?.client?.().auth.signOut(); } catch (_) {}
    if (redirect !== false) location.replace("../index.html");
  }

  window.DIGIY_SESSION = Object.freeze({
    version: "master-carnet-otp-session-adapter-v1",
    module: "CARNET",
    get: accessSnapshot,
    getSession: accessSnapshot,
    boot: requireSession,
    require: requireSession,
    cleanVisibleUrl,
    clear: () => logout(false),
    logout
  });

  cleanVisibleUrl();
  loadGuard();
  requireSession();
})();
