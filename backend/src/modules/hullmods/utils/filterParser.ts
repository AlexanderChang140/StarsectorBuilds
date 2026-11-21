import { HullmodVersionFullSchema } from '@starsector-builds/shared/hullmods/types';

import type { HullmodVersionsFullRow } from '../../../db/tables.ts';
import {
    parseFilterWithExcludedKeys,
} from '../../../server/parser/filterParser.ts';
import { type FilterableColumnKeys } from '../../../db/helpers/filter.ts';
import type { ReqQuery } from '../../../types/generic.ts';
import { removeArrayKeys } from '../../../utils/helpers.ts';
import { HULLMOD_VERSIONS_FULL_COLUMNS } from '../constants.ts';

const HULLMOD_VERSIONS_FILTER_COLUMNS = removeArrayKeys(
    HULLMOD_VERSIONS_FULL_COLUMNS,
    ['tags', 'ui_tags'],
) satisfies FilterableColumnKeys<HullmodVersionsFullRow>;

export function parseHullmodVersionFilter<
    TExcludeKeys extends
        readonly (typeof HULLMOD_VERSIONS_FILTER_COLUMNS)[number][],
>(query: ReqQuery, excludeKeys?: TExcludeKeys) {
    return parseFilterWithExcludedKeys(
        query,
        HullmodVersionFullSchema,
        HULLMOD_VERSIONS_FILTER_COLUMNS,
        excludeKeys,
    );
}
