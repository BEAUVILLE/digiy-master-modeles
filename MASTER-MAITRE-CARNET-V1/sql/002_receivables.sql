-- MASTER MAÎTRE CARNET V1
-- ÉCHÉANCIER TERRAIN — CLIENT DÛ / REMBOURSEMENTS.
-- IMPORTANT : fichier de MASTER uniquement. NE PAS exécuter en production sans revue + test.
-- Doctrine : une dette client n'est jamais de l'argent encaissé tant qu'un remboursement réel n'est pas confirmé.
-- Modèle volontairement simple : CLIENT -> SOMME DUE -> REMBOURSEMENTS SUCCESSIFS -> RESTE.
-- RÈGLE : chaque remboursement confirmé crée OBLIGATOIREMENT son mouvement CARNET dans la même opération.

begin;

create table if not exists public.digiy_carnet_receivables (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  member_slug text not null,
  client_label text not null,
  client_phone text,
  amount_due_xof bigint not null check (amount_due_xof > 0),
  amount_paid_xof bigint not null default 0 check (amount_paid_xof >= 0),
  currency_code text not null default 'XOF',
  debt_date date not null default current_date,
  due_date date,
  status text not null default 'open' check (status in ('open','partial','paid','cancelled')),
  note_text text,
  client_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (amount_paid_xof <= amount_due_xof)
);

create unique index if not exists digiy_carnet_receivables_owner_client_id_uidx
  on public.digiy_carnet_receivables(owner_id, client_id)
  where client_id is not null;

create index if not exists digiy_carnet_receivables_owner_slug_status_idx
  on public.digiy_carnet_receivables(owner_id, member_slug, status);

alter table public.digiy_carnet_receivables enable row level security;

revoke all on table public.digiy_carnet_receivables from anon;
grant select, insert, update on table public.digiy_carnet_receivables to authenticated;

create policy carnet_receivables_select_own
  on public.digiy_carnet_receivables
  for select
  to authenticated
  using ((select auth.uid()) = owner_id);

create policy carnet_receivables_insert_own
  on public.digiy_carnet_receivables
  for insert
  to authenticated
  with check ((select auth.uid()) = owner_id);

create policy carnet_receivables_update_own
  on public.digiy_carnet_receivables
  for update
  to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

-- Pas de DELETE utilisateur en V1 : on annule pour garder la mémoire de l'échéancier.

create table if not exists public.digiy_carnet_receivable_payments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  receivable_id uuid not null references public.digiy_carnet_receivables(id) on delete restrict,
  amount_xof bigint not null check (amount_xof > 0),
  channel text not null check (channel in ('wave','orange_money','cash','bank','card','sendwave','other')),
  movement_id uuid not null,
  client_id text not null,
  paid_at timestamptz not null default now(),
  note_text text,
  created_at timestamptz not null default now()
);

create unique index if not exists digiy_carnet_receivable_payments_owner_client_id_uidx
  on public.digiy_carnet_receivable_payments(owner_id, client_id);

create unique index if not exists digiy_carnet_receivable_payments_movement_uidx
  on public.digiy_carnet_receivable_payments(owner_id, movement_id);

create index if not exists digiy_carnet_receivable_payments_receivable_idx
  on public.digiy_carnet_receivable_payments(receivable_id, paid_at desc);

alter table public.digiy_carnet_receivable_payments enable row level security;

revoke all on table public.digiy_carnet_receivable_payments from anon;
grant select on table public.digiy_carnet_receivable_payments to authenticated;

create policy carnet_receivable_payments_select_own
  on public.digiy_carnet_receivable_payments
  for select
  to authenticated
  using ((select auth.uid()) = owner_id);

-- IMPORTANT : pas d'INSERT direct accordé à authenticated.
-- Un remboursement doit obligatoirement passer par digiy_carnet_record_receivable_payment()
-- afin que l'échéancier ET le mouvement CARNET soient créés ensemble.

