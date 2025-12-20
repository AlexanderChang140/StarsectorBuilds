import type { ShipVersionsFull } from '../../../db/db.js';
import type { ColumnOrder } from '../../../db/fragments/order.ts';
import type { ReqQuery } from '../../../types/generic.ts';
import { parseSort } from '../../../utils/parser/sortParser.ts';

export const SHIP_TABLE_KEYS = [
    'ship_size',
    'shield_type',
    'ship_system',

    'hitpoints',
    'armor_rating',
    'max_flux',
    'flux_dissipation',
    'op_cost',
    'fighter_bays',
    'max_speed',
    'acceleration',
    'deceleration',
    'max_turn_rate',
    'turn_acceleration',
    'mass',

    'display_name',
    'manufacturer',
    'designation',
    'base_value',

    'min_crew',
    'max_crew',
    'max_cargo',
    'max_fuel',
    'fuel_per_ly',
    'cr_recovery',
    'cr_deployment_cost',
    'peak_cr_sec',
    'cr_loss_per_sec',

    'shield_arc',
    'shield_upkeep',
    'shield_efficiency',

    'phase_cost',
    'phase_upkeep',
] as const satisfies (keyof ShipVersionsFull)[];

export function parseShipTableSort(
    query: ReqQuery,
): ColumnOrder<ShipVersionsFull> {
    return parseSort<ShipVersionsFull>(query, SHIP_TABLE_KEYS);
}
