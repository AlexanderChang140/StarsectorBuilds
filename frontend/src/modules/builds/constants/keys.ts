import type { HullmodVersionFull } from '@starsector-builds/shared/hullmods/types';
import type {
    ShipVersionFull,
    ShipWeaponSlotFull,
} from '@starsector-builds/shared/ships/schema';
import type { WeaponVersionFull } from '@starsector-builds/shared/weapons/schema';
import type { WingVersionFull } from '@starsector-builds/shared/wings/schema';

export const SELECTED_SHIP_VERSION_KEYS = [
    'mod_version_id',
    'major',
    'minor',
    'patch',

    'ship_image_file_path',
    'ship_version_id',
    'ship_size',

    'x',
    'y',

    'display_name',
    'designation',
    'op',
    'flux_dissipation',
    'max_flux',

    'shield_arc',
    'shield_upkeep',
    'shield_efficiency',

    'max_speed',
    'armor_rating',
    'hitpoints',

    'built_in_weapons',
    'built_in_wings',
    'built_in_hullmods',
] as const satisfies (keyof ShipVersionFull)[];

export const SHIP_WEAPON_SLOT_KEYS = [
    'weapon_slot_id',
    'x',
    'y',
    'arc',
    'angle',
    'mount_type',
    'weapon_size',
    'weapon_type',
] as const satisfies (keyof ShipWeaponSlotFull)[];

export const WEAPON_KEYS = [
    'weapon_version_id',
    'display_name',
    'base_value',

    'manufacturer',
    'primary_role_str',
    'text1',
    'text2',
    'custom_ancillary',
    'custom_ancillary_hl',
    'custom_primary',
    'custom_primary_hl',

    'weapon_size',
    'weapon_size_id',
    'weapon_type',
    'damage_type',
    'op_cost',
    'weapon_range',
    'damage_per_shot',
    'damage_per_second',
    'flux_per_shot',
    'flux_per_second',
    'emp',
    'impact',
    'hitpoints',

    'turn_rate',
    'turn_rate_str',
    'accuracy_str',
    'autofire_accuracy_bonus',
    'proj_speed_str',
    'beam_speed',
    'flight_time',
    'launch_speed',
    'speed',
    'max_ammo',
    'ammo_per_second',
    'reload_size',
    'burst_size',
    'burst_delay',
    'chargeup',
    'chargedown',
    'max_spread',
    'min_spread',
    'spread_per_shot',
    'spread_decay_per_second',
    'tracking_str',
    'no_dps_tooltip',

    'turret_image_file_path',
    'turret_gun_image_file_path',
] as const satisfies readonly (keyof WeaponVersionFull)[];

export const WING_KEYS = [
    'wing_version_id',
    'fighter_ship_code',
    'display_name',
    'ship_image_file_path',
    'role_desc',
    'op_cost',
    'manufacturer',
    'text1',
    'text2',
    'base_value',
    'min_crew',
    'max_crew',
    'deployment_range',
    'num_fighters',
    'refit_time',
    'hitpoints',
    'armor_rating',
    'shield_type',
    'max_speed',
] as const satisfies readonly (keyof WingVersionFull)[];

export const HULLMOD_KEYS = [
    'display_name',
    'manufacturer',
    'hullmod_version_id',
    'cost_frigate',
    'cost_destroyer',
    'cost_cruiser',
    'cost_capital',
    'hullmod_desc',
    'hullmod_desc_s_mod',
    'hullmod_image_file_path',
    'ui_tags',
] as const satisfies readonly (keyof HullmodVersionFull)[];