-- Recalcule l'échéancier après chaque remboursement.
create or replace function public.digiy_carnet_recompute_receivable(p_receivable_id uuid)
returns jsonb
language plpgsql
security invoker
set search_path = public, pg_temp
as $function$
declare
  v_uid uuid := auth.uid();
  v_due bigint;
  v_paid bigint;
  v_status text;
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'error', 'auth_required');
  end if;

  select r.amount_due_xof
  into v_due
  from public.digiy_carnet_receivables r
  where r.id = p_receivable_id
    and r.owner_id = v_uid;

  if v_due is null then
    return jsonb_build_object('ok', false, 'error', 'receivable_not_found');
  end if;

  select coalesce(sum(p.amount_xof),0)
  into v_paid
  from public.digiy_carnet_receivable_payments p
  where p.receivable_id = p_receivable_id
    and p.owner_id = v_uid;

  if v_paid <= 0 then v_status := 'open';
  elsif v_paid < v_due then v_status := 'partial';
  else v_status := 'paid';
  end if;

  update public.digiy_carnet_receivables
  set amount_paid_xof = least(v_paid, v_due),
      status = v_status,
      updated_at = now()
  where id = p_receivable_id
    and owner_id = v_uid;

  return jsonb_build_object(
    'ok', true,
    'amount_due_xof', v_due,
    'amount_paid_xof', least(v_paid, v_due),
    'remaining_xof', greatest(v_due - v_paid, 0),
    'status', v_status
  );
end;
$function$;

revoke all on function public.digiy_carnet_recompute_receivable(uuid) from public;
revoke all on function public.digiy_carnet_recompute_receivable(uuid) from anon;
grant execute on function public.digiy_carnet_recompute_receivable(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- ENREGISTRER UN REMBOURSEMENT CLIENT DÛ
-- Une seule validation humaine -> une seule transaction atomique :
-- 1) contrôle du reste dû ;
-- 2) mouvement CARNET direction=in / kind=sale ;
-- 3) ligne de remboursement ;
-- 4) nouveau reste et statut.
-- Si une étape échoue, aucune des deux traces ne doit survivre.
-- ---------------------------------------------------------------------------
create or replace function public.digiy_carnet_record_receivable_payment(
  p_receivable_id uuid,
  p_amount_xof bigint,
  p_channel text,
  p_client_id text,
  p_paid_at timestamptz default now(),
  p_note_text text default null
)
returns jsonb
language plpgsql
security invoker
set search_path = public, pg_temp
as $function$
declare
  v_uid uuid := auth.uid();
  v_receivable public.digiy_carnet_receivables%rowtype;
  v_remaining bigint;
  v_existing public.digiy_carnet_receivable_payments%rowtype;
  v_channel text := lower(trim(coalesce(p_channel,'')));
  v_legacy_channel text;
  v_movement jsonb;
  v_movement_id uuid;
  v_payment_id uuid;
  v_summary jsonb;
  v_payload jsonb;
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'error', 'auth_required');
  end if;

  if p_amount_xof is null or p_amount_xof <= 0 then
    return jsonb_build_object('ok', false, 'error', 'bad_amount');
  end if;

  if coalesce(trim(p_client_id),'') = '' then
    return jsonb_build_object('ok', false, 'error', 'client_id_required');
  end if;

  if v_channel not in ('wave','orange_money','cash','bank','card','sendwave','other') then
    return jsonb_build_object('ok', false, 'error', 'bad_channel');
  end if;

  -- Idempotence : un double appui avec le même client_id renvoie la trace existante.
  select p.*
  into v_existing
  from public.digiy_carnet_receivable_payments p
  where p.owner_id = v_uid
    and p.client_id = p_client_id
  limit 1;

  if found then
    return jsonb_build_object(
      'ok', true,
      'idempotent', true,
      'payment_id', v_existing.id,
      'movement_id', v_existing.movement_id,
      'receivable_id', v_existing.receivable_id
    );
  end if;

  select r.*
  into v_receivable
  from public.digiy_carnet_receivables r
  where r.id = p_receivable_id
    and r.owner_id = v_uid
    and r.status in ('open','partial')
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'receivable_not_found_or_closed');
  end if;

  v_remaining := v_receivable.amount_due_xof - v_receivable.amount_paid_xof;

  if p_amount_xof > v_remaining then
    return jsonb_build_object(
      'ok', false,
      'error', 'amount_exceeds_remaining',
      'remaining_xof', v_remaining
    );
  end if;

  -- Compatibilité temporaire avec le moteur PAY historique.
  -- Les canaux que le legacy ne sait pas transporter restent lisibles dans meta.carnet_channel.
  if v_channel in ('wave','cash','bank') then
    v_legacy_channel := v_channel;
  else
    v_legacy_channel := 'other';
  end if;

  v_payload := jsonb_build_object(
    'direction', 'in',
    'scope', 'pro',
    'kind', 'sale',
    'category', 'client_du',
    'channel', v_legacy_channel,
    'amount_xof', p_amount_xof,
    'label', 'Remboursement client dû · ' || v_receivable.client_label,
    'note_text', nullif(trim(coalesce(p_note_text,'')),''),
    'source_module', 'CARNET_DEBT',
    'source_id', p_client_id,
    'origin', 'manual',
    'movement_date', coalesce(p_paid_at, now())::date,
    'meta', jsonb_build_object(
      'carnet_contract', 'v1',
      'carnet_channel', v_channel,
      'receivable_id', v_receivable.id,
      'client_label', v_receivable.client_label,
      'event', 'client_due_repayment'
    )
  );

  -- Ce mouvement est une vraie entrée encaissée et compte dans Entrées / Net / CA du jour.
  v_movement := public.digiy_carnet_insert_movement(v_receivable.member_slug, v_payload);

  if coalesce((v_movement->>'ok')::boolean, false) is not true then
    return jsonb_build_object(
      'ok', false,
      'error', 'movement_not_recorded',
      'movement_error', v_movement
    );
  end if;

  v_movement_id := nullif(v_movement->>'id','')::uuid;

  if v_movement_id is null then
    raise exception 'CARNET movement returned no id';
  end if;

  insert into public.digiy_carnet_receivable_payments (
    owner_id,
    receivable_id,
    amount_xof,
    channel,
    movement_id,
    client_id,
    paid_at,
    note_text
  )
  values (
    v_uid,
    v_receivable.id,
    p_amount_xof,
    v_channel,
    v_movement_id,
    p_client_id,
    coalesce(p_paid_at, now()),
    nullif(trim(coalesce(p_note_text,'')),'')
  )
  returning id into v_payment_id;

  v_summary := public.digiy_carnet_recompute_receivable(v_receivable.id);

  return jsonb_build_object(
    'ok', true,
    'payment_id', v_payment_id,
    'movement_id', v_movement_id,
    'receivable_id', v_receivable.id,
    'client_label', v_receivable.client_label,
    'amount_received_xof', p_amount_xof,
    'channel', v_channel,
    'amount_due_xof', v_summary->'amount_due_xof',
    'amount_paid_xof', v_summary->'amount_paid_xof',
    'remaining_xof', v_summary->'remaining_xof',
    'status', v_summary->'status'
  );
