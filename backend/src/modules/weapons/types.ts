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

export type PreparedWeaponInstance = {
    data_hash: string;
};

export type PreparedWeaponSpecs = {
    weapon_type: string;
    weapon_size: string;
    damage_type: string;
};

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

export type PreparedWeaponText = {
    display_name: string | null;
    manufacturer: string | null;
    primary_role_str: string | null;
    proj_speed_str: string | null;
    tracking_str: string | null;
    turn_rate_str: string | null;
    accuracy_str: string | null;
    custom_primary: string | null;
    custom_primary_hl: string | null;
    custom_ancillary: string | null;
    custom_ancillary_hl: string | null;
    no_dps_tooltip: boolean;
};

export type PreparedWeaponDesc = {
    text1: string | null;
    text2: string | null;
};

export type PreparedProjWeapon = {
    speed: number | null;
    launch_speed: number | null;
    flight_time: number | null;
    hitpoints: number | null;
};

export type PreparedAmmoWeapon = {
    max_ammo: number;
    ammo_per_second: number | null;
    reload_size: number | null;
};

export type PreparedBeamWeapon = {
    beam_speed: number | null;
    damage_per_second: number | null;
    flux_per_second: number | null;
};
