import { useSearchParams } from 'react-router';

import { DataTable } from '@/components/DataTable/DataTable';
import DataTableFilters, {
    type TableFilter,
} from '@/components/DataTable/DataTableFilters';
import { SHIP_TABLE_ROW_KEYS, type ShipTableRows } from '@/modules/ships/types';
import { DataTable } from '@/pages/DataTable/DataTable';
import { humanizeKeys } from '@/utils/humanizeKeys';

export default function ShipTable() {
    return DataTable<
        ShipTableRows,
        typeof SHIP_TABLE_ROW_KEYS,
        typeof KEY_ORDER
    >({
        dataConfig: {
            endpoint: '/api/ship-versions',
            queryKey: 'shipsTable',
            initialSort: { sortField: 'display_name', sortOrder: 'ASC' },
        },
        tableConfig: {
            displayMap,
            tableKeys: SHIP_TABLE_ROW_KEYS,
            keyOrder: KEY_ORDER,
        },
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
