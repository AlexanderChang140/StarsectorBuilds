CREATE VIEW all_hullmod_instances AS
SELECT
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
    (
        SELECT array_agg(ht)
        FROM hullmod_tag_junction htj
        JOIN hullmod_tags ht ON htj.tag_id = ht.id
        WHERE htj.hullmod_instance_id = hi.id
    ) AS tags,
    (
        SELECT array_agg(hu)
        FROM hullmod_ui_tag_junction huj
        JOIN hullmod_ui_tags hu ON huj.tag_id = hu.id
        WHERE huj.hullmod_instance_id = hi.id
    ) AS ui_tags
FROM hullmod_instances hi
LEFT JOIN hullmod_data hd ON hi.id = hd.hullmod_instance_id;