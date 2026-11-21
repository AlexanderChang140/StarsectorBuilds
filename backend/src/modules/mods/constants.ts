import type { ModsRow, ModVersionsFullRow } from '../../db/tables.ts';

export const MOD_COLUMNS = [
    'id',
    'code',
    'display_name',
] as const satisfies readonly (keyof ModsRow)[];

export const MOD_VERSION_FULL_COLUMNS = [
    'mod_version_id',
    'major',
    'minor',
    'patch',
    'mod_id',
    'mod_name',
    'data_changed',
] as const satisfies readonly (keyof ModVersionsFullRow)[];
