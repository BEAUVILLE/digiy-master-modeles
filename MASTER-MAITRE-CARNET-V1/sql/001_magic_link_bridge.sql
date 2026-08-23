-- MASTER MAÎTRE CARNET V1
-- Bridge cible : auth.uid() -> digiy_profiles -> backend PAY historique.
-- IMPORTANT : fichier de MASTER uniquement. NE PAS exécuter en production sans revue + test.
-- Les fonctions PAY historiques restent intactes pendant la migration.

begin;

-- ---------------------------------------------------------------------------
-- 1) Vérifier le droit CARNET de l'utilisateur authentifié.
-- ---------------------------------------------------------------------------
create or replace function public.digiy_carnet_my_access(p_slug text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $function$
declare
  v_uid uuid := auth.uid();
  v_phone text;
  v_access jsonb;
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'error', 'auth_required');
  end if;

  select p.phone_number
  into v_phone
  from public.digiy_profiles p
  where p.user_id = v_uid
  limit 1;

  if coalesce(trim(v_phone), '') = '' then
    return jsonb_build_object('ok', false, 'error', 'member_profile_missing');
  end if;

  v_access := public.digiy_pay_pro_check_access(p_slug, v_phone);

  if coalesce((v_access->>'ok')::boolean, false) is not true then
    return v_access - 'phone';
  end if;

  return jsonb_build_object(
    'ok', true,
    'slug', v_access->>'slug',
    'module', 'CARNET'
  );
end;
$function$;

revoke all on function public.digiy_carnet_my_access(text) from public;
revoke all on function public.digiy_carnet_my_access(text) from anon;
grant execute on function public.digiy_carnet_my_access(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 2) Lire les mouvements sans transmettre le téléphone depuis le navigateur.
-- ---------------------------------------------------------------------------
create or replace function public.digiy_carnet_list_movements(
  p_slug text,
  p_limit integer default 30
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $function$
declare
  v_uid uuid := auth.uid();
  v_phone text;
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'error', 'auth_required');
  end if;

  select p.phone_number
  into v_phone
  from public.digiy_profiles p
  where p.user_id = v_uid
  limit 1;

  if coalesce(trim(v_phone), '') = '' then
    return jsonb_build_object('ok', false, 'error', 'member_profile_missing');
  end if;

  return public.digiy_pay_pro_list_movements(
    p_slug,
    v_phone,
    greatest(1, least(coalesce(p_limit, 30), 100))
  );
end;
$function$;

revoke all on function public.digiy_carnet_list_movements(text, integer) from public;
revoke all on function public.digiy_carnet_list_movements(text, integer) from anon;
grant execute on function public.digiy_carnet_list_movements(text, integer) to authenticated;

-- ---------------------------------------------------------------------------
-- 3) Inscrire un mouvement après authentification.
-- La validation humaine reste obligatoire côté interface avant cet appel.
-- ---------------------------------------------------------------------------
create or replace function public.digiy_carnet_insert_movement(
  p_slug text,
  p_payload jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $function$
declare
  v_uid uuid := auth.uid();
  v_phone text;
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'error', 'auth_required');
  end if;

  select p.phone_number
  into v_phone
  from public.digiy_profiles p
  where p.user_id = v_uid
  limit 1;

  if coalesce(trim(v_phone), '') = '' then
    return jsonb_build_object('ok', false, 'error', 'member_profile_missing');
  end if;

  return public.digiy_pay_pro_insert_movement(p_slug, v_phone, p_payload);
end;
$function$;

revoke all on function public.digiy_carnet_insert_movement(text, jsonb) from public;
revoke all on function public.digiy_carnet_insert_movement(text, jsonb) from anon;
grant execute on function public.digiy_carnet_insert_movement(text, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- 4) Supprimer un mouvement appartenant au CARNET authentifié.
-- Le RPC PAY historique continue d'effectuer son contrôle slug + droit.
-- ---------------------------------------------------------------------------
create or replace function public.digiy_carnet_delete_movement(
  p_slug text,
  p_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $function$
declare
  v_uid uuid := auth.uid();
  v_phone text;
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'error', 'auth_required');
  end if;

  select p.phone_number
  into v_phone
  from public.digiy_profiles p
  where p.user_id = v_uid
  limit 1;

  if coalesce(trim(v_phone), '') = '' then
    return jsonb_build_object('ok', false, 'error', 'member_profile_missing');
  end if;

  return public.digiy_pay_pro_delete_movement(p_slug, v_phone, p_id);
end;
$function$;

revoke all on function public.digiy_carnet_delete_movement(text, uuid) from public;
revoke all on function public.digiy_carnet_delete_movement(text, uuid) from anon;
grant execute on function public.digiy_carnet_delete_movement(text, uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 5) Résumé global historique.
-- Le résumé JOUR / CA JOUR sera posé séparément dans le MASTER afin de
-- distinguer toutes les entrées des seules ventes commerciales.
-- ---------------------------------------------------------------------------
create or replace function public.digiy_carnet_summary(p_slug text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $function$
declare
  v_uid uuid := auth.uid();
  v_phone text;
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'error', 'auth_required');
  end if;

  select p.phone_number
  into v_phone
  from public.digiy_profiles p
  where p.user_id = v_uid
  limit 1;

  if coalesce(trim(v_phone), '') = '' then
    return jsonb_build_object('ok', false, 'error', 'member_profile_missing');
  end if;

  return public.digiy_pay_pro_summary(p_slug, v_phone);
end;
$function$;

revoke all on function public.digiy_carnet_summary(text) from public;
revoke all on function public.digiy_carnet_summary(text) from anon;
grant execute on function public.digiy_carnet_summary(text) to authenticated;

commit;

-- TESTS À FAIRE AVANT TOUT DÉPLOIEMENT :
-- 1. utilisateur non authentifié -> refus ;
-- 2. utilisateur auth sans digiy_profiles -> refus ;
-- 3. adhérent lié sans droit PAY/CARNET -> refus ;
-- 4. adhérent lié avec droit actif -> lecture OK ;
-- 5. insertion -> une seule ligne ;
-- 6. suppression d'une ligne d'un autre slug -> refus ;
-- 7. vérifier que le téléphone n'est jamais requis côté navigateur ;
-- 8. vérifier les droits EXECUTE : authenticated uniquement sur les nouveaux RPC.
