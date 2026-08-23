-- MASTER MAÎTRE CARNET V1
-- ÉCHÉANCIER TERRAIN — CLIENT DÛ / REMBOURSEMENTS.
-- IMPORTANT : fichier de MASTER uniquement. NE PAS exécuter en production sans revue + test.
-- Doctrine : une dette client n'est jamais de l'argent encaissé tant qu'un remboursement réel n'est pas confirmé.
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
  client_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (amount_paid_xof <= amount_due_xof)
);

create unique index if not exists digiy_carnet_receivables_owner_client_id_uidx
  on public.digiy_carnet_receivables(owner_id, client_id);

create index if not exists digiy_carnet_receivables_owner_slug_status_idx
  on public.digiy_carnet_receivables(owner_id, member_slug, status);

alter table public.digiy_carnet_receivables enable row level security;

-- Lecture directe autorisée uniquement sur ses propres lignes.
-- INSERT / UPDATE directs interdits : création, annulation et remboursements passent
-- par des RPC contrôlés afin d'empêcher toute falsification de amount_paid/status.
revoke all on table public.digiy_carnet_receivables from anon;
revoke all on table public.digiy_carnet_receivables from authenticated;
grant select on table public.digiy_carnet_receivables to authenticated;

create policy carnet_receivables_select_own
  on public.digiy_carnet_receivables
  for select
  to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = owner_id);

create table if not exists public.digiy_carnet_receivable_payments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  receivable_id uuid not null references public.digiy_carnet_receivables(id) on delete restrict,
  amount_xof bigint not null check (amount_xof > 0),
  channel text not null check (channel in ('wave','orange_money','cash','bank','card','sendwave','other')),
  movement_id uuid not null references public.digiy_pay_movements(id) on delete restrict,
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
revoke all on table public.digiy_carnet_receivable_payments from authenticated;
grant select on table public.digiy_carnet_receivable_payments to authenticated;

create policy carnet_receivable_payments_select_own
  on public.digiy_carnet_receivable_payments
  for select
  to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = owner_id);

-- ---------------------------------------------------------------------------
-- CRÉER UN CLIENT DÛ
-- Pas d'INSERT direct depuis le navigateur. Le RPC fixe owner_id, vérifie le
-- droit CARNET et garantit l'idempotence par client_id.
-- ---------------------------------------------------------------------------
create or replace function public.digiy_carnet_create_receivable(
  p_member_slug text,
  p_client_label text,
  p_amount_xof bigint,
  p_client_phone text default null,
  p_due_date date default null,
  p_note_text text default null,
  p_client_id text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_access jsonb;
  v_slug text;
  v_client_id text := nullif(trim(coalesce(p_client_id,'')), '');
  v_existing_id uuid;
  v_id uuid;
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'error', 'auth_required');
  end if;
  if coalesce(trim(p_client_label),'') = '' then
    return jsonb_build_object('ok', false, 'error', 'client_name_required');
  end if;
  if p_amount_xof is null or p_amount_xof <= 0 then
    return jsonb_build_object('ok', false, 'error', 'bad_amount');
  end if;
  if v_client_id is null then
    return jsonb_build_object('ok', false, 'error', 'client_id_required');
  end if;

  v_access := public.digiy_carnet_my_access(p_member_slug);
  if coalesce((v_access->>'ok')::boolean, false) is not true then
    return v_access;
  end if;
  v_slug := v_access->>'slug';

  select r.id
  into v_existing_id
  from public.digiy_carnet_receivables r
  where r.owner_id = v_uid and r.client_id = v_client_id
  limit 1;

  if v_existing_id is not null then
    return jsonb_build_object('ok', true, 'id', v_existing_id, 'idempotent', true);
  end if;

  begin
    insert into public.digiy_carnet_receivables (
      owner_id, member_slug, client_label, client_phone,
      amount_due_xof, amount_paid_xof, currency_code,
      debt_date, due_date, status, note_text, client_id
    ) values (
      v_uid, v_slug, trim(p_client_label), nullif(trim(coalesce(p_client_phone,'')),''),
      p_amount_xof, 0, 'XOF', current_date, p_due_date, 'open',
      nullif(trim(coalesce(p_note_text,'')),''), v_client_id
    ) returning id into v_id;
  exception when unique_violation then
    select r.id into v_id
    from public.digiy_carnet_receivables r
    where r.owner_id = v_uid and r.client_id = v_client_id
    limit 1;
    if v_id is null then raise; end if;
    return jsonb_build_object('ok', true, 'id', v_id, 'idempotent', true);
  end;

  return jsonb_build_object('ok', true, 'id', v_id, 'idempotent', false);
