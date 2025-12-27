import type { HullmodVersionDTO } from '@shared/hullmods/types.ts';
import type { Projection } from '@shared/types.ts';

import { HULLMOD_VERSIONS_FULL_COLUMNS } from './constants.ts';
import type { DB } from '../../db/db.js';
import { makeInsertReturn } from '../../db/helpers/insert.ts';
import { makeSelectOne, selectFull } from '../../db/helpers/select.ts';
import type { Options } from '../../types/generic.ts';
import {
    sanitizeFilter,
    sanitizeLimit,
    sanitizeOffset,
    sanitizeOrder,
} from '../../utils/sanitize.ts';

export async function fetchHullmodVersions<
    TSelection extends readonly (keyof DB['hullmod_versions_full'])[],
>(
    selection: TSelection,
    options: Options<DB['hullmod_versions_full']>,
): Promise<Projection<HullmodVersionDTO, TSelection>[]> {
    const safeOptions = {
        filter: sanitizeFilter(options.filter, HULLMOD_VERSIONS_FULL_COLUMNS),
        order: sanitizeOrder(options.order),
        limit: sanitizeLimit(options.limit, 20),
        offset: sanitizeOffset(options.offset),
        client: options.client,
    };

    const result = await selectFull(
        'hullmod_versions_full',
        selection,
        safeOptions,
    );

    return result;
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
