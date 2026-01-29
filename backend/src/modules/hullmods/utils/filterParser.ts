import type { DB } from '../../../db/db.js';
import type { ReqQuery } from '../../../types/generic.ts';
import { removeArrayKeys } from '../../../utils/helpers.ts';
import {
    parseFilterWithExcludedKeys,
    type FilterableColumnKeys,
} from '../../../utils/parser/filterParser.ts';
import { HULLMOD_VERSIONS_FULL_COLUMNS } from '../constants.ts';
import { HullmodVersionsFullSchema } from '../schema.ts';

const HULLMOD_VERSIONS_FILTER_COLUMNS = removeArrayKeys(
    HULLMOD_VERSIONS_FULL_COLUMNS,
    ['tags', 'ui_tags', 'hide', 'hide_everywhere'],
) satisfies FilterableColumnKeys<DB['hullmod_versions_full']>;

export function parseHullmodVersionFilter<
    TExcludeKeys extends
        readonly (typeof HULLMOD_VERSIONS_FILTER_COLUMNS)[number][],
>(query: ReqQuery, excludeKeys?: TExcludeKeys) {
    return parseFilterWithExcludedKeys(
        query,
        HullmodVersionsFullSchema,
        HULLMOD_VERSIONS_FILTER_COLUMNS,
        excludeKeys,
    );
}
