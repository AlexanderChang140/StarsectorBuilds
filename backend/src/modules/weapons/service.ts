import type { Projection } from '@shared/types.ts';
import type { WeaponVersionDTO } from '@shared/weapons/types.ts';

import { WEAPON_VERSIONS_FULL_COLUMNS } from './constants.ts';
import type { DB } from '../../db/db.js';
import { makeInsertReturn } from '../../db/helpers/insert.ts';
import {
    makeSelectCodeIdRecord,
    makeSelectOne,
    selectFull,
} from '../../db/helpers/select.ts';
import type { Options } from '../../types/generic.ts';
import { assertProjectionRowsNonNullableKeys } from '../../utils/assert.ts';
import {
    sanitizeFilter,
    sanitizeOrder,
    sanitizeLimit,
    sanitizeOffset,
} from '../../utils/sanitize.ts';

export async function fetchWeaponVersions<
    TSelection extends readonly (keyof DB['weapon_versions_full'])[],
>(
    selection: TSelection,
    options: Options<DB['weapon_versions_full']>,
): Promise<Projection<WeaponVersionDTO, TSelection>[]> {
    const safeOptions: Options<DB['weapon_versions_full']> = {
        filter: sanitizeFilter(options.filter, WEAPON_VERSIONS_FULL_COLUMNS),
        order: sanitizeOrder(options.order),
        limit: sanitizeLimit(options.limit, 20),
        offset: sanitizeOffset(options.offset),
        client: options.client,
    };

    const result = await getWeaponVersionsFull(selection, safeOptions);

    return result;
}

export async function fetchLatestWeaponVersionById<
    TSelection extends readonly (keyof DB['weapon_versions_full'])[],
>(
    weaponVersionId: number,
    selection: TSelection,
    options?: Options<DB['weapon_versions_full']>,
): Promise<Projection<WeaponVersionDTO, TSelection> | null> {
    const safeOptions: Options<DB['weapon_versions_full']> = {
        filter: {
            weapon_version_id: { values: [weaponVersionId] },
        },
        order: {
            major: 'DESC',
            minor: 'DESC',
            patch: 'DESC',
        },
        limit: 1,
        client: options?.client,
    };

    const result = await getWeaponVersionsFull(selection, safeOptions);

    return result[0] ?? null;
}

export async function fetchWeaponVersionsById<
    TSelection extends readonly (keyof DB['weapon_versions_full'])[],
>(
    weaponId: number,
    selection: TSelection,
    options?: Options<DB['weapon_versions_full']>,
): Promise<Projection<WeaponVersionDTO, TSelection>[]> {
    const safeOptions: Options<DB['weapon_versions_full']> = {
        filter: {
            ...sanitizeFilter(options?.filter, WEAPON_VERSIONS_FULL_COLUMNS),
            weapon_id: { values: [weaponId] },
        },
        order: sanitizeOrder(options?.order),
        limit: sanitizeLimit(options?.limit, 20),
        offset: sanitizeOffset(options?.offset),
        client: options?.client,
    };

    const result = await getWeaponVersionsFull(selection, safeOptions);

    return result;
}

export async function fetchWeaponVersionById<
    TSelection extends readonly (keyof DB['weapon_versions_full'])[],
>(
    weaponVersionId: number,
    selection: TSelection,
    options?: Options<DB['weapon_versions_full']>,
): Promise<Projection<WeaponVersionDTO, TSelection> | null> {
    const safeOptions: Options<DB['weapon_versions_full']> = {
        filter: {
            weapon_version_id: { values: [weaponVersionId] },
        },
        limit: 1,
        client: options?.client,
    };

    const result = await getWeaponVersionsFull(selection, safeOptions);

    return result[0] ?? null;
}

const REQUIRED_WEAPON_VERSION_KEYS = [
    'major',
    'minor',
    'patch',
    'mod_id',
    'mod_version_id',
    'weapon_code',
    'weapon_id',
    'weapon_instance_id',
    'weapon_size',
    'weapon_size_id',
    'weapon_type',
    'weapon_type_id',
    'weapon_version_id',
    'damage_type',
    'damage_type_id',
] as const satisfies readonly (keyof DB['weapon_versions_full'])[];

export async function getWeaponVersionsFull<
    TSelection extends readonly (keyof DB['weapon_versions_full'])[],
>(selection: TSelection, options?: Options<DB['weapon_versions_full']>) {
    const result = await selectFull('weapon_versions_full', selection, options);
    assertProjectionRowsNonNullableKeys(result, REQUIRED_WEAPON_VERSION_KEYS);
    return result;
}

export const getWeaponId = makeSelectOne<'weapons', ['id'], 'code'>('weapons', [
    'id',
]);

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
