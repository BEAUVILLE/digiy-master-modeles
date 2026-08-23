-- DIGIYLYFE — migration tarification pays générique V1
-- Validée pour permettre au formulaire d'adhésion de stocker un montant dans la devise du pays
-- tout en conservant les anciennes colonnes XOF/EUR pour compatibilité.

alter table public.digiy_adhesion_requests
  add column if not exists price_amount numeric;

comment on column public.digiy_adhesion_requests.price_amount is 'Montant d’adhésion dans currency_code, dérivé de la configuration pays.';

alter table public.digiy_service_requests
  add column if not exists starting_price_amount numeric,
  add column if not exists currency_code text;

comment on column public.digiy_service_requests.starting_price_amount is 'Tarif de départ dans currency_code, dérivé de la configuration pays.';
comment on column public.digiy_service_requests.currency_code is 'Devise du tarif de départ, héritée du pays du dossier d’adhésion.';
