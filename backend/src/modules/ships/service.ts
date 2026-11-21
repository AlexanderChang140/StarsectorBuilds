import {
    SHIP_VERSION_FULL_KEYS,
    SHIP_WEAPON_SLOT_FULL_KEYS,
    ShipVersionFullSchema,
    ShipWeaponSlotFullSchema,
    type ShipVersionFull,
    type ShipWeaponSlotFull,
} from '@starsector-builds/shared/ships/schema';
import type { Projection } from '@starsector-builds/shared/types';

import { ROW_LIMIT } from '../../config/database.ts';
import { makeInsertReturn } from '../../db/helpers/insert.ts';
import {
    makeSelectCodeIdRecord,
    makeSelectOne,
    select,
    selectWithCount,
    type PaginatedResult,
} from '../../db/helpers/select.ts';
import type {
    ShipVersionsFullRow,
    ShipWeaponSlotsFullRow,
} from '../../db/tables.ts';
import type { Options, Selection } from '../../db/types.ts';
import { NotFoundError } from '../../server/error.ts';
import {
    sanitizeFilter,
    sanitizeLimit,
    sanitizeOffset,
    sanitizeOrder,
} from '../../server/sanitize.ts';
import { parseProjectionArray } from '../../utils/zod.ts';

export async function fetchShipVersionsFull<
    TSelection extends Selection<ShipVersionsFullRow>,
>(
    selection: TSelection,
    options?: Options<ShipVersionsFullRow>,
): Promise<PaginatedResult<Projection<ShipVersionFull, TSelection>>> {
    const safeOptions = {
        filter: sanitizeFilter(options?.filter, SHIP_VERSION_FULL_KEYS),
        order: sanitizeOrder(options?.order),
        limit: sanitizeLimit(options?.limit, 20),
        offset: sanitizeOffset(options?.offset),
        client: options?.client,
    };

    const result = await selectWithCount(
        'ship_versions_full',
        selection,
        safeOptions,
    );
    const rows = parseProjectionArray(
        result.rows,
        selection,
        ShipVersionFullSchema,
    );

    return { rows, total: result.total };
}

export async function fetchShipVersionFull<
    TSelection extends Selection<ShipVersionsFullRow>,
>(
    selection: TSelection,
    options?: Options<ShipVersionsFullRow>,
): Promise<Projection<ShipVersionFull, TSelection>> {
    const safeOptions = {
        filter: sanitizeFilter(options?.filter, SHIP_VERSION_FULL_KEYS),
        order: sanitizeOrder(options?.order),
        limit: 1,
        client: options?.client,
    };

    const result = await select('ship_versions_full', selection, safeOptions);
    const parsed = parseProjectionArray(
        result,
        selection,
        ShipVersionFullSchema,
    );
    const data = parsed[0];

    if (data == null) {
        throw new NotFoundError('No ship version found');
    }

    return data;
}

export async function fetchShipWeaponSlotsFull<
    TSelection extends Selection<ShipWeaponSlotsFullRow>,
>(
    selection: TSelection,
    options?: Options<ShipWeaponSlotsFullRow>,
): Promise<PaginatedResult<Projection<ShipWeaponSlotFull, TSelection>>> {
    const safeOptions = {
        filter: sanitizeFilter(options?.filter, SHIP_WEAPON_SLOT_FULL_KEYS),
        order: sanitizeOrder(options?.order),
        limit: sanitizeLimit(options?.limit, ROW_LIMIT),
        offset: sanitizeOffset(options?.offset),
        client: options?.client,
    };

    const result = await selectWithCount(
        'ship_weapon_slots_full',
        selection,
        safeOptions,
    );
    const parsed = parseProjectionArray(
        result.rows,
        selection,
        ShipWeaponSlotFullSchema,
    );

    return { rows: parsed, total: result.total };
}

export const selectShipId = makeSelectOne('ships', ['id']);

export const selectMountTypes = makeSelectCodeIdRecord('mount_types');

export const selectShieldTypes = makeSelectCodeIdRecord('shield_types');

export const selectShipSizes = makeSelectCodeIdRecord('ship_sizes');

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
