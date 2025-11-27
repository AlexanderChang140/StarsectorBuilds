import type {
    InsertedShipInstance,
    InsertedShip,
    Ship,
    ShipInstance,
    InsertedShipVersion,
    ShipVersion,
    InsertedShipSpecs,
    ShipSpecs,
    InsertedShipStats,
    ShipStats,
    InsertedShipText,
    ShipText,
    InsertedShipDesc,
    ShipDesc,
    InsertedShipLogisticStats,
    ShipLogisticStats,
    InsertedShipPosition,
    ShipPosition,
    InsertedShipWeaponSlot,
    ShipWeaponSlot,
    InsertedShieldStats,
    ShieldStats,
    InsertedPhaseStats,
    PhaseStats,
    InsertedShipHintJunction,
    ShipHintJunction,
    InsertedShipTagJunction,
    ShipTagJunction,
    BuiltInWeapon,
    InsertedBuiltInWeapon,
    InsertedBuiltInHullmod,
    BuiltInHullmod,
    InsertedBuiltInWing,
    BuiltInWing,
} from './types.ts';
import { makeInsertReturn } from '../../db/helpers/insert.ts';
import {
    makeSelectCodeIdRecord,
    makeSelectOne,
} from '../../db/helpers/select.ts';
import type { Code, CodeTable } from '../../types/generic.ts';

export const getShipId = makeSelectOne<
    Ship,
    'id',
    Pick<Ship, 'mod_id' | 'code'>
>('ships', ['id']);

export const getMountTypes = makeSelectCodeIdRecord('mount_types');

export const getShieldTypes = makeSelectCodeIdRecord('shield_types');

export const getShipSizes = makeSelectCodeIdRecord('ship_sizes');

export const insertShip = makeInsertReturn<InsertedShip, Ship>('ships', [
    'mod_id',
    'code',
]);

export const insertShipInstance = makeInsertReturn<
    InsertedShipInstance,
    ShipInstance
>('ship_instances', ['data_hash']);

export const insertShipVersion = makeInsertReturn<
    InsertedShipVersion,
    ShipVersion
>('ship_versions', ['mod_version_id', 'ship_id']);

export const insertShipSpecs = makeInsertReturn<InsertedShipSpecs, ShipSpecs>(
    'ship_specs',
    ['ship_instance_id'],
);

export const insertShipStats = makeInsertReturn<InsertedShipStats, ShipStats>(
    'ship_stats',
    ['ship_instance_id'],
);

export const insertShipText = makeInsertReturn<InsertedShipText, ShipText>(
    'ship_texts',
    ['ship_instance_id'],
);

export const insertShipDesc = makeInsertReturn<InsertedShipDesc, ShipDesc>(
    'ship_descs',
    ['ship_instance_id'],
);

export const insertShipPosition = makeInsertReturn<
    InsertedShipPosition,
    ShipPosition
>('ship_positions', ['ship_instance_id']);

export const insertShipLogisticStats = makeInsertReturn<
    InsertedShipLogisticStats,
    ShipLogisticStats
>('ship_logistic_stats', ['ship_instance_id']);

export const insertShipWeaponSlot = makeInsertReturn<
    InsertedShipWeaponSlot,
    ShipWeaponSlot
>('ship_weapon_slots', ['ship_instance_id', 'code']);

export const insertShieldStats = makeInsertReturn<
    InsertedShieldStats,
    ShieldStats
>('shield_stats', ['ship_instance_id']);

export const insertPhaseStats = makeInsertReturn<
    InsertedPhaseStats,
    PhaseStats
>('phase_stats', ['ship_instance_id']);

export const insertShipHint = makeInsertReturn<Code, CodeTable>('ship_hints', [
    'code',
]);

export const insertShipHintJunction = makeInsertReturn<
    InsertedShipHintJunction,
    ShipHintJunction
>('ship_hint_junction', ['ship_instance_id', 'hint_id']);

export const insertShipTag = makeInsertReturn<Code, CodeTable>('ship_tags', [
    'code',
]);

export const insertShipTagJunction = makeInsertReturn<
    InsertedShipTagJunction,
    ShipTagJunction
>('ship_tag_junction', ['ship_instance_id', 'tag_id']);

export const insertBuiltInWeapon = makeInsertReturn<
    InsertedBuiltInWeapon,
    BuiltInWeapon
>('built_in_weapons', ['ship_instance_id']);

export const insertBuiltInHullmod = makeInsertReturn<
    InsertedBuiltInHullmod,
    BuiltInHullmod
>('built_in_hullmods', ['ship_instance_id']);

export const insertBuiltInWing = makeInsertReturn<
    InsertedBuiltInWing,
    BuiltInWing
>('built_in_wings', ['ship_instance_id']);
