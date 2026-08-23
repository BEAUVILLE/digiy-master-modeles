-- MASTER MAÎTRE CARNET V1
-- Bridge cible : auth.uid() -> digiy_profiles -> backend PAY historique.
-- IMPORTANT : fichier de MASTER uniquement. NE PAS exécuter en production sans revue + test.
-- Les fonctions PAY historiques restent intactes pendant la migration.

begin;

-- ---------------------------------------------------------------------------
-- 1) Vérifier le droit CARNET de l'utilisateur authentifié.
-- SECURITY DEFINER volontaire : l'utilisateur ne lit jamais digiy_profiles ni
-- les tables PAY directement. Tous les noms d'objets sont qualifiés et le
-- search_path est vide pour éviter tout détournement de résolution de noms.
-- ---------------------------------------------------------------------------
create or replace function public.digiy_carnet_my_access(p_slug text)
returns jsonb
language plpgsql
security definer
set search_path = ''
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
revoke all on function public.digiy_carnet_my_access(text) from authenticated;
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
set search_path = ''
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
revoke all on function public.digiy_carnet_list_movements(text, integer) from authenticated;
grant execute on function public.digiy_carnet_list_movements(text, integer) to authenticated;

-- ---------------------------------------------------------------------------
-- 3) Inscrire un mouvement après authentification.
-- RÈGLE : 1 client_id/source_id = 1 seul geste durable.
-- La base vivante possède déjà la contrainte UNIQUE :
-- (phone, source_module, source_id, kind, direction).
-- ---------------------------------------------------------------------------
create or replace function public.digiy_carnet_insert_movement(
  p_slug text,
  p_payload jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_phone text;
  v_access jsonb;
  v_slug text;
  v_source_module text;
  v_source_id text;
  v_kind text;
  v_direction text;
  v_existing_id uuid;
  v_inserted jsonb;
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

  v_slug := v_access->>'slug';
  v_source_module := upper(trim(coalesce(p_payload->>'source_module','CARNET')));
  v_source_id := nullif(trim(coalesce(p_payload->>'source_id','')), '');
  v_kind := lower(trim(coalesce(p_payload->>'kind','other')));
  v_direction := lower(trim(coalesce(p_payload->>'direction','')));

  if v_source_id is null then
    return jsonb_build_object('ok', false, 'error', 'source_id_required_for_idempotence');
  end if;

  select m.id
  into v_existing_id
  from public.digiy_pay_movements m
  where m.phone = regexp_replace(coalesce(v_phone,''), '\D', '', 'g')
    and m.slug = lower(trim(v_slug))
    and m.source_module = v_source_module
    and m.source_id = v_source_id
    and m.kind = v_kind
    and m.direction = v_direction
  limit 1;

  if v_existing_id is not null then
    return jsonb_build_object(
      'ok', true,
      'id', v_existing_id,
      'slug', v_slug,
      'idempotent', true
    );
  end if;

  begin
    v_inserted := public.digiy_pay_pro_insert_movement(v_slug, v_phone, p_payload);
  exception
    when unique_violation then
      -- Deux requêtes simultanées peuvent arriver ici. La contrainte UNIQUE du
      -- moteur vivant tranche ; on relit alors la trace gagnante.
      select m.id
      into v_existing_id
      from public.digiy_pay_movements m
      where m.phone = regexp_replace(coalesce(v_phone,''), '\D', '', 'g')
        and m.slug = lower(trim(v_slug))
        and m.source_module = v_source_module
        and m.source_id = v_source_id
        and m.kind = v_kind
        and m.direction = v_direction
      limit 1;

      if v_existing_id is not null then
        return jsonb_build_object(
          'ok', true,
          'id', v_existing_id,
          'slug', v_slug,
          'idempotent', true
        );
      end if;
      raise;
  end;

  if coalesce((v_inserted->>'ok')::boolean, false) is not true then
    select m.id
    into v_existing_id
    from public.digiy_pay_movements m
    where m.phone = regexp_replace(coalesce(v_phone,''), '\D', '', 'g')
      and m.slug = lower(trim(v_slug))
      and m.source_module = v_source_module
      and m.source_id = v_source_id
      and m.kind = v_kind
      and m.direction = v_direction
    limit 1;

    if v_existing_id is not null then
      return jsonb_build_object(
        'ok', true,
        'id', v_existing_id,
        'slug', v_slug,
        'idempotent', true
      );
    end if;
  end if;

  return v_inserted || jsonb_build_object('idempotent', false);
end;
$function$;

revoke all on function public.digiy_carnet_insert_movement(text, jsonb) from public;
revoke all on function public.digiy_carnet_insert_movement(text, jsonb) from anon;
revoke all on function public.digiy_carnet_insert_movement(text, jsonb) from authenticated;
grant execute on function public.digiy_carnet_insert_movement(text, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- 4) Supprimer un mouvement appartenant au CARNET authentifié.
-- Les mouvements issus d'un remboursement Client dû seront protégés par FK.
-- ---------------------------------------------------------------------------
create or replace function public.digiy_carnet_delete_movement(
  p_slug text,
  p_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
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
revoke all on function public.digiy_carnet_delete_movement(text, uuid) from authenticated;
grant execute on function public.digiy_carnet_delete_movement(text, uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 5) Résumé global historique.
-- Le résumé JOUR / CA JOUR est recalculé côté CARNET pour distinguer toutes les
-- entrées des seules ventes commerciales.
-- ---------------------------------------------------------------------------
create or replace function public.digiy_carnet_summary(p_slug text)
returns jsonb
language plpgsql
security definer
set search_path = ''
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
revoke all on function public.digiy_carnet_summary(text) from authenticated;
grant execute on function public.digiy_carnet_summary(text) to authenticated;

commit;

-- TESTS À FAIRE AVANT TOUT DÉPLOIEMENT :
-- 1. utilisateur non authentifié -> refus ;
-- 2. utilisateur auth sans digiy_profiles -> refus ;
-- 3. adhérent lié sans droit PAY/CARNET -> refus ;
-- 4. adhérent lié avec droit actif -> lecture OK ;
-- 5. insertion avec source_id neuf -> exactement 1 ligne ;
-- 6. même source_id + même kind + même direction -> même id, idempotent=true ;
-- 7. double requête concurrente -> exactement 1 ligne grâce à la contrainte UNIQUE ;
-- 8. suppression d'une ligne d'un autre slug -> refus ;
-- 9. téléphone jamais requis côté navigateur ;
-- 10. nouveaux RPC exécutables par authenticated uniquement ;
-- 11. fonctions SECURITY DEFINER : search_path vide + objets qualifiés.