import type { DB } from '../../../db/db.js';
import type { ReqQuery } from '../../../types/generic.ts';
import {
    parseFilter,
    parseIntArray,
} from '../../../utils/parser/filterParser.ts';

const TABLE_WEAPONS_FILTER_MAP = {
    modVersionId: 'mod_version_id',
    weaponType: 'weapon_type',
    weaponSize: 'weapon_size',
} as const satisfies Record<string, keyof DB['weapon_versions_full']>;

export function parseTableWeaponsFilter(query: ReqQuery) {
    return parseFilter(query, TABLE_WEAPONS_FILTER_MAP, parseIntArray);
}
