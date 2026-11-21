import type { Projection } from '@starsector-builds/shared/types';
import type { WeaponVersionFull } from '@starsector-builds/shared/weapons/schema';
import {
    WEAPON_VERSION_FULL_KEYS,
    WeaponVersionFullSchema,
} from '@starsector-builds/shared/weapons/schema';

import { makeInsertReturn } from '../../db/helpers/insert.ts';
import {
    makeSelectCodeIdRecord,
    makeSelectOne,
    select,
    selectWithCount,
    type PaginatedResult,
} from '../../db/helpers/select.ts';
import type { WeaponVersionsFullRow } from '../../db/tables.ts';
import type { Options, Selection } from '../../db/types.ts';
import {
    sanitizeFilter,
    sanitizeOrder,
    sanitizeLimit,
    sanitizeOffset,
} from '../../server/sanitize.ts';
import { parseProjectionArray } from '../../utils/zod.ts';

export async function fetchWeaponVersions<
    TSelection extends Selection<WeaponVersionsFullRow>,
>(
    selection: TSelection,
    options: Options<WeaponVersionsFullRow>,
): Promise<PaginatedResult<Projection<WeaponVersionFull, TSelection>>> {
    const safeOptions: Options<WeaponVersionsFullRow> = {
        filter: sanitizeFilter(options.filter, WEAPON_VERSION_FULL_KEYS),
        order: sanitizeOrder(options.order),
        limit: sanitizeLimit(options.limit, 20),
        offset: sanitizeOffset(options.offset),
        client: options.client,
    };

    const result = await getWeaponVersionsFullWithCount(selection, safeOptions);

    return result;
}

export async function fetchLatestWeaponVersionById<
    TSelection extends Selection<WeaponVersionsFullRow>,
>(
    weaponVersionId: number,
    selection: TSelection,
    options?: Options<WeaponVersionsFullRow>,
): Promise<Projection<WeaponVersionFull, TSelection> | null> {
    const safeOptions: Options<WeaponVersionsFullRow> = {
        filter: {
            weapon_version_id: { values: [weaponVersionId] },
        },
        order: [
            { field: 'major', order: 'DESC' },
            { field: 'minor', order: 'DESC' },
            { field: 'patch', order: 'DESC' },
        ],
        limit: 1,
        client: options?.client,
    };

    const result = await getWeaponVersionsFull(selection, safeOptions);

    return result[0] ?? null;
}

export async function fetchWeaponVersionsById<
    TSelection extends Selection<WeaponVersionsFullRow>,
>(
    weaponId: number,
    selection: TSelection,
    options?: Options<WeaponVersionsFullRow>,
): Promise<PaginatedResult<Projection<WeaponVersionFull, TSelection>>> {
    const safeOptions: Options<WeaponVersionsFullRow> = {
        filter: {
            ...sanitizeFilter(options?.filter, WEAPON_VERSION_FULL_KEYS),
            weapon_id: { values: [weaponId] },
        },
        order: sanitizeOrder(options?.order),
        limit: sanitizeLimit(options?.limit, 20),
        offset: sanitizeOffset(options?.offset),
        client: options?.client,
    };

    const result = await getWeaponVersionsFullWithCount(selection, safeOptions);

    return result;
}

export async function fetchWeaponVersionById<
    TSelection extends Selection<WeaponVersionsFullRow>,
>(
    weaponVersionId: number,
    selection: TSelection,
    options?: Options<WeaponVersionsFullRow>,
): Promise<Projection<WeaponVersionFull, TSelection> | null> {
    const safeOptions: Options<WeaponVersionsFullRow> = {
        filter: {
            weapon_version_id: { values: [weaponVersionId] },
        },
        limit: 1,
        client: options?.client,
    };

    const result = await getWeaponVersionsFull(selection, safeOptions);

    return result[0] ?? null;
}

export async function getWeaponVersionsFull<
    TSelection extends Selection<WeaponVersionsFullRow>,
>(selection: TSelection, options?: Options<WeaponVersionsFullRow>) {
    const result = await select('weapon_versions_full', selection, options);
    const parsed = parseProjectionArray(
        result,
        selection,
        WeaponVersionFullSchema,
    );
    return parsed;
}

export async function getWeaponVersionsFullWithCount<
    TSelection extends Selection<WeaponVersionsFullRow>,
>(selection: TSelection, options?: Options<WeaponVersionsFullRow>) {
    const result = await selectWithCount(
        'weapon_versions_full',
        selection,
        options,
    );
    const parsed = parseProjectionArray(
        result.rows,
        selection,
        WeaponVersionFullSchema,
    );
    return { rows: parsed, total: result.total };
}

export const getWeaponId = makeSelectOne('weapons', ['id']);

export const getWeaponTypes = makeSelectCodeIdRecord('weapon_types');

export const getWeaponSizes = makeSelectCodeIdRecord('weapon_sizes');

export const getDamageTypes = makeSelectCodeIdRecord('damage_types');

export const insertWeapon = makeInsertReturn('weapons', ['mod_id', 'code']);

export const insertWeaponInstance = makeInsertReturn('weapon_instances', [
    'data_hash',
]);

export const insertWeaponVersion = makeInsertReturn('weapon_versions', [
    'mod_version_id',
    'weapon_id',
]);

export const insertWeaponSpecs = makeInsertReturn('weapon_specs', [
    'weapon_instance_id',
]);

export const insertWeaponStats = makeInsertReturn('weapon_stats', [
    'weapon_instance_id',
]);

export const insertWeaponText = makeInsertReturn('weapon_texts', [
    'weapon_instance_id',
]);

export const insertWeaponDesc = makeInsertReturn('weapon_descs', [
    'weapon_instance_id',
]);

export const insertProjWeapon = makeInsertReturn('proj_weapons', [
    'weapon_instance_id',
]);

export const insertAmmoWeapon = makeInsertReturn('ammo_weapons', [
    'weapon_instance_id',
]);

export const insertBeamWeapon = makeInsertReturn('beam_weapons', [
    'weapon_instance_id',
]);

export const insertWeaponHint = makeInsertReturn('weapon_hints', ['code']);

export const insertWeaponHintJunction = makeInsertReturn(
    'weapon_hint_junction',
    ['weapon_instance_id', 'hint_id'],
);

export const insertWeaponTag = makeInsertReturn('weapon_tags', ['code']);

export const insertWeaponTagJunction = makeInsertReturn('weapon_tag_junction', [
    'weapon_instance_id',
    'tag_id',
]);

export const insertWeaponGroup = makeInsertReturn('weapon_groups', ['code']);

export const insertWeaponGroupJunction = makeInsertReturn(
    'weapon_group_junction',
    ['weapon_instance_id', 'group_id'],
);
