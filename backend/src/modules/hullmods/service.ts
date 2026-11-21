import {
    HullmodVersionFullSchema,
    type HullmodVersionFull,
} from '@starsector-builds/shared/hullmods/types';
import type { Projection } from '@starsector-builds/shared/types';

import { HULLMOD_VERSIONS_FULL_COLUMNS } from './constants.ts';
import { makeInsertReturn } from '../../db/helpers/insert.ts';
import {
    makeSelectOne,
    selectWithCount,
    type PaginatedResult,
} from '../../db/helpers/select.ts';
import type { HullmodVersionsFullRow } from '../../db/tables.ts';
import type { Options } from '../../db/types.ts';
import {
    sanitizeFilter,
    sanitizeLimit,
    sanitizeOffset,
    sanitizeOrder,
} from '../../server/sanitize.ts';
import { parseProjectionArray } from '../../utils/zod.ts';

export async function fetchHullmodVersions<
    TSelection extends readonly (keyof HullmodVersionsFullRow)[],
>(
    selection: TSelection,
    options: Options<HullmodVersionsFullRow>,
): Promise<PaginatedResult<Projection<HullmodVersionFull, TSelection>>> {
    const safeOptions = {
        filter: {
            ...sanitizeFilter(options.filter, HULLMOD_VERSIONS_FULL_COLUMNS),
            hide_everywhere: { values: [false] },
        },
        order: sanitizeOrder(options.order),
        limit: sanitizeLimit(options.limit, 20),
        offset: sanitizeOffset(options.offset),
        client: options.client,
    };

    const result = await getHullmodVersionsFull(selection, safeOptions);

    return result;
}

export async function getHullmodVersionsFull<
    TSelection extends readonly (keyof HullmodVersionsFullRow)[],
>(selection: TSelection, options?: Options<HullmodVersionsFullRow>) {
    const result = await selectWithCount(
        'hullmod_versions_full',
        selection,
        options,
    );

    const data = parseProjectionArray(
        result.rows,
        selection,
        HullmodVersionFullSchema,
    );
    return {
        rows: data,
        total: result.total,
    };
}

export const getHullmodId = makeSelectOne('hullmods', ['id']);

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
