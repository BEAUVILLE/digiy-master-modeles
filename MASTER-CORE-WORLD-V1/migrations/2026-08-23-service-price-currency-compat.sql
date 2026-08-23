-- DIGIYLYFE — compatibilité devise générique pour demandes de prestation
-- La colonne historique starting_price_xof reste conservée pour le Sénégal,
-- mais devient nullable afin que les pays non-XOF utilisent starting_price_amount + currency_code.

alter table public.digiy_service_requests
  alter column starting_price_xof drop not null;

comment on column public.digiy_service_requests.starting_price_xof is 'Compatibilité historique XOF. Null hors pays XOF ; utiliser starting_price_amount + currency_code comme contrat générique.';
