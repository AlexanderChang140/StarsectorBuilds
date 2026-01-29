import type { ReqQuery } from '../../../types/generic.ts';
import { parseFilterWithExcludedKeys } from '../../../utils/parser/filterParser.ts';
import { MOD_COLUMNS, MOD_VERSION_FULL_COLUMNS } from '../constants.ts';
import { ModsSchema, ModVersionsFullSchema } from '../schema.ts';

export function parseModsFilter<
    TExcludeKeys extends readonly (typeof MOD_COLUMNS)[number][],
>(query: ReqQuery, excludeKeys?: TExcludeKeys) {
    return parseFilterWithExcludedKeys(
        query,
        ModsSchema,
        MOD_COLUMNS,
        excludeKeys,
    );
}

export function parseModVersionsFilter<
    TExcludeKeys extends readonly (typeof MOD_VERSION_FULL_COLUMNS)[number][],
>(query: ReqQuery, excludeKeys?: TExcludeKeys) {
    return parseFilterWithExcludedKeys(
        query,
        ModVersionsFullSchema,
        MOD_VERSION_FULL_COLUMNS,
        excludeKeys,
    );
}
