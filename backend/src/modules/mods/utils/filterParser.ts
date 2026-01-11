import type { DB } from '../../../db/db.js';
import type { ReqQuery } from '../../../types/generic.ts';
import { parseFilterWithExcludedKeys } from '../../../utils/parser/filterParser.ts';
import { MOD_COLUMNS, MOD_VERSION_FULL_COLUMNS } from '../constants.ts';

export function parseModsFilter<
    TExcludeKeys extends readonly (typeof MOD_COLUMNS)[number][],
>(query: ReqQuery, excludeKeys?: TExcludeKeys) {
    return parseFilterWithExcludedKeys<
        DB['mods'],
        typeof MOD_COLUMNS,
        TExcludeKeys
    >(query, MOD_COLUMNS, excludeKeys);
}

export function parseModVersionsFilter<
    TExcludeKeys extends readonly (typeof MOD_VERSION_FULL_COLUMNS)[number][],
>(query: ReqQuery, excludeKeys?: TExcludeKeys) {
    return parseFilterWithExcludedKeys<
        DB['mod_versions_full'],
        typeof MOD_VERSION_FULL_COLUMNS,
        TExcludeKeys
    >(query, MOD_VERSION_FULL_COLUMNS, excludeKeys);
}
