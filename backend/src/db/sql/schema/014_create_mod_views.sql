CREATE VIEW mod_versions_full AS
SELECT
    mv.id AS mod_version_id,
    mv.major,
    mv.minor,
    mv.patch,
    mv.data_changed,

    m.id AS mod_id,
    m.code AS mod_code,
    m.display_name AS mod_name

FROM mod_versions mv
LEFT JOIN mods m ON mv.mod_id = m.id;