end;
$function$;

revoke all on function public.digiy_carnet_create_receivable(text,text,bigint,text,date,text,text) from public;
revoke all on function public.digiy_carnet_create_receivable(text,text,bigint,text,date,text,text) from anon;
revoke all on function public.digiy_carnet_create_receivable(text,text,bigint,text,date,text,text) from authenticated;
grant execute on function public.digiy_carnet_create_receivable(text,text,bigint,text,date,text,text) to authenticated;

-- ---------------------------------------------------------------------------
-- ANNULER UN CLIENT DÛ
-- Pas de DELETE en V1 : l'historique reste visible en base.
-- ---------------------------------------------------------------------------
create or replace function public.digiy_carnet_cancel_receivable(p_receivable_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_row public.digiy_carnet_receivables%rowtype;
  v_access jsonb;
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'error', 'auth_required');
  end if;

  select r.* into v_row
  from public.digiy_carnet_receivables r
  where r.id = p_receivable_id and r.owner_id = v_uid
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'receivable_not_found');
  end if;

  v_access := public.digiy_carnet_my_access(v_row.member_slug);
  if coalesce((v_access->>'ok')::boolean, false) is not true then
    return v_access;
  end if;

  if v_row.status = 'paid' then
    return jsonb_build_object('ok', false, 'error', 'paid_receivable_cannot_be_cancelled');
  end if;

  update public.digiy_carnet_receivables
  set status='cancelled', updated_at=now()
  where id=p_receivable_id and owner_id=v_uid;

  return jsonb_build_object('ok', true, 'id', p_receivable_id, 'status', 'cancelled');
end;
$function$;

