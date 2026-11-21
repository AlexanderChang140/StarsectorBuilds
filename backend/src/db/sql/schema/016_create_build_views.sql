CREATE VIEW builds_full AS
WITH build_mods_agg AS (
    SELECT
        bmv.build_id,
        COALESCE(array_agg(bmv.mod_version_id), '{}') AS mod_versions
    FROM build_mod_versions bmv
    GROUP BY bmv.build_id
),
build_weapons_agg AS (
    SELECT
        bw.build_id,
        COALESCE(array_agg(ARRAY[bw.ship_weapon_slot_id, bw.weapon_version_id]) FILTER (WHERE bw.ship_weapon_slot_id IS NOT NULL), '{}') AS installed_weapons
    FROM build_weapons bw
    GROUP BY bw.build_id
),
build_wings_agg AS (
    SELECT
        bwi.build_id,
        COALESCE(array_agg(ARRAY[bwi.ship_weapon_slot_id, bwi.wing_version_id]) FILTER (WHERE bwi.ship_weapon_slot_id IS NOT NULL), '{}') AS installed_wings
    FROM build_wings bwi
    GROUP BY bwi.build_id
),
build_hullmods_agg AS (
    SELECT
        bh.build_id,
        COALESCE(array_agg(bh.hullmod_version_id) FILTER (WHERE bh.hullmod_version_id IS NOT NULL AND NOT bh.built_in), '{}') AS installed_hullmods,
        COALESCE(array_agg(bh.hullmod_version_id) FILTER (WHERE bh.hullmod_version_id IS NOT NULL AND bh.built_in), '{}') AS built_in_hullmods
    FROM build_hullmods bh
    GROUP BY bh.build_id
)
SELECT
    b.id AS build_id,
    b.title,
    b.content,
    b.created_at,
    b.updated_at,

    b.user_id,
    u.username,

    b.ship_id,
    b.ship_version_id,
    b.ship_instance_id,

    svf.ship_code,
    svf.display_name AS ship_name,
    svf.ship_image_file_path,
    svf.ship_size,

    bs.vents,
    bs.capacitors,

    bmva.mod_versions,
    bwa.installed_weapons,
    bwa_wings.installed_wings,
    bha.installed_hullmods,
    bha.built_in_hullmods
FROM builds b
LEFT JOIN users u ON b.user_id = u.id
LEFT JOIN build_stats bs ON b.id = bs.build_id
LEFT JOIN ship_versions_full svf ON b.ship_version_id = svf.ship_version_id
LEFT JOIN build_mods_agg bmva ON b.id = bmva.build_id
LEFT JOIN build_weapons_agg bwa ON b.id = bwa.build_id
LEFT JOIN build_wings_agg bwa_wings ON b.id = bwa_wings.build_id
LEFT JOIN build_hullmods_agg bha ON b.id = bha.build_id;
