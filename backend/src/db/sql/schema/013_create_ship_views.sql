CREATE VIEW ship_versions_full AS
WITH ship_meta AS (
    SELECT
        si.id AS ship_instance_id,
        array_agg(DISTINCT sh.code) FILTER (WHERE sh.code IS NOT NULL) AS hints,
        array_agg(DISTINCT st.code) FILTER (WHERE st.code IS NOT NULL) AS tags
    FROM ship_instances si
    LEFT JOIN ship_hint_junction shj ON shj.ship_instance_id = si.id
    LEFT JOIN ship_hints sh ON shj.hint_id = sh.id
    LEFT JOIN ship_tag_junction stj ON stj.ship_instance_id = si.id
    LEFT JOIN ship_tags st ON stj.tag_id = st.id
    GROUP BY si.id
)
SELECT
    sv.id AS ship_version_id,
    s.code AS ship_code,
    i.file_path AS ship_image_file_path,

    mv.id as mod_version_id,
    mv.major,
    mv.minor,
    mv.patch,

    m.id AS mod_id,
    m.display_name AS mod_name,

    si.id AS ship_instance_id,
    si.ship_id,
    si.data_hash,

    sp.ship_size_id,
    sp.shield_type_id,
    sp.ship_system_id,

    ssi.code AS ship_size,
    sty.code AS shield_type,
    ssy.code AS ship_system,

    ss.hitpoints,
    ss.armor_rating,
    ss.max_flux,
    ss.flux_dissipation,
    ss.op_cost,
    ss.fighter_bays,
    ss.max_speed,
    ss.acceleration,
    ss.deceleration,
    ss.max_turn_rate,
    ss.turn_acceleration,
    ss.mass,
    
    st.display_name,
    st.manufacturer,
    st.designation,
    st.base_value,

    sd.text1,
    sd.text2,

    spo.x,
    spo.y,

    sls.min_crew,
    sls.max_crew,
    sls.max_cargo,
    sls.max_fuel,
    sls.fuel_per_ly,
    sls.cr_recovery,
    sls.cr_deployment_cost,
    sls.peak_cr_sec,
    sls.cr_loss_per_sec,

    sst.arc AS shield_arc,
    sst.upkeep AS shield_upkeep,
    sst.efficiency AS shield_efficiency,

    ps.cost AS phase_cost,
    ps.upkeep AS phase_upkeep,

    sm.hints,
    sm.tags
FROM ship_versions sv
LEFT JOIN ships s ON sv.ship_id = s.id
LEFT JOIN images i ON sv.ship_image_id = i.id
LEFT JOIN mod_versions mv ON sv.mod_version_id = mv.id
LEFT JOIN mods m ON mv.mod_id = m.id
LEFT JOIN ship_instances si ON sv.ship_instance_id = si.id
LEFT JOIN ship_specs sp ON si.id = sp.ship_instance_id
LEFT JOIN ship_sizes ssi ON sp.ship_size_id = ssi.id
LEFT JOIN shield_types sty ON sp.shield_type_id = sty.id
LEFT JOIN ship_systems ssy ON sp.ship_system_id = ssy.id
LEFT JOIN ship_stats ss ON si.id = ss.ship_instance_id
LEFT JOIN ship_texts st ON si.id = st.ship_instance_id
LEFT JOIN ship_descs sd ON si.id = sd.ship_instance_id
LEFT JOIN ship_logistic_stats sls ON si.id = sls.ship_instance_id
LEFT JOIN ship_positions spo ON si.id = spo.ship_instance_id
LEFT JOIN shield_stats sst ON si.id = sst.ship_instance_id
LEFT JOIN phase_stats ps ON si.id = ps.ship_instance_id
LEFT JOIN ship_meta sm ON si.id = sm.ship_instance_id
WHERE NOT ssi.code = 'FIGHTER'
AND NOT (coalesce(sm.hints, '{}') && ARRAY['HIDE_IN_CODEX', 'MODULE', 'STATION'])
