import type { PreparedWeaponDesc, PreparedWeaponText } from './desc.ts';
import type {
    PreparedProjWeapon,
    PreparedAmmoWeapon,
    PreparedBeamWeapon,
} from './projectile.ts';
import type { WithId } from '../../../types/generic.ts';

export type WeaponId = { weapon_id: number };
export type WeaponInstanceId = { weapon_instance_id: number };

export type WithWeaponId<T> = T & WeaponId;
export type WithWeaponInstanceId<T> = T & WeaponInstanceId;

export type PreparedFullWeapon = {
    preparedWeaponInstance: PreparedWeaponInstance;
    preparedWeaponSpecs: PreparedWeaponSpecs;
    preparedWeaponStats: PreparedWeaponStats;
    preparedWeaponText: PreparedWeaponText;
    preparedWeaponDesc: PreparedWeaponDesc | null;
    preparedProjWeapon: PreparedProjWeapon | null;
    preparedAmmoWeapon: PreparedAmmoWeapon | null;
    preparedBeamWeapon: PreparedBeamWeapon | null;
    weaponHints: string[];
    weaponGroups: string[];
    weaponTags: string[];
};

export type Weapon = WithId<InsertedWeapon>;
export type InsertedWeapon = {
    mod_id: number;
    code: string;
};

export type WeaponInstance = WithId<InsertedWeaponInstance>;
export type InsertedWeaponInstance = WithWeaponId<PreparedWeaponInstance>;
export type PreparedWeaponInstance = {
    data_hash: string;
};

export type WeaponVersion = WithId<InsertedWeaponVersion>;
export type InsertedWeaponVersion = {
    mod_version_id: number;
    weapon_id: number;
    weapon_instance_id: number;
    turret_image_id: number | null;
    turret_gun_image_id: number | null;
    hardpoint_image_id: number | null;
    hardpoint_gun_image_id: number | null;
};

export type WeaponSpecs = InsertedWeaponSpecs;
export type InsertedWeaponSpecs = WithWeaponInstanceId<{
    weapon_type_id: number;
    weapon_size_id: number;
    damage_type_id: number;
}>;
export type PreparedWeaponSpecs = {
    weapon_type: string;
    weapon_size: string;
    damage_type: string;
};

export type WeaponStats = InsertedWeaponStats;
export type InsertedWeaponStats = WithWeaponInstanceId<PreparedWeaponStats>;
export type PreparedWeaponStats = {
    weapon_range: number | null;
    damage_per_shot: number | null;
    emp: number | null;
    impact: number | null;
    turn_rate: number | null;
    op_cost: number | null;
    flux_per_shot: number | null;
    chargeup: number | null;
    chargedown: number | null;
    burst_size: number | null;
    burst_delay: number | null;
    min_spread: number | null;
    max_spread: number | null;
    spread_per_shot: number | null;
    spread_decay_per_second: number | null;
    autofire_accuracy_bonus: number | null;
    extra_arc_for_ai: number | null;
    base_value: number | null;
};
