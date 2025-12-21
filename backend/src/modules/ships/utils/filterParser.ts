import type { ReqQuery } from '../../../types/generic.ts';
import {
    parseFilter,
    parseIntArray,
} from '../../../utils/parser/filterParser.ts';

export function parseTableShipsFilter(query: ReqQuery) {
    return parseFilter(query, parseIntArray);
}
