import * as z from 'zod';
import {
    id,
    idPairs,
    numberOrNull,
    numeric,
    numericOrNull,
    stringOrNull,
} from '../zod.js';
import { keysOf } from '../utils.js';

export const ShipVersionFullSchema = z.object({
    mod_id: id,
    mod_name: z.string(),
    mod_version_id: id,
    ship_id: id,
    ship_instance_id: id,
    ship_version_id: id,
    ship_code: z.string(),
    data_hash: z.string(),

    display_name: stringOrNull,
    designation: stringOrNull,
    manufacturer: stringOrNull,
    ship_size: z.string(),
    ship_size_id: id,
    ship_image_file_path: stringOrNull,
    text1: stringOrNull,
    text2: stringOrNull,
    hints: z.array(z.string()).nullable(),
    tags: z.array(z.string()).nullable(),

    major: z.number(),
    minor: z.number(),
    patch: z.string(),

    hitpoints: numberOrNull,
    armor_rating: numberOrNull,
    max_flux: numberOrNull,
    flux_dissipation: numberOrNull,
    shield_type: z.string(),
    shield_type_id: id,
    shield_arc: numberOrNull,
    shield_efficiency: numericOrNull,
    shield_upkeep: numericOrNull,

    max_speed: numberOrNull,
    acceleration: numberOrNull,
    deceleration: numberOrNull,
    max_turn_rate: numberOrNull,
    turn_acceleration: numberOrNull,
    mass: numberOrNull,
    x: numeric,
    y: numeric,

    op: numberOrNull,
    base_value: numberOrNull,
    min_crew: numberOrNull,
    max_crew: numberOrNull,
    max_cargo: numberOrNull,
    peak_cr_sec: numberOrNull,
    cr_deployment_cost: numberOrNull,
    cr_loss_per_sec: numericOrNull,
    cr_recovery: numericOrNull,
    max_fuel: numberOrNull,
    fuel_per_ly: numericOrNull,
    fighter_bays: numberOrNull,
    phase_cost: numberOrNull,
    phase_upkeep: numberOrNull,

    ship_system: stringOrNull,
    ship_system_id: id.nullable(),
    built_in_hullmods: idPairs,
    built_in_weapons: idPairs,
    built_in_wings: idPairs,
});

export type ShipVersionFull = z.infer<typeof ShipVersionFullSchema>;

export const SHIP_VERSION_FULL_KEYS = Object.keys(
    ShipVersionFullSchema.shape,
) as readonly (keyof ShipVersionFull)[];

export const ShipWeaponSlotFullSchema = z.object({
    angle: numeric,
    arc: numeric,
    weapon_slot_code: z.string(),
    weapon_slot_id: id,
    ship_instance_id: id,
    mount_type: z.string(),
    mount_type_id: id,
    weapon_size: z.string(),
    weapon_size_id: id,
    weapon_type: z.string(),
    weapon_type_id: id,
    x: numeric,
    y: numeric,
});

export type ShipWeaponSlotFull = z.infer<typeof ShipWeaponSlotFullSchema>;

export const SHIP_WEAPON_SLOT_FULL_KEYS = keysOf(
    ShipWeaponSlotFullSchema.shape,
) satisfies readonly (keyof ShipWeaponSlotFull)[];
