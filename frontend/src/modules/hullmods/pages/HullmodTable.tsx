import { DataTable } from '../../../components/table/DataTable';
import type { TableHullmod } from '../types';

export default function HullmodTable() {
    return DataTable({
        endpoint: '/api/hullmods',
        displayMap,
        keyOrder,
        initialSort: { sortField: 'display_name', sortOrder: 'ASC' },
        link: {
            linkField: 'display_name',
            linkFn: (row) => `/hullmods/${row.hullmod_id}`,
        },
        title: 'Hullmods',
    });
}

const displayMap: Partial<Record<keyof TableHullmod, string>> = {
    display_name: 'Name',
    manufacturer: 'Manufacturer',
    base_value: 'Base Value',
    cost_frigate: 'Frigate Cost',
    cost_destroyer: 'Destroyer Cost',
    cost_cruiser: 'Cruiser Cost',
    cost_capital: 'Capital Cost',
};

const keyOrder: (keyof typeof displayMap)[] = [
    'display_name',
    'manufacturer',
    'base_value',
    'cost_frigate',
    'cost_destroyer',
    'cost_cruiser',
    'cost_capital',
];
