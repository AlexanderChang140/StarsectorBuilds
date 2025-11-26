export type WeaponFilter = WeaponTableFilter | WeaponDisplayFilter;

export const WEAPON_TABLE_FILTER_KEYS: (keyof WeaponTableFilter)[] = [
    'mod_version_id',
    'weapon_size_id',
    'weapon_type_id',
    'damage_type_id',
] as const;

export type WeaponTableFilter = {
    mod_version_id?: number[];
    weapon_size_id?: number[];
    weapon_type_id?: number[];
    damage_type_id?: number[];
};

export const WEAPON_DISPLAY_FILTER_KEYS: (keyof WeaponDisplayFilter)[] = [
    'weapon_id',
] as const;

export type WeaponDisplayFilter = {
    weapon_id?: number[];
};
