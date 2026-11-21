// TODO: Change to lowercase to match DB
const EXPANDED_WEAPON_TYPES: Record<string, string[]> = {
    ballistic: ['BALLISTIC', 'HYBRID', 'COMPOSITE', 'UNIVERSAL'],
    energy: ['ENERGY', 'HYBRID', 'SYNERGY', 'UNIVERSAL'],
    missile: ['MISSILE', 'COMPOSITE', 'SYNERGY', 'UNIVERSAL'],
    hybrid: ['BALLISTIC', 'ENERGY', 'HYBRID', 'SYNERGY', 'UNIVERSAL'],
    composite: ['BALLISTIC', 'MISSILE', 'COMPOSITE', 'UNIVERSAL'],
    synergy: ['ENERGY', 'MISSILE', 'SYNERGY', 'UNIVERSAL'],
    universal: [
        'BALLISTIC',
        'ENERGY',
        'MISSILE',
        'HYBRID',
        'COMPOSITE',
        'SYNERGY',
        'UNIVERSAL',
    ],
};

export function expandWeaponType(weaponType: string): string[] {
    return EXPANDED_WEAPON_TYPES[weaponType.toLowerCase()] ?? [weaponType];
}

// TODO: Change to lowercase to match DB
const EXPANDED_WEAPON_SIZES: Record<string, string[]> = {
    small: ['SMALL'],
    medium: ['SMALL', 'MEDIUM'],
    large: ['MEDIUM', 'LARGE'],
};

export function expandWeaponSize(weaponSize: string): string[] {
    return EXPANDED_WEAPON_SIZES[weaponSize.toLowerCase()] ?? [weaponSize];
}
