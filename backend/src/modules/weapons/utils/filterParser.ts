import type { DB } from '../../../db/db.js';
import type { ReqQuery } from '../../../types/generic.ts';
import {
    parseFilterWithExcludedKeys,
} from '../../../utils/parser/filterParser.ts';
import { WEAPON_VERSIONS_FULL_COLUMNS } from '../constants.ts';

export function parseWeaponsVersionsFilter<
    TExcludeKeys extends readonly (typeof WEAPON_VERSIONS_FULL_COLUMNS)[number][],
>(query: ReqQuery, excludeKeys?: TExcludeKeys) {
    return parseFilterWithExcludedKeys<
        DB['weapon_versions_full'],
        typeof WEAPON_VERSIONS_FULL_COLUMNS,
        TExcludeKeys
    >(query, WEAPON_VERSIONS_FULL_COLUMNS, excludeKeys);
}
