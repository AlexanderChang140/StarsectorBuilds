const MOUNT_TYPE_LIST = ['TURRET', 'HARDPOINT', 'HIDDEN'] as const;

export type MountType = (typeof MOUNT_TYPE_LIST)[number];

const MOUNT_TYPES = new Set<string>(MOUNT_TYPE_LIST);

export function isMountType(value: unknown): value is MountType {
    return typeof value === 'string' && MOUNT_TYPES.has(value);
}

const SHIELD_TYPE_LIST = ['NONE', 'OMNI', 'FRONT', 'PHASE'] as const;

export type ShieldType = (typeof SHIELD_TYPE_LIST)[number];

const SHIELD_TYPES = new Set<string>(SHIELD_TYPE_LIST);

export function isShieldType(value: unknown): value is ShieldType {
    return typeof value === 'string' && SHIELD_TYPES.has(value);
}

const SHIP_SIZE_LIST = [
    'FIGHTER',
    'FRIGATE',
    'DESTROYER',
    'CRUISER',
    'CAPITAL_SHIP',
] as const;

export type ShipSize = (typeof SHIP_SIZE_LIST)[number];

const SHIP_SIZES = new Set<string>(SHIP_SIZE_LIST);

export function isShipSize(value: unknown): value is ShipSize {
    return typeof value === 'string' && SHIP_SIZES.has(value);
}
