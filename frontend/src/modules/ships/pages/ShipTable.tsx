import type { ModDTO, ModVersionDTO } from '@shared/mods/types';
import { useSearchParams } from 'react-router';

import { DataTable } from '@/components/DataTable/DataTable';
import DataTableFilterChips from '@/components/DataTable/DataTableFilterChips';
import DataTableFilters, {
    type TableFilter,
} from '@/components/DataTable/DataTableFilters';
import { SHIP_TABLE_ROW_KEYS, type ShipTableRows } from '@/modules/ships/types';
import { humanizeKeys } from '@/utils/humanizeKeys';
import toVersionString from '@/utils/toVersionString';

export default function ShipTable() {
    const [searchParams, setSearchParams] = useSearchParams();
    const filters = (
        <DataTableFilters
            key={1}
            tableFilters={FILTERS}
            setSearchParams={setSearchParams}
        />
    );

    const filterChips = (
        <DataTableFilterChips<
            ModDTO,
            typeof MOD_KEYS,
            ModVersionDTO,
            typeof MOD_VERSION_KEYS
        >
            key={0}
            category={{
                categoryQueryKey: 'shipTableMods',
                categoryEndpoint: '/api/mods/search/display_name',
                categoryKeys: MOD_KEYS,
                categoryValueTransform: (mod) => String(mod.id),
                categoryLabelTransform: (mod) => String(mod.display_name),
            }}
            chips={{
                chipQueryKey: 'shipTableModVersions',
                chipEndpoint: '/api/mod-versions',
                chipKeys: MOD_VERSION_KEYS,
                chipFilterKey: 'mod_version_id',
                chipCategoryKey: 'mod_id',
                chipValueTransform: (v) => String(v.mod_version_id),
                chipLabelTransform: (v) =>
                    toVersionString(v.major, v.minor, v.patch),
                chipCategoryLabelTransform: (v) => v.mod_name ?? '',
                chipCategoryValueTransform: (v) => String(v.mod_id),
            }}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
        />
    );

    return (
        <DataTable<ShipTableRows, typeof SHIP_TABLE_ROW_KEYS, typeof KEY_ORDER>
            dataConfig={{
                endpoint: '/api/ship-versions',
                queryKey: 'shipsTable',
                initialSort: { sortField: 'display_name', sortOrder: 'ASC' },
            }}
            tableConfig={{
                displayMap,
                tableKeys: SHIP_TABLE_ROW_KEYS,
                keyOrder: KEY_ORDER,
            }}
            searchConfig={{
                externalSearchParams: searchParams,
                setExternalSearchParams: setSearchParams,
            }}
            filters={[filterChips, filters]}
            link={{
                linkField: 'display_name',
                linkFn: (row) =>
                    `/ships/${Number(row.ship_id)}/${Number(
                        row.ship_version_id,
                    )}`,
            }}
            title="Ships"
        ></DataTable>
    );
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

const FILTERS = [
    {
        field: 'ship_size',
        label: 'Ship Size',
        items: [
            { value: 'FRIGATE', label: 'FRIGATE' },
            { value: 'DESTROYER', label: 'DESTROYER' },
            { value: 'CRUISER', label: 'CRUISER' },
            { value: 'CAPITAL_SHIP', label: 'CAPITAL' },
        ],
        isMultiSelect: true,
    },
    {
        field: 'shield_type',
        label: 'Shield Type',
        items: [
            { value: 'NONE', label: 'NONE' },
            { value: 'OMNI', label: 'OMNI' },
            { value: 'FULL', label: 'FULL' },
            { value: 'PHASE', label: 'PHASE' },
        ],
        isMultiSelect: true,
    },
] as const satisfies readonly TableFilter[];

const MOD_KEYS = [
    'id',
    'display_name',
] as const satisfies readonly (keyof ModDTO)[];

const MOD_VERSION_KEYS = [
    'mod_id',
    'mod_name',
    'mod_version_id',
    'major',
    'minor',
    'patch',
] as const satisfies readonly (keyof ModVersionDTO)[];
