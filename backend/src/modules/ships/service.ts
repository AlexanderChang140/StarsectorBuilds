import type { ShipVersionDTO } from '@shared/ships/types.ts';
import type { Projection } from '@shared/types.ts';

import { SHIP_VERSIONS_FULL_COLUMNS } from './constants.ts';
import type { DB } from '../../db/db.js';
import { makeInsertReturn } from '../../db/helpers/insert.ts';
import {
    makeSelect,
    makeSelectCodeIdRecord,
    makeSelectFull,
    makeSelectOne,
    selectFull,
} from '../../db/helpers/select.ts';
import type { Options } from '../../types/generic.ts';
import {
    sanitizeFilter,
    sanitizeLimit,
    sanitizeOffset,
    sanitizeOrder,
} from '../../utils/sanitize.ts';

export async function fetchShipVersions<
    TSelection extends readonly (keyof DB['ship_versions_full'])[],
>(
    selection: TSelection,
    options?: Options<DB['ship_versions_full']>,
): Promise<Projection<ShipVersionDTO, TSelection>[]> {
    const safeOptions = {
        filter: sanitizeFilter(options?.filter, SHIP_VERSIONS_FULL_COLUMNS),
        order: sanitizeOrder(options?.order),
        limit: sanitizeLimit(options?.limit, 20),
        offset: sanitizeOffset(options?.offset),
        client: options?.client,
    };

    const result = await selectFull(
        'ship_versions_full',
        selection,
        safeOptions,
    );

    return result;
}

export async function fetchShipVersionsById<
    TSelection extends readonly (keyof DB['ship_versions_full'])[],
>(
    shipId: number,
    selection: TSelection,
    options?: Options<DB['ship_versions_full']>,
): Promise<Projection<ShipVersionDTO, TSelection>[]> {
    const safeOptions = {
        filter: {
            ...sanitizeFilter(options?.filter, SHIP_VERSIONS_FULL_COLUMNS),
            ship_id: [shipId],
        },
        order: sanitizeOrder(options?.order),
        limit: sanitizeLimit(options?.limit, 20),
        offset: sanitizeOffset(options?.offset),
        client: options?.client,
    };

    const result = await selectFull(
        'ship_versions_full',
        selection,
        safeOptions,
    );

    return result;
}

export async function fetchShipInstanceId(shipVersionId: number) {
    const result = await getShipInstanceId({ where: { id: shipVersionId } });
    return result[0]?.ship_instance_id ?? null;
}

export async function fetchShipWeaponSlots(shipInstanceId: number) {
    return getShipWeaponSlots({ where: { ship_instance_id: shipInstanceId } });
}

export const getShipInstanceId = makeSelect(
    'ship_versions',
    ['ship_instance_id'],
    ['id'],
);

const SHIP_WEAPON_SLOT_COLUMNS = [
    'angle',
    'arc',
    'code',
    'id',
    'mount_type_id',
    'position',
    'ship_instance_id',
    'weapon_size_id',
    'weapon_type_id',
] as const satisfies readonly (keyof DB['ship_weapon_slots'])[];

export const getShipWeaponSlots = makeSelect(
    'ship_weapon_slots',
    SHIP_WEAPON_SLOT_COLUMNS,
    ['ship_instance_id'],
);

export const getShipVersionsFull = makeSelectFull(
    'ship_versions_full',
    SHIP_VERSIONS_FULL_COLUMNS,
);

export const getShipId = makeSelectOne<'ships', ['id'], 'mod_id' | 'code'>(
    'ships',
    ['id'],
);

export const getMountTypes = makeSelectCodeIdRecord('mount_types');

export const getShieldTypes = makeSelectCodeIdRecord('shield_types');

export const getShipSizes = makeSelectCodeIdRecord('ship_sizes');

export const insertShip = makeInsertReturn('ships', ['mod_id', 'code']);

export const insertShipInstance = makeInsertReturn('ship_instances', [
    'data_hash',
]);

export const insertShipVersion = makeInsertReturn('ship_versions', [
    'mod_version_id',
    'ship_id',
]);

export const insertShipSpecs = makeInsertReturn('ship_specs', [
    'ship_instance_id',
]);

export const insertShipStats = makeInsertReturn('ship_stats', [
    'ship_instance_id',
]);

export const insertShipText = makeInsertReturn('ship_texts', [
    'ship_instance_id',
]);

export const insertShipDesc = makeInsertReturn('ship_descs', [
    'ship_instance_id',
]);

export const insertShipPosition = makeInsertReturn('ship_positions', [
    'ship_instance_id',
]);

export const insertShipLogisticStats = makeInsertReturn('ship_logistic_stats', [
    'ship_instance_id',
]);

export const insertShipWeaponSlot = makeInsertReturn('ship_weapon_slots', [
    'ship_instance_id',
    'code',
]);

export const insertShieldStats = makeInsertReturn('shield_stats', [
    'ship_instance_id',
]);

export const insertPhaseStats = makeInsertReturn('phase_stats', [
    'ship_instance_id',
]);

export const insertShipHint = makeInsertReturn('ship_hints', ['code']);

export const insertShipHintJunction = makeInsertReturn('ship_hint_junction', [
    'ship_instance_id',
    'hint_id',
]);

export const insertShipTag = makeInsertReturn('ship_tags', ['code']);

export const insertShipTagJunction = makeInsertReturn('ship_tag_junction', [
    'ship_instance_id',
    'tag_id',
]);

export const insertBuiltInWeapon = makeInsertReturn('built_in_weapons', [
    'ship_instance_id',
    'slot_code',
]);

export const insertBuiltInHullmod = makeInsertReturn('built_in_hullmods', [
    'ship_instance_id',
    'hullmod_id',
]);

export const insertBuiltInWing = makeInsertReturn('built_in_wings', [
    'ship_instance_id',
    'ship_id',
]);
