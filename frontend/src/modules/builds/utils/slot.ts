export function isBuiltin(weaponType: string) {
    return weaponType.toLowerCase() === 'built_in';
}

export function isLaunchBay(weaponType: string) {
    return weaponType.toLowerCase() === 'launch_bay';
}
