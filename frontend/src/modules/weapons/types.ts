import type { Projection } from '@starsector-builds/shared/types';
import type { WeaponVersionFull } from '@starsector-builds/shared/weapons/schema';

export const WEAPON_TABLE_ROW_KEYS = [
    'ammo_per_second',
    'base_value',
    'beam_speed',
    'burst_delay',
    'burst_size',
    'chargedown',
    'chargeup',
    'damage_per_second',
    'damage_per_shot',
    'damage_type',
    'display_name',
    'emp',
    'flight_time',
    'flux_per_second',
    'flux_per_shot',
    'hitpoints',
    'impact',
    'launch_speed',
    'manufacturer',
    'max_ammo',
    'max_spread',
    'min_spread',
    'mod_id',
    'mod_name',
    'mod_version_id',
    'op_cost',
    'reload_size',
    'speed',
    'spread_decay_per_second',
    'spread_per_shot',
    'turn_rate',
    'turret_gun_image_file_path',
    'turret_image_file_path',
    'weapon_code',
    'weapon_id',
    'weapon_range',
    'weapon_size',
    'weapon_type',
    'weapon_version_id',
] as const satisfies readonly (keyof WeaponVersionFull)[];

export type WeaponTableRows = Projection<
    WeaponVersionFull,
    typeof WEAPON_TABLE_ROW_KEYS
>;
