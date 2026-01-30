import type { DB } from '../../../db/db.js';
import {
    parseSort,
    type SortableColumnKeys,
} from '../../../server/parser/sortParser.ts';
import type { ReqQuery } from '../../../types/generic.ts';
import { removeArrayKeys } from '../../../utils/helpers.ts';
import { SHIP_VERSIONS_FULL_COLUMNS } from '../constants.ts';

const SHIP_VERSIONS_SORT_COLUMNS = removeArrayKeys(SHIP_VERSIONS_FULL_COLUMNS, [
    'tags',
    'hints',
]) satisfies SortableColumnKeys<DB['ship_versions_full']>;

export function parseShipVersionsSort(query: ReqQuery) {
    return parseSort(query, SHIP_VERSIONS_SORT_COLUMNS);
}
