window.DIGIY_CARNET_MASTER = Object.freeze({
  masterMode: true,
  version: "MASTER-MAITRE-CARNET-V1",

  identity: {
    memberSlug: "[MEMBER-SLUG]",
    displayName: "[NOM ADHERENT OU ACTIVITE]",
    country: "SN",
    locale: "fr-SN",
    currency: "XOF"
  },

  commercial: {
    enabled: false,
    singleMonthlyPriceXof: 19900,
    note: "Tarif dormant tant que la commercialisation n'est pas validée humainement."
  },

  auth: {
    mode: "otp",
    shouldCreateUser: false,
    supabaseUrl: "[SUPABASE_URL]",
    publishableKey: "[SUPABASE_PUBLISHABLE_KEY]",
    entitlement: "carnet",
    redirectPath: "./app/"
  },

  channels: [
    { id: "wave", label: "Wave", active: true },
    { id: "orange_money", label: "Orange Money", active: true },
    { id: "cash", label: "Espèces / Cash", active: true },
    { id: "bank", label: "Banque / Virement", active: true },
    { id: "card", label: "Carte", active: false },
    { id: "sendwave", label: "Sendwave", active: false },
    { id: "other", label: "Autre", active: true }
  ],

  metrics: {
    dailyIncome: true,
    dailyExpenses: true,
    dailyNet: true,
    dailySalesRevenue: true
  },

  voice: {
    enabled: true,
    language: "fr-FR",
    humanConfirmationRequired: true
  },

  data: {
    durableSource: "supabase",
    offlineLayer: "cache_queue_only",
    legacyTechnicalNamespace: "PAY",
    preventDuplicateSync: true
  },

  world8: ["fr", "en", "es", "pt", "it", "de", "nl", "ar"]
});
