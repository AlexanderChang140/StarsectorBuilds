import {
    WING_KEYS,
    WingVersionFullSchema,
} from '@starsector-builds/shared/wings/schema';

import { ROW_LIMIT } from '../../config/database.ts';
import { createKeyedFilter } from '../../db/helpers/filter.ts';
import { makeInsertReturn } from '../../db/helpers/insert.ts';
import {
    makeSelectCodeIdRecord,
    selectWithCount,
} from '../../db/helpers/select.ts';
import type { WingVersionsFullRow } from '../../db/tables.ts';
import type { Options, Selection } from '../../db/types.ts';
import { NotFoundError } from '../../server/error.ts';
import {
    sanitizeFilter,
    sanitizeOrder,
    sanitizeLimit,
    sanitizeOffset,
} from '../../server/sanitize.ts';
import { parseProjectionArray } from '../../utils/zod.ts';

export async function fetchWingVersionsFull(
    selection: Selection<WingVersionsFullRow>,
    options?: Options<WingVersionsFullRow>,
) {
    const safeOptions: Options<WingVersionsFullRow> = {
        filter: sanitizeFilter(options?.filter, WING_KEYS),
        order: sanitizeOrder(options?.order),
        limit: sanitizeLimit(options?.limit, ROW_LIMIT),
        offset: sanitizeOffset(options?.offset),
        client: options?.client,
    };

    const result = await selectWithCount(
        'wing_versions_full',
        selection,
        safeOptions,
    );
    const rows = parseProjectionArray(
        result.rows,
        selection,
        WingVersionFullSchema,
    );

    return { rows, total: result.rows };
}

export async function fetchWingVersionFull(
    selection: Selection<WingVersionsFullRow>,
    options?: Options<WingVersionsFullRow>,
) {
    const safeOptions: Options<WingVersionsFullRow> = {
        filter: sanitizeFilter(options?.filter, WING_KEYS),
        limit: 1,
        client: options?.client,
    };

    const result = await selectWithCount(
        'wing_versions_full',
        selection,
        safeOptions,
    );
    const parsed = parseProjectionArray(
        result.rows,
        selection,
        WingVersionFullSchema,
    );
    const data = parsed[0];

    if (data == null) {
        throw new NotFoundError('No wing version found');
    }

    return data;
}

export async function fetchWingVersionFullByVid(
    wingVid: number,
    selection: Selection<WingVersionsFullRow>,
    options?: Options<WingVersionsFullRow>,
) {
    const nextOptions: Options<WingVersionsFullRow> = {
        ...options,
        filter: createKeyedFilter('wing_version_id', wingVid),
    };

    const result = await fetchWingVersionsFull(selection, nextOptions);

    return result.rows[0] ?? null;
}

export const getWingFormations = makeSelectCodeIdRecord('wing_formations');

export const getWingRoles = makeSelectCodeIdRecord('wing_roles');

export const insertWingInstance = makeInsertReturn('wing_instances', [
    'data_hash',
]);

export const insertWingVersion = makeInsertReturn('wing_versions', [
    'mod_version_id',
    'ship_id',
]);

export const insertWingData = makeInsertReturn('wing_data', [
    'wing_instance_id',
]);

export const insertWingHullmod = makeInsertReturn('wing_hullmods', [
    'wing_instance_id',
    'hullmod_id',
]);

export const insertWingWeaponGroup = makeInsertReturn('wing_weapon_groups');

export const insertWingWeapon = makeInsertReturn('wing_weapons', [
    'wing_weapon_group_id',
    'weapon_slot_code',
]);

export const insertWingTag = makeInsertReturn('wing_tags', ['code']);

export const insertWingTagJunction = makeInsertReturn('wing_tag_junction', [
    'wing_instance_id',
    'tag_id',
]);
