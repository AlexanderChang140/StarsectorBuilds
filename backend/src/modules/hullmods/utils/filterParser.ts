import type { DB } from '../../../db/db.js';
import type { ReqQuery } from '../../../types/generic.ts';
import { parseFilterWithExcludedKeys } from '../../../utils/parser/filterParser.ts';
import { HULLMOD_VERSIONS_FULL_COLUMNS } from '../constants.ts';

export function parseHullmodVersionFilter<
    TExcludeKeys extends readonly (typeof HULLMOD_VERSIONS_FULL_COLUMNS)[number][],
>(query: ReqQuery, excludeKeys?: TExcludeKeys) {
    return parseFilterWithExcludedKeys<
        DB['hullmod_versions_full'],
        typeof HULLMOD_VERSIONS_FULL_COLUMNS,
        TExcludeKeys
    >(query, HULLMOD_VERSIONS_FULL_COLUMNS, excludeKeys);
}
