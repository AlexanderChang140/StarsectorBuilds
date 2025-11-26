const WING_FORMATION_LIST = ['BOX', 'CLAW', 'DIAMOND', 'V'] as const;

export type WingFormation = (typeof WING_FORMATION_LIST)[number];

const WING_FORMATIONS = new Set<string>(WING_FORMATION_LIST);

export function isWingFormation(value: unknown): value is WingFormation {
    return typeof value === 'string' && WING_FORMATIONS.has(value);
}

const WING_ROLE_LIST = [
    'ASSAULT',
    'BOMBER',
    'FIGHTER',
    'PHASE',
    'INTERCEPTOR',
    'SUPPORT',
] as const;

export type WingRole = (typeof WING_ROLE_LIST)[number];

const WING_ROLES = new Set<string>(WING_ROLE_LIST);

export function isWingRole(value: unknown): value is WingRole {
    return typeof value === 'string' && WING_ROLES.has(value);
}
