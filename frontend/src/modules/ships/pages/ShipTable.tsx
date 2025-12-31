import { DataTable } from '@/components/table/DataTable';
import { SHIP_TABLE_ROW_KEYS, type ShipTableRows } from '@/modules/ships/types';
import { humanizeKeys } from '@/utils/humanizeKeys';

export default function ShipTable() {
    return DataTable<
        ShipTableRows,
        typeof SHIP_TABLE_ROW_KEYS,
        typeof KEY_ORDER
    >({
        endpoint: '/api/ship-versions',
        displayMap,
        tableKeys: SHIP_TABLE_ROW_KEYS,
        keyOrder: KEY_ORDER,
        initialSort: { sortField: 'display_name', sortOrder: 'ASC' },
        link: {
            linkField: 'display_name',
            linkFn: (row) =>
                `/ships/${Number(row.ship_id)}/${Number(row.ship_version_id)}`,
        },
        title: 'Ships',
    });
}

const KEY_ORDER = [
    'display_name',
    'manufacturer',
    'designation',
    'base_value',

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
] as const satisfies readonly (keyof ShipTableRows)[];

const displayMap = humanizeKeys(KEY_ORDER);
