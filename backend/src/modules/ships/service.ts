import type { ShipVersionDTO } from '@shared/ships/types.ts';

import type { DB } from '../../db/db.js';
import { makeInsertReturn } from '../../db/helpers/insert.ts';
import {
    makeSelect,
    makeSelectCodeIdRecord,
    makeSelectFull,
    makeSelectOne,
} from '../../db/helpers/select.ts';
import type { Options } from '../../types/generic.ts';
import {
    sanitizeFilter,
    sanitizeLimit,
    sanitizeOffset,
    sanitizeOrder,
} from '../../utils/sanitize.ts';

export const TABLE_SHIP_FILTER_KEYS = [
    'mod_version_id',
    'ship_size',
] as const satisfies readonly (keyof DB['ship_versions_full'])[];

export async function fetchTableShips(
    options: Options<DB['ship_versions_full']>,
): Promise<ShipVersionDTO[]> {
    const safeOptions = {
        filter: sanitizeFilter(options.filter, TABLE_SHIP_FILTER_KEYS),
        order: sanitizeOrder(options.order),
        limit: sanitizeLimit(options.limit, 20),
        offset: sanitizeOffset(options.offset),
        client: options.client,
    };

    const result = await getShipVersionsFull(safeOptions);
    const mapped = result?.map((row) => ({
        ...row,
        manufacturer: row.manufacturer ?? 'Common',
    }));

    return mapped;
}

export async function fetchShipVersions(shipId: number): Promise<ShipVersionDTO[]> {
    const filter = { ship_id: [shipId] };
    const limit = 20;

    const options = { filter, limit };
    const result = await getShipVersionsFull(options);

    const mapped = result?.map((row) => ({
        ...row,
        manufacturer: row.manufacturer ?? 'Common',
    }));

    return mapped;
}

export async function fetchShipVersion(shipVersionId: number): Promise<ShipVersionDTO | null> {
    const filter = { ship_version_id: [shipVersionId] };
    const limit = 1;

    const options = { filter, limit };
    const result = await getShipVersionsFull(options);

    const mapped = result?.map((row) => ({
        ...row,
        manufacturer: row.manufacturer ?? 'Common',
    }));

    return mapped[0] ?? null;
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

const SHIP_VERSIONS_FULL_COLUMNS = [
    'ship_version_id',
    'ship_image_file_path',

    'mod_version_id',
    'major',
    'minor',
    'patch',

    'mod_id',
    'mod_name',

    'ship_instance_id',
    'ship_id',
    'data_hash',

    'ship_size_id',
    'shield_type_id',
    'ship_system_id',

    'ship_size',
    'shield_type',
    'ship_system',

    'hitpoints',
    'armor_rating',
    'max_flux',
    'flux_dissipation',
    'op_cost',
    'fighter_bays',
    'max_speed',
    'acceleration',
    'deceleration',
    'max_turn_rate',
    'turn_acceleration',
    'mass',

    'display_name',
    'manufacturer',
    'designation',
    'base_value',

    'text1',
    'text2',

    'center',

    'min_crew',
    'max_crew',
    'max_cargo',
    'max_fuel',
    'fuel_per_ly',
    'cr_recovery',
    'cr_deployment_cost',
    'peak_cr_sec',
    'cr_loss_per_sec',

    'shield_arc',
    'shield_upkeep',
    'shield_efficiency',

    'phase_cost',
    'phase_upkeep',

    'hints',
    'tags',
] as const satisfies readonly (keyof DB['ship_versions_full'])[];

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
