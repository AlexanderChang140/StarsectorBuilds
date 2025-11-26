import type { Mod } from '../../types/mod';

export type FullWeaponVersion = {
    weapon_version_id: number;
    turret_image_file_path: string;
    turret_gun_image_file_path: string;

    major: number;
    minor: number;
    patch: string;

    mod_id: number;
    mod_name: string;

    weapon_instance_id: number;
    weapon_id: number;
    weapon_type: string;
    weapon_size: string;
    damage_type: string;
    weapon_range: string;
    damage_per_shot: string;
    emp: string;
    impact: string;
    turn_rate: string;
    op_cost: string;
    flux_per_shot: string;
    chargeup: string;
    chargedown: string;
    burst_size: string;
    burst_delay: string;
    min_spread: string;
    max_spread: string;
    spread_per_shot: string;
    spread_decay_per_second: string;
    autofire_accuracy_bonus: string;
    extra_arc_for_ai: string;
    base_value: string;
    speed: string;
    launch_speed: string;
    flight_time: string;
    hitpoints: string;
    max_ammo: string;
    ammo_per_second: string;
    reload_size: string;
    beam_speed: string;
    damage_per_second: number;
    flux_per_second: number;
    display_name: string;
    manufacturer: string;
    primary_role_str: string;
    proj_speed_str: string;
    tracking_str: string;
    turn_rate_str: string;
    accuracy_str: string;
    custom_primary: string;
    custom_primary_hl: string;
    custom_ancillary: string;
    custom_ancillary_hl: string;
    no_dps_tooltip: string[];
    text1: string;
    text2: string;
    hints: string[];
    tags: string[];
    groups: string[];
};

export type WeaponSpecs = Pick<
    FullWeaponVersion,
    'weapon_type' | 'weapon_size' | 'damage_type'
>;

export type WeaponStats = Pick<
    FullWeaponVersion,
    | 'weapon_range'
    | 'damage_per_shot'
    | 'emp'
    | 'impact'
    | 'turn_rate'
    | 'op_cost'
    | 'flux_per_shot'
    | 'chargeup'
    | 'chargedown'
    | 'burst_size'
    | 'burst_delay'
    | 'min_spread'
    | 'max_spread'
    | 'spread_per_shot'
    | 'spread_decay_per_second'
    | 'base_value'
    | 'speed'
    | 'launch_speed'
    | 'flight_time'
    | 'hitpoints'
    | 'max_ammo'
    | 'ammo_per_second'
    | 'reload_size'
    | 'beam_speed'
    | 'damage_per_second'
    | 'flux_per_second'
>;

export type WeaponText = Pick<
    FullWeaponVersion,
    | 'display_name'
    | 'manufacturer'
    | 'primary_role_str'
    | 'proj_speed_str'
    | 'tracking_str'
    | 'turn_rate_str'
    | 'accuracy_str'
    | 'custom_primary'
    | 'custom_primary_hl'
    | 'custom_ancillary'
    | 'custom_ancillary_hl'
    | 'no_dps_tooltip'
>;

export type WeaponDesc = Pick<FullWeaponVersion, 'text1' | 'text2'>;

export type WeaponArrays = Pick<FullWeaponVersion, 'hints' | 'groups' | 'tags'>;

export type TableWeapon = Mod &
    WeaponSpecs &
    WeaponStats &
    Pick<WeaponText, 'display_name' | 'manufacturer'> &
    Pick<FullWeaponVersion, 'weapon_id'>;

export type DisplayWeapon = FullWeaponVersion;
