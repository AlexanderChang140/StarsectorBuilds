const WEAPON_TYPE_LIST = [
    'BALLISTIC',
    'ENERGY',
    'MISSILE',
    'HYBRID',
    'COMPOSITE',
    'SYNERGY',
    'UNIVERSAL',
    'LAUNCH_BAY',
    'SYSTEM',
    'DECORATIVE',
    'BUILT_IN',
    'STATION_MODULE',
] as const;

export type WeaponType = (typeof WEAPON_TYPE_LIST)[number];

const WEAPON_TYPES = new Set<string>(WEAPON_TYPE_LIST);

export function isWeaponType(value: unknown): value is WeaponType {
    return typeof value === 'string' && WEAPON_TYPES.has(value);
}

const WEAPON_SIZE_LIST = ['SMALL', 'MEDIUM', 'LARGE'] as const;

export type WeaponSize = (typeof WEAPON_SIZE_LIST)[number];

const WEAPON_SIZES = new Set<string>(WEAPON_SIZE_LIST);

export function isWeaponSize(value: unknown): value is WeaponSize {
    return typeof value === 'string' && WEAPON_SIZES.has(value);
}

const DAMAGE_TYPE_LIST = [
    'KINETIC',
    'ENERGY',
    'HIGH_EXPLOSIVE',
    'FRAGMENTATION',
] as const;

export type DAMAGE_TYPES = (typeof DAMAGE_TYPE_LIST)[number];

const DAMAGE_TYPES = new Set<string>(DAMAGE_TYPE_LIST);

export function isDamageType(value: unknown): value is DAMAGE_TYPES {
    return typeof value === 'string' && DAMAGE_TYPES.has(value);
}
