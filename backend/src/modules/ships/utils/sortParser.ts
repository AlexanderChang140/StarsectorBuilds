import type { ShipVersionsFull } from '../../../db/db.js';
import type { ColumnOrder } from '../../../db/fragments/order.ts';
import type { ReqQuery } from '../../../types/generic.ts';
import { parseSort } from '../../../utils/parser/sortParser.ts';
import { SHIP_VERSIONS_FULL_COLUMNS } from '../constants.ts';

export function parseShipVersionsSort(
    query: ReqQuery,
): ColumnOrder<ShipVersionsFull> {
    return parseSort<ShipVersionsFull>(query, SHIP_VERSIONS_FULL_COLUMNS);
}
