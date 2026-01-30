import type { DB } from '../../../db/db.js';
import { parseFields } from '../../../server/parser/fieldParser.ts';
import type { ReqQuery } from '../../../types/generic.ts';
import { WEAPON_VERSIONS_FULL_COLUMNS } from '../constants.ts';

export function parseWeaponVersionFields(query: ReqQuery) {
    return parseFields<
        DB['weapon_versions_full'],
        typeof WEAPON_VERSIONS_FULL_COLUMNS
    >(query, WEAPON_VERSIONS_FULL_COLUMNS);
}
