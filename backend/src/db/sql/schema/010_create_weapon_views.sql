CREATE VIEW weapon_versions_full AS
WITH weapon_meta AS (
    SELECT
        wi.id AS weapon_instance_id,
        array_agg(DISTINCT wh.code) FILTER (WHERE wh.code IS NOT NULL) AS hints,
        array_agg(DISTINCT wt.code) FILTER (WHERE wt.code IS NOT NULL) AS tags,
        array_agg(DISTINCT wg.code) FILTER (WHERE wg.code IS NOT NULL) AS groups
    FROM weapon_instances wi
    LEFT JOIN weapon_hint_junction whj ON whj.weapon_instance_id = wi.id
    LEFT JOIN weapon_hints wh ON whj.hint_id = wh.id
    LEFT JOIN weapon_tag_junction wtj ON wtj.weapon_instance_id = wi.id
    LEFT JOIN weapon_tags wt ON wtj.tag_id = wt.id
    LEFT JOIN weapon_group_junction wgj ON wgj.weapon_instance_id = wi.id
    LEFT JOIN weapon_groups wg ON wgj.group_id = wg.id
    GROUP BY wi.id
)
SELECT
    wv.id AS weapon_version_id,
    ti.file_path AS turret_image_file_path,
    tgi.file_path AS turret_gun_image_file_path,

    mv.id as mod_version_id,
    mv.major,
    mv.minor,
    mv.patch,

    m.id AS mod_id,
    m.display_name AS mod_name,

    wi.id AS weapon_instance_id,
    wi.weapon_id,
    wi.data_hash,

    sp.weapon_type_id,
    sp.weapon_size_id,
    sp.damage_type_id,

    wty.code AS weapon_type,
    wsi.code AS weapon_size,
    dt.code AS damage_type,

    ws.weapon_range,
    ws.damage_per_shot,
    ws.emp,
    ws.impact,
    ws.turn_rate,
    ws.op_cost,
    ws.flux_per_shot,
    ws.chargeup,
    ws.chargedown,
    ws.burst_size,
    ws.burst_delay,
    ws.min_spread,
    ws.max_spread,
    ws.spread_per_shot,
    ws.spread_decay_per_second,
    ws.autofire_accuracy_bonus,
    ws.extra_arc_for_ai,
    ws.base_value,
    pw.speed,
    pw.launch_speed,
    pw.flight_time,
    pw.hitpoints,
    aw.max_ammo,
    aw.ammo_per_second,
    aw.reload_size,
    bw.beam_speed,
    bw.damage_per_second,
    bw.flux_per_second,
    wt.display_name,
    wt.manufacturer,
    wt.primary_role_str,
    wt.proj_speed_str,
    wt.tracking_str,
    wt.turn_rate_str,
    wt.accuracy_str,
    wt.custom_primary,
    wt.custom_primary_hl,
    wt.custom_ancillary,
    wt.custom_ancillary_hl,
    wt.no_dps_tooltip,
    wd.text1,
    wd.text2,
    wm.hints,
    wm.tags,
    wm.groups
FROM weapon_versions wv
LEFT JOIN images ti ON wv.turret_image_id = ti.id
LEFT JOIN images tgi ON wv.turret_gun_image_id = tgi.id
LEFT JOIN mod_versions mv ON wv.mod_version_id = mv.id
LEFT JOIN mods m ON mv.mod_id = m.id
LEFT JOIN weapon_instances wi ON wv.weapon_instance_id = wi.id
LEFT JOIN weapon_specs sp ON wi.id = sp.weapon_instance_id
LEFT JOIN weapon_types wty ON sp.weapon_type_id = wty.id
LEFT JOIN weapon_sizes wsi ON sp.weapon_size_id = wsi.id
LEFT JOIN damage_types dt ON sp.damage_type_id = dt.id
LEFT JOIN weapon_stats ws ON wi.id = ws.weapon_instance_id
LEFT JOIN weapon_texts wt ON wi.id = wt.weapon_instance_id
LEFT JOIN weapon_descs wd ON wi.id = wd.weapon_instance_id
LEFT JOIN proj_weapons pw ON wi.id = pw.weapon_instance_id
LEFT JOIN ammo_weapons aw ON wi.id = aw.weapon_instance_id
LEFT JOIN beam_weapons bw ON wi.id = bw.weapon_instance_id
LEFT JOIN weapon_meta wm ON wm.weapon_instance_id = wi.id
WHERE (wm.hints IS NULL OR 'SYSTEM' != ALL(wm.hints) OR 'SHOW_IN_CODEX' = ANY(wm.hints));
