import type { DB } from '../../../db/db.js';
import type { ReqQuery } from '../../../types/generic.ts';
import { parseFields } from '../../../utils/parser/fieldParser.ts';
import { SHIP_VERSIONS_FULL_COLUMNS } from '../constants.ts';

export function parseShipVersionFields(query: ReqQuery) {
    return parseFields<
        DB['ship_versions_full'],
        typeof SHIP_VERSIONS_FULL_COLUMNS
    >(query, SHIP_VERSIONS_FULL_COLUMNS);
}
