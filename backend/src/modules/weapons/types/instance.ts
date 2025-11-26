import type { WithWeaponId } from './core.ts';
import type { PreparedWeaponDesc, PreparedWeaponText } from './desc.ts';
import type {
    PreparedProjWeapon,
    PreparedAmmoWeapon,
    PreparedBeamWeapon,
} from './projectile.ts';
import type { PreparedWeaponSpecs, PreparedWeaponStats } from './stats.ts';
import type { WithId } from '../../../types/generic.ts';

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