end;
$function$;

revoke all on function public.digiy_carnet_record_receivable_payment(uuid,bigint,text,text,timestamptz,text) from public;
revoke all on function public.digiy_carnet_record_receivable_payment(uuid,bigint,text,text,timestamptz,text) from anon;
grant execute on function public.digiy_carnet_record_receivable_payment(uuid,bigint,text,text,timestamptz,text) to authenticated;

commit;

-- AFFICHAGE TERRAIN CIBLE :
-- CLIENT DÛ : Mamadou
-- SOMME INITIALE : 50 000 F
-- 05/09 : +10 000 F remboursés · Wave
-- 12/09 : +15 000 F remboursés · Espèces
-- RESTE : 25 000 F
-- STATUT : PARTIEL
--
-- À CHAQUE REMBOURSEMENT CONFIRMÉ :
-- - la ligne apparaît dans l'échéancier ;
-- - la même somme entre dans CARNET ;
-- - Entrées jour augmente ;
-- - Net jour augmente ;
-- - le canal reçu augmente ;
-- - CA jour augmente (logique CA encaissé) ;
-- - le reste dû diminue.
--
-- TESTS AVANT DÉPLOIEMENT :
-- 1. anon : zéro lecture/écriture ;
-- 2. utilisateur A ne voit jamais les échéanciers de B ;
-- 3. création dette : aucun mouvement financier créé ;
-- 4. remboursement 10 000 -> exactement 1 paiement + exactement 1 mouvement +10 000 ;
-- 5. plusieurs remboursements successifs -> reste correct ;
-- 6. paiement total -> statut paid ;
-- 7. double appui même client_id -> aucune double entrée ;
-- 8. montant supérieur au reste -> refus ;
-- 9. Orange Money -> mouvement legacy other + meta.carnet_channel=orange_money ;
-- 10. CA / Entrées / Net lisent le mouvement encaissé, jamais directement la dette.
