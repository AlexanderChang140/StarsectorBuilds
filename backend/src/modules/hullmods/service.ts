import type { HullmodVersionDTO } from '@shared/hullmods/types.ts';

import type { DB } from '../../db/db.js';
import { makeInsertReturn } from '../../db/helpers/insert.ts';
import { makeSelectFull, makeSelectOne } from '../../db/helpers/select.ts';
import type { Options } from '../../types/generic.ts';
import {
    sanitizeFilter,
    sanitizeLimit,
    sanitizeOffset,
    sanitizeOrder,
} from '../../utils/sanitize.ts';

export const TABLE_HULLMOD_FILTER_KEYS = [
    'mod_version_id',
] as const satisfies readonly (keyof DB['hullmod_versions_full'])[];

export async function fetchTableHullmods(
    options: Options<DB['hullmod_versions_full']>,
): Promise<HullmodVersionDTO[]> {
    const safeOptions = {
        filter: sanitizeFilter(options.filter, TABLE_HULLMOD_FILTER_KEYS),
        order: sanitizeOrder(options.order),
        limit: sanitizeLimit(options.limit, 20),
        offset: sanitizeOffset(options.offset),
        client: options.client,
    };

    const result = await getHullmodVersionsFull(safeOptions);
    const mapped = result?.map((row) => ({
        ...row,
        manufacturer: row.manufacturer ?? 'Common',
    }));

    return mapped;
}

const HULLMOD_VERSIONS_FULL_COLUMNS = [
    'base_value',
    'cost_capital',
    'cost_cruiser',
    'cost_destroyer',
    'cost_frigate',
    'data_hash',
    'display_name',
    'hide',
    'hide_everywhere',
    'hullmod_code',
    'hullmod_desc',
    'hullmod_id',
    'hullmod_image_file_path',
    'hullmod_instance_id',
    'hullmod_version_id',
    'major',
    'manufacturer',
    'minor',
    'mod_id',
    'mod_name',
    'mod_version_id',
    'patch',
    'tags',
    'ui_tags',
] as const satisfies readonly (keyof DB['hullmod_versions_full'])[];

export const getHullmodVersionsFull = makeSelectFull(
    'hullmod_versions_full',
    HULLMOD_VERSIONS_FULL_COLUMNS,
);

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
