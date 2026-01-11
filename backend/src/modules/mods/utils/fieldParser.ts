import type { DB } from '../../../db/db.js';
import type { ReqQuery } from '../../../types/generic.ts';
import { parseFields } from '../../../utils/parser/fieldParser.ts';
import { MOD_COLUMNS, MOD_VERSION_FULL_COLUMNS } from '../constants.ts';

export function parseModsFields(query: ReqQuery) {
    return parseFields<DB['mods'], typeof MOD_COLUMNS>(query, MOD_COLUMNS);
}

export function parseModVersionsFields(query: ReqQuery) {
    return parseFields<
        DB['mod_versions_full'],
        typeof MOD_VERSION_FULL_COLUMNS
    >(query, MOD_VERSION_FULL_COLUMNS);
}
