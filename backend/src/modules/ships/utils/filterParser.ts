import type { ReqQuery } from '../../../types/generic.ts';
import {
    parseFilter,
    parseIntArray,
} from '../../../utils/parser/filterParser.ts';
import type { TABLE_SHIP_FILTER_KEYS } from '../service.ts';

const TABLE_SHIPS_FILTER_MAP = {
    modVersionId: 'mod_version_id',
    shipSize: 'ship_size',
} as const satisfies Record<string, (typeof TABLE_SHIP_FILTER_KEYS)[number]>;

export function parseTableShipsFilter(query: ReqQuery) {
    return parseFilter(query, TABLE_SHIPS_FILTER_MAP, parseIntArray);
}
