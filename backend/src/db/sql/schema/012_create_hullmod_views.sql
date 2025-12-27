CREATE VIEW hullmod_versions_full AS
WITH hullmod_meta AS(
    SELECT
        hi.id AS hullmod_instance_id,
        array_agg(DISTINCT ht.code) FILTER (WHERE ht.code IS NOT NULL) AS tags,
        array_agg(DISTINCT hut.code) FILTER (WHERE hut.code IS NOT NULL) AS ui_tags
    FROM hullmod_instances hi
    LEFT JOIN hullmod_tag_junction htj ON htj.hullmod_instance_id = hi.id
    LEFT JOIN hullmod_tags ht ON htj.tag_id = ht.id
    LEFT JOIN hullmod_ui_tag_junction hutj ON hutj.hullmod_instance_id = hi.id
    LEFT JOIN hullmod_ui_tags hut ON hutj.tag_id = hut.id
    GROUP BY hi.id
)
SELECT
    hv.id AS hullmod_version_id,
    h.code as hullmod_code,
    i.file_path AS hullmod_image_file_path,

    mv.id as mod_version_id,
    mv.major,
    mv.minor,
    mv.patch,

    m.id AS mod_id,
    m.display_name AS mod_name,

    hi.id AS hullmod_instance_id,
    hi.hullmod_id,
    hi.data_hash, 

    hd.display_name,
    hd.manufacturer,
    hd.hullmod_desc,
    hd.base_value,
    hd.cost_frigate,
    hd.cost_destroyer,
    hd.cost_cruiser,
    hd.cost_capital,
    hd.hide,
    hd.hide_everywhere,
    
    hm.tags,
    hm.ui_tags
FROM hullmod_versions hv
LEFT JOIN hullmods h ON hv.hullmod_id = h.id
LEFT JOIN images i ON hv.hullmod_image_id = i.id
LEFT JOIN mod_versions mv ON hv.mod_version_id = mv.id
LEFT JOIN mods m ON mv.mod_id = m.id
LEFT JOIN hullmod_instances hi ON hv.hullmod_instance_id = hi.id
LEFT JOIN hullmod_data hd ON hi.id = hd.hullmod_instance_id
LEFT JOIN hullmod_meta hm ON hi.id = hm.hullmod_instance_id;