revoke all on function public.digiy_carnet_cancel_receivable(uuid) from public;
revoke all on function public.digiy_carnet_cancel_receivable(uuid) from anon;
revoke all on function public.digiy_carnet_cancel_receivable(uuid) from authenticated;
grant execute on function public.digiy_carnet_cancel_receivable(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- RECALCUL INTERNE
-- SECURITY DEFINER nécessaire car authenticated n'a aucun UPDATE direct.
-- Fonction non exposée aux rôles navigateur.
-- ---------------------------------------------------------------------------
create or replace function public.digiy_carnet_recompute_receivable(p_receivable_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
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

  select r.amount_due_xof into v_due
  from public.digiy_carnet_receivables r
  where r.id = p_receivable_id and r.owner_id = v_uid;

  if v_due is null then
    return jsonb_build_object('ok', false, 'error', 'receivable_not_found');
  end if;

  select coalesce(sum(p.amount_xof),0) into v_paid
  from public.digiy_carnet_receivable_payments p
  where p.receivable_id = p_receivable_id and p.owner_id = v_uid;

  if v_paid <= 0 then v_status := 'open';
  elsif v_paid < v_due then v_status := 'partial';
  else v_status := 'paid';
  end if;

  update public.digiy_carnet_receivables
  set amount_paid_xof = least(v_paid, v_due),
      status = v_status,
      updated_at = now()
  where id = p_receivable_id and owner_id = v_uid;

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
revoke all on function public.digiy_carnet_recompute_receivable(uuid) from authenticated;

-- ---------------------------------------------------------------------------
-- ENREGISTRER UN REMBOURSEMENT CLIENT DÛ
-- Une validation humaine = une transaction atomique :
-- 1) verrouille l'échéancier propriétaire ;
-- 2) vérifie le droit CARNET actif ;
-- 3) mouvement CARNET ;
-- 4) paiement ;
-- 5) recalcul du reste.
-- authenticated n'a aucun INSERT direct sur la table des paiements : ce RPC est
-- donc volontairement SECURITY DEFINER et contrôle auth.uid() à chaque étape.
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
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_receivable public.digiy_carnet_receivables%rowtype;
  v_remaining bigint;
  v_existing public.digiy_carnet_receivable_payments%rowtype;
  v_channel text := lower(trim(coalesce(p_channel,'')));
  v_legacy_channel text;
  v_access jsonb;
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

  -- Fast path idempotent.
  select p.* into v_existing
  from public.digiy_carnet_receivable_payments p
  where p.owner_id = v_uid and p.client_id = p_client_id
  limit 1;

  if found then
    return jsonb_build_object(
      'ok', true, 'idempotent', true,
      'payment_id', v_existing.id,
      'movement_id', v_existing.movement_id,
      'receivable_id', v_existing.receivable_id
    );
  end if;

  -- Verrouille la dette pour sérialiser deux remboursements simultanés.
  select r.* into v_receivable
  from public.digiy_carnet_receivables r
  where r.id = p_receivable_id
    and r.owner_id = v_uid
    and r.status in ('open','partial')
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'receivable_not_found_or_closed');
  end if;

  v_access := public.digiy_carnet_my_access(v_receivable.member_slug);
  if coalesce((v_access->>'ok')::boolean, false) is not true then
    return v_access;
  end if;

  -- Recontrôle après acquisition du verrou : couvre deux doubles clics arrivés
  -- au même instant avant que le premier paiement ne soit visible.
  select p.* into v_existing
  from public.digiy_carnet_receivable_payments p
  where p.owner_id = v_uid and p.client_id = p_client_id
  limit 1;

  if found then
    return jsonb_build_object(
      'ok', true, 'idempotent', true,
      'payment_id', v_existing.id,
      'movement_id', v_existing.movement_id,
      'receivable_id', v_existing.receivable_id
    );
  end if;

  v_remaining := v_receivable.amount_due_xof - v_receivable.amount_paid_xof;
  if p_amount_xof > v_remaining then
    return jsonb_build_object('ok', false, 'error', 'amount_exceeds_remaining', 'remaining_xof', v_remaining);
  end if;

  -- Le moteur PAY vivant accepte wave/cash/bank/other. Les autres canaux restent
  -- conservés dans meta.carnet_channel et la colonne legacy reçoit other.
  if v_channel in ('wave','cash','bank') then v_legacy_channel := v_channel;
  else v_legacy_channel := 'other';
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

  v_movement := public.digiy_carnet_insert_movement(v_receivable.member_slug, v_payload);
  if coalesce((v_movement->>'ok')::boolean, false) is not true then
    return jsonb_build_object('ok', false, 'error', 'movement_not_recorded', 'movement_error', v_movement);
  end if;

  v_movement_id := nullif(v_movement->>'id','')::uuid;
  if v_movement_id is null then raise exception 'CARNET movement returned no id'; end if;

  begin
    insert into public.digiy_carnet_receivable_payments (
      owner_id, receivable_id, amount_xof, channel,
      movement_id, client_id, paid_at, note_text
    ) values (
      v_uid, v_receivable.id, p_amount_xof, v_channel,
      v_movement_id, p_client_id, coalesce(p_paid_at, now()),
      nullif(trim(coalesce(p_note_text,'')),'')
    ) returning id into v_payment_id;
  exception when unique_violation then
    -- La trace financière est déjà idempotente. Si la ligne paiement a aussi été
    -- gagnée par une requête concurrente, on la relit proprement.
    select p.* into v_existing
    from public.digiy_carnet_receivable_payments p
    where p.owner_id=v_uid and p.client_id=p_client_id
    limit 1;
    if not found then raise; end if;
    return jsonb_build_object(
      'ok', true, 'idempotent', true,
      'payment_id', v_existing.id,
      'movement_id', v_existing.movement_id,
      'receivable_id', v_existing.receivable_id
    );
  end;

  v_summary := public.digiy_carnet_recompute_receivable(v_receivable.id);

  return jsonb_build_object(
    'ok', true,
    'idempotent', false,
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
revoke all on function public.digiy_carnet_record_receivable_payment(uuid,bigint,text,text,timestamptz,text) from authenticated;
grant execute on function public.digiy_carnet_record_receivable_payment(uuid,bigint,text,text,timestamptz,text) to authenticated;

commit;

-- GARANTIES V1 APRÈS POSE :
-- - anon : zéro accès ;
-- - authenticated : SELECT de ses propres échéanciers/paiements seulement ;
-- - aucune modification directe de amount_paid/status ;
-- - création / annulation / remboursement via RPC contrôlé ;
-- - paiement et mouvement CARNET liés par FK ;
-- - impossible de supprimer un mouvement de remboursement tant que le paiement existe ;
-- - droit CARNET revérifié côté serveur ;
-- - double clic protégé par verrou + deux contrôles idempotence + contraintes UNIQUE ;
-- - dette initiale jamais comptée comme encaissement.