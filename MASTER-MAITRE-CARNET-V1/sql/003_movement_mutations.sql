-- MASTER MAÎTRE CARNET V1
-- Mutations durables du cockpit PRO CARNET existant.
-- Migration Supabase appliquée le 2026-08-24 sous le nom carnet_movement_mutations_v1.
-- Règle : auth.uid() + profil lié + droit CARNET actif + source_module=CARNET.

begin;

create or replace function public.digiy_carnet_update_movement(
  p_slug text,
  p_source_id text,
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
  v_id uuid;
  v_direction text;
  v_scope text;
  v_kind text;
  v_category text;
  v_channel text;
  v_amount bigint;
  v_label text;
  v_note text;
  v_origin text;
  v_movement_date date;
  v_meta jsonb;
  v_source_id text := nullif(trim(coalesce(p_source_id, '')), '');
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'error', 'auth_required');
  end if;

  if v_source_id is null then
    return jsonb_build_object('ok', false, 'error', 'source_id_required');
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
  v_direction := lower(trim(coalesce(p_payload->>'direction', '')));
  v_scope := lower(trim(coalesce(p_payload->>'scope', 'pro')));
  v_kind := lower(trim(coalesce(p_payload->>'kind', '')));
  v_category := lower(trim(coalesce(p_payload->>'category', 'other')));
  v_channel := lower(trim(coalesce(p_payload->>'channel', 'other')));
  v_amount := nullif(
    regexp_replace(
      coalesce(p_payload->>'amount_xof', p_payload->>'amount', ''),
      '\D',
      '',
      'g'
    ),
    ''
  )::bigint;
  v_label := trim(coalesce(p_payload->>'label', ''));
  v_note := nullif(trim(coalesce(p_payload->>'note_text', p_payload->>'note', '')), '');
  v_origin := lower(trim(coalesce(p_payload->>'origin', 'manual')));
  v_meta := coalesce(p_payload->'meta', '{}'::jsonb);

  if v_direction not in ('in', 'out') then
    return jsonb_build_object('ok', false, 'error', 'bad_direction');
  end if;

  if v_scope = 'personal' then
    v_scope := 'perso';
  end if;
  if v_scope not in ('pro', 'perso') then
    return jsonb_build_object('ok', false, 'error', 'bad_scope');
  end if;

  if v_kind not in ('sale', 'expense', 'saving', 'transfer') then
    return jsonb_build_object('ok', false, 'error', 'bad_kind');
  end if;

  if v_channel not in ('wave', 'cash', 'bank', 'other') then
    return jsonb_build_object('ok', false, 'error', 'bad_channel');
  end if;

  if v_amount is null or v_amount <= 0 then
    return jsonb_build_object('ok', false, 'error', 'bad_amount');
  end if;

  if v_label = '' then
    return jsonb_build_object('ok', false, 'error', 'label_missing');
  end if;

  begin
    v_movement_date := coalesce(nullif(p_payload->>'movement_date', '')::date, current_date);
  exception when others then
    v_movement_date := current_date;
  end;

  update public.digiy_pay_movements m
  set direction = v_direction,
      scope = v_scope,
      kind = v_kind,
      category = coalesce(nullif(v_category, ''), 'other'),
      channel = v_channel,
      amount_xof = v_amount,
      currency_code = 'XOF',
      label = v_label,
      note_text = v_note,
      origin = coalesce(nullif(v_origin, ''), 'manual'),
      movement_date = v_movement_date,
      status = 'posted',
      meta = v_meta,
      updated_at = now()
  where m.slug = lower(trim(v_slug))
    and m.phone = regexp_replace(coalesce(v_phone, ''), '\D', '', 'g')
    and m.source_module = 'CARNET'
    and m.source_id = v_source_id
  returning m.id into v_id;

  if v_id is null then
    return jsonb_build_object('ok', false, 'error', 'movement_not_found');
  end if;

  return jsonb_build_object(
    'ok', true,
    'id', v_id,
    'slug', v_slug,
    'source_id', v_source_id
  );
end;
$function$;

revoke all on function public.digiy_carnet_update_movement(text, text, jsonb) from public;
revoke all on function public.digiy_carnet_update_movement(text, text, jsonb) from anon;
revoke all on function public.digiy_carnet_update_movement(text, text, jsonb) from authenticated;
grant execute on function public.digiy_carnet_update_movement(text, text, jsonb) to authenticated;

create or replace function public.digiy_carnet_delete_movement_source(
  p_slug text,
  p_source_id text
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
  v_deleted integer := 0;
  v_source_id text := nullif(trim(coalesce(p_source_id, '')), '');
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'error', 'auth_required');
  end if;

  if v_source_id is null then
    return jsonb_build_object('ok', false, 'error', 'source_id_required');
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

  delete from public.digiy_pay_movements m
  where m.slug = lower(trim(v_slug))
    and m.phone = regexp_replace(coalesce(v_phone, ''), '\D', '', 'g')
    and m.source_module = 'CARNET'
    and m.source_id = v_source_id;

  get diagnostics v_deleted = row_count;

  if v_deleted = 0 then
    return jsonb_build_object('ok', false, 'error', 'movement_not_found');
  end if;

  return jsonb_build_object(
    'ok', true,
    'deleted', v_deleted,
    'slug', v_slug,
    'source_id', v_source_id
  );
end;
$function$;

revoke all on function public.digiy_carnet_delete_movement_source(text, text) from public;
revoke all on function public.digiy_carnet_delete_movement_source(text, text) from anon;
revoke all on function public.digiy_carnet_delete_movement_source(text, text) from authenticated;
grant execute on function public.digiy_carnet_delete_movement_source(text, text) to authenticated;

commit;
