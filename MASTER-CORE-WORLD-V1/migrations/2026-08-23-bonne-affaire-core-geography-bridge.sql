-- DIGIYLYFE · BONNE AFFAIRE → CORE WORLD
-- Migration appliquée en production le 2026-08-23 sur le projet Supabase wesqmwjjtsefyjnluosj.
-- But : conserver les champs historiques pays/zone/ville tout en ajoutant le raccord structuré CORE.

alter table public.digiy_bonne_affaire_annonces
  add column if not exists territory_id text,
  add column if not exists base_zone_id text,
  add column if not exists geography_status text,
  add column if not exists pending_locality_label text;

update public.digiy_bonne_affaire_annonces
set geography_status = 'legacy'
where geography_status is null;

alter table public.digiy_bonne_affaire_annonces
  alter column geography_status set default 'pending_validation',
  alter column geography_status set not null;

alter table public.digiy_bonne_affaire_annonces
  drop constraint if exists digiy_ba_geography_status_check;

alter table public.digiy_bonne_affaire_annonces
  add constraint digiy_ba_geography_status_check
  check (geography_status = any (array['validated'::text,'pending_validation'::text,'legacy'::text]));

create index if not exists digiy_ba_core_geography_idx
  on public.digiy_bonne_affaire_annonces(country_id, territory_id, base_zone_id, statut);

-- Règle runtime :
-- country_id est déjà porté par BONNE AFFAIRE.
-- territory_id et base_zone_id sont résolus côté Edge Function contre le runtime CORE public.
-- Une zone active reconnue devient geography_status='validated'.
-- Une localité inconnue/planned reste geography_status='pending_validation' et n'est jamais créée automatiquement.
-- Les lignes antérieures à ce pont restent geography_status='legacy' sans réécriture destructive.
