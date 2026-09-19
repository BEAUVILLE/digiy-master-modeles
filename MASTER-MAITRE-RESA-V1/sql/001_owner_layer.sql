-- DIGIY RESA · couche propriétaire générique V1
-- Référence atelier : cette structure est déjà posée dans DIGIY CORE.

alter table public.digiy_resa_profiles
  add column if not exists auth_user_id uuid references auth.users(id) on delete set null;

create index if not exists idx_digiy_resa_profiles_auth_user
  on public.digiy_resa_profiles(auth_user_id)
  where auth_user_id is not null;

create index if not exists idx_digiy_resa_profiles_owner_id
  on public.digiy_resa_profiles(owner_id);

create index if not exists idx_digiy_resa_bookings_owner_id
  on public.digiy_resa_bookings(owner_id);

grant select on table public.digiy_resa_profiles to authenticated;
grant select, update on table public.digiy_resa_bookings to authenticated;

drop policy if exists "RESA owner reads own profile" on public.digiy_resa_profiles;
create policy "RESA owner reads own profile"
on public.digiy_resa_profiles for select to authenticated
using ((select auth.uid()) = auth_user_id);

drop policy if exists "RESA owner reads own bookings" on public.digiy_resa_bookings;
create policy "RESA owner reads own bookings"
on public.digiy_resa_bookings for select to authenticated
using (exists (
  select 1 from public.digiy_resa_profiles p
  where p.slug = digiy_resa_bookings.slug
    and p.auth_user_id = (select auth.uid())
    and p.is_active = true
));

drop policy if exists "RESA owner updates own bookings" on public.digiy_resa_bookings;
create policy "RESA owner updates own bookings"
on public.digiy_resa_bookings for update to authenticated
using (exists (
  select 1 from public.digiy_resa_profiles p
  where p.slug = digiy_resa_bookings.slug
    and p.auth_user_id = (select auth.uid())
    and p.is_active = true
))
with check (exists (
  select 1 from public.digiy_resa_profiles p
  where p.slug = digiy_resa_bookings.slug
    and p.auth_user_id = (select auth.uid())
    and p.is_active = true
));

create table if not exists public.digiy_resa_slots (
  id uuid primary key default gen_random_uuid(),
  slug text not null references public.digiy_resa_profiles(slug) on update cascade on delete cascade,
  slot_date date not null,
  start_time time without time zone not null,
  end_time time without time zone,
  status text not null default 'open' check (status in ('open','closed')),
  capacity integer check (capacity is null or capacity > 0),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(slug, slot_date, start_time),
  check (end_time is null or end_time > start_time)
);

alter table public.digiy_resa_slots enable row level security;
create index if not exists idx_digiy_resa_slots_slug_date
  on public.digiy_resa_slots(slug, slot_date, start_time);
grant select, insert, update, delete on table public.digiy_resa_slots to authenticated;

drop policy if exists "RESA owner reads own slots" on public.digiy_resa_slots;
create policy "RESA owner reads own slots"
on public.digiy_resa_slots for select to authenticated
using (exists (
  select 1 from public.digiy_resa_profiles p
  where p.slug = digiy_resa_slots.slug
    and p.auth_user_id = (select auth.uid())
    and p.is_active = true
));

drop policy if exists "RESA owner inserts own slots" on public.digiy_resa_slots;
create policy "RESA owner inserts own slots"
on public.digiy_resa_slots for insert to authenticated
with check (exists (
  select 1 from public.digiy_resa_profiles p
  where p.slug = digiy_resa_slots.slug
    and p.auth_user_id = (select auth.uid())
    and p.is_active = true
));

drop policy if exists "RESA owner updates own slots" on public.digiy_resa_slots;
create policy "RESA owner updates own slots"
on public.digiy_resa_slots for update to authenticated
using (exists (
  select 1 from public.digiy_resa_profiles p
  where p.slug = digiy_resa_slots.slug
    and p.auth_user_id = (select auth.uid())
    and p.is_active = true
))
with check (exists (
  select 1 from public.digiy_resa_profiles p
  where p.slug = digiy_resa_slots.slug
    and p.auth_user_id = (select auth.uid())
    and p.is_active = true
));

drop policy if exists "RESA owner deletes own slots" on public.digiy_resa_slots;
create policy "RESA owner deletes own slots"
on public.digiy_resa_slots for delete to authenticated
using (exists (
  select 1 from public.digiy_resa_profiles p
  where p.slug = digiy_resa_slots.slug
    and p.auth_user_id = (select auth.uid())
    and p.is_active = true
));
