-- DIGIYLYFE — préparation migration adhésion géographique V1
-- NE PAS exécuter automatiquement en production.
-- Objectif : permettre au dossier d'adhésion de stocker la géographie structurée
-- et les paramètres dérivés du pays sans détourner zone_label ou notes_internal.

alter table public.digiy_adhesion_requests
  add column if not exists country_id text,
  add column if not exists territory_id text,
  add column if not exists base_zone_id text,
  add column if not exists service_zone_ids text[] not null default '{}',
  add column if not exists service_territory_ids text[] not null default '{}',
  add column if not exists currency_code text,
  add column if not exists calling_code text,
  add column if not exists timezone text;

comment on column public.digiy_adhesion_requests.country_id is 'Identifiant pays canonique CORE, ex. SN ou FR.';
comment on column public.digiy_adhesion_requests.territory_id is 'Identifiant territoire canonique CORE.';
comment on column public.digiy_adhesion_requests.base_zone_id is 'Zone de base du professionnel. Ne doit pas être remplacée par sa couverture de service.';
comment on column public.digiy_adhesion_requests.service_zone_ids is 'Zones supplémentaires d’intervention explicitement choisies.';
comment on column public.digiy_adhesion_requests.service_territory_ids is 'Territoires supplémentaires d’intervention explicitement choisis.';
comment on column public.digiy_adhesion_requests.currency_code is 'Devise héritée de la configuration pays.';
comment on column public.digiy_adhesion_requests.calling_code is 'Indicatif téléphonique hérité de la configuration pays.';
comment on column public.digiy_adhesion_requests.timezone is 'Fuseau horaire hérité de la configuration pays.';
