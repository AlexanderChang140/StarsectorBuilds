import type { ValidHullmodInstance } from './types.ts';
import { pool } from '../../db/client.ts';
import {
    createFilterFragmentWithAliases,
    type Filter,
} from '../../db/helpers/filter.ts';
import { makeInsertReturn } from '../../db/helpers/insert.ts';
import { makeSelectOne } from '../../db/helpers/select.ts';

export async function getHullmodVersions(
    filter: Filter = {},
): Promise<ValidHullmodInstance[] | null> {
    const { clause, params } = createFilterFragmentWithAliases({
        hv: { mod_version_id: filter.mod_version_id },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        h: (({ mod_version_id, ...rest }) => rest)(filter),
    });
    const filterClause = clause ? `AND ${clause}` : '';
    const query = `
        SELECT
            h.hullmod_instance_id,
            h.hullmod_id,
            h.data_hash,
            h.display_name,
            h.manufacturer,
            h.hullmod_desc,
            h.base_value,
            h.cost_frigate,
            h.cost_destroyer,
            h.cost_cruiser,
            h.cost_capital,
            h.hide,
            h.hide_everywhere,
            h.tags,
            h.ui_tags
        FROM hullmod_versions hv
        LEFT JOIN all_hullmod_instances h ON h.hullmod_instance_id = hv.hullmod_instance_id
        WHERE (h.hide_everywhere = FALSE)
        ${filterClause};
    `;
    const result = await pool.query<ValidHullmodInstance>(query, params);
    return result.rows;
}

export const getHullmodId = makeSelectOne<'hullmods', ['id'], 'code'>(
    'hullmods',
    ['id'],
);

export const insertHullmod = makeInsertReturn('hullmods', ['mod_id', 'code']);

export const insertHullmodInstance = makeInsertReturn('hullmod_instances', [
    'data_hash',
]);

export const insertHullmodVersion = makeInsertReturn('hullmod_versions', [
    'mod_version_id',
    'hullmod_id',
]);

export const insertHullmodData = makeInsertReturn('hullmod_data', [
    'hullmod_instance_id',
]);

export const insertHullmodTag = makeInsertReturn('hullmod_tags', ['code']);

export const insertHullmodTagJunction = makeInsertReturn(
    'hullmod_tag_junction',
    ['hullmod_instance_id', 'tag_id'],
);

export const insertHullmodUiTag = makeInsertReturn('hullmod_ui_tags', ['code']);

export const insertHullmodUiTagJunction = makeInsertReturn(
    'hullmod_ui_tag_junction',
    ['hullmod_instance_id', 'tag_id'],
);
