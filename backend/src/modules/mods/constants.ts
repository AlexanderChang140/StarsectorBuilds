import type { DB } from '../../db/db.js';

export const MOD_COLUMNS = [
    'id',
    'code',
    'display_name',
] as const satisfies readonly (keyof DB['mods'])[];

export const MOD_VERSION_FULL_COLUMNS = [
    'mod_version_id',
    'major',
    'minor',
    'patch',
    'mod_id',
    'mod_name',
    'data_changed',
] as const satisfies readonly (keyof DB['mod_versions_full'])[];
