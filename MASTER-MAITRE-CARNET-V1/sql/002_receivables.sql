-- MASTER MAÎTRE CARNET V1
-- Modèle cible des créances / dettes clients.
-- IMPORTANT : fichier de MASTER uniquement. NE PAS exécuter en production sans revue + test.
-- Doctrine : une créance n'est jamais de l'argent encaissé.

begin;

create table if not exists public.digiy_carnet_receivables (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  member_slug text not null,
  client_label text,
  client_phone text,
  amount_due_xof bigint not null check (amount_due_xof > 0),
  amount_paid_xof bigint not null default 0 check (amount_paid_xof >= 0),
  currency_code text not null default 'XOF',
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

-- Pas de DELETE utilisateur en V1 : on annule la créance pour garder l'historique.

create table if not exists public.digiy_carnet_receivable_payments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  receivable_id uuid not null references public.digiy_carnet_receivables(id) on delete restrict,
  amount_xof bigint not null check (amount_xof > 0),
  channel text not null check (channel in ('wave','orange_money','cash','bank','card','sendwave','other')),
  movement_id uuid,
  client_id text,
  paid_at timestamptz not null default now(),
  note_text text,
  created_at timestamptz not null default now()
);

create unique index if not exists digiy_carnet_receivable_payments_owner_client_id_uidx
  on public.digiy_carnet_receivable_payments(owner_id, client_id)
  where client_id is not null;

create index if not exists digiy_carnet_receivable_payments_receivable_idx
  on public.digiy_carnet_receivable_payments(receivable_id, paid_at desc);

alter table public.digiy_carnet_receivable_payments enable row level security;

revoke all on table public.digiy_carnet_receivable_payments from anon;
grant select, insert on table public.digiy_carnet_receivable_payments to authenticated;

create policy carnet_receivable_payments_select_own
  on public.digiy_carnet_receivable_payments
  for select
  to authenticated
  using ((select auth.uid()) = owner_id);

create policy carnet_receivable_payments_insert_own
  on public.digiy_carnet_receivable_payments
  for insert
  to authenticated
  with check (
    (select auth.uid()) = owner_id
    and exists (
      select 1
      from public.digiy_carnet_receivables r
      where r.id = receivable_id
        and r.owner_id = (select auth.uid())
        and r.status in ('open','partial')
    )
  );

-- Fonction de recalcul : aucune somme n'est inventée.
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
    'status', v_status
  );
end;
$function$;

revoke all on function public.digiy_carnet_recompute_receivable(uuid) from public;
revoke all on function public.digiy_carnet_recompute_receivable(uuid) from anon;
grant execute on function public.digiy_carnet_recompute_receivable(uuid) to authenticated;

commit;

-- TESTS AVANT DÉPLOIEMENT :
-- 1. anon : zéro lecture/écriture ;
-- 2. utilisateur A ne voit jamais les créances de B ;
-- 3. création créance : aucun mouvement financier créé ;
-- 4. paiement partiel : statut partial ;
-- 5. paiement total : statut paid ;
-- 6. paiement doit être lié séparément à un vrai mouvement CARNET encaissé ;
-- 7. CA / entrées / net ne lisent jamais directement cette table.
