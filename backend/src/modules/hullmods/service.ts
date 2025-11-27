import type {
    ValidHullmodInstance,
    InsertedHullmod,
    Hullmod,
    InsertedHullmodInstance,
    HullmodInstance,
    InsertedHullmodVersion,
    HullmodVersion,
    InsertedHullmodData,
    HullmodData,
    InsertedHullmodTagJunction,
    HullmodTagJunction,
    InsertedHullmodUiTagJunction,
    HullmodUiTagJunction,
} from './types.ts';
import { pool } from '../../db/client.ts';
import {
    createFilterWithAliases,
    type Filter,
} from '../../db/helpers/filter.ts';
import { makeInsertReturn } from '../../db/helpers/insert.ts';
import { makeSelectOne } from '../../db/helpers/select.ts';
import type { Code, CodeTable } from '../../types/generic.ts';

export async function getHullmodVersions(
    filter: Filter = {},
): Promise<ValidHullmodInstance[] | null> {
    const { clause, params } = createFilterWithAliases({
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

export const getHullmodId = makeSelectOne<Hullmod, 'id', Pick<Hullmod, 'code'>>(
    'hullmods',
    ['id'],
);

export const insertHullmod = makeInsertReturn<InsertedHullmod, Hullmod>(
    'hullmods',
    ['mod_id', 'code'],
);

export const insertHullmodInstance = makeInsertReturn<
    InsertedHullmodInstance,
    HullmodInstance
>('hullmod_instances', ['data_hash']);

export const insertHullmodVersion = makeInsertReturn<
    InsertedHullmodVersion,
    HullmodVersion
>('hullmod_versions', ['mod_version_id', 'hullmod_id']);

export const insertHullmodData = makeInsertReturn<
    InsertedHullmodData,
    HullmodData
>('hullmod_data', ['hullmod_instance_id']);

export const insertHullmodTag = makeInsertReturn<Code, CodeTable>(
    'hullmod_tags',
    ['code'],
);

export const insertHullmodTagJunction = makeInsertReturn<
    InsertedHullmodTagJunction,
    HullmodTagJunction
>('hullmod_tag_junction', ['hullmod_instance_id', 'tag_id']);

export const insertHullmodUiTag = makeInsertReturn<Code, CodeTable>(
    'hullmod_ui_tags',
    ['code'],
);

export const insertHullmodUiTagJunction = makeInsertReturn<
    InsertedHullmodUiTagJunction,
    HullmodUiTagJunction
>('hullmod_ui_junction', ['hullmod_instance_id', 'tag_id']);
