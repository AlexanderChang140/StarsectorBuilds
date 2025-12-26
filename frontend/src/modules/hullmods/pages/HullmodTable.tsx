import type { HullmodVersionDTO } from '@shared/hullmods/types';

import { DataTable } from '../../../components/table/DataTable';
import { humanizeKeys } from '../../../utils/humanizeKeys';

export default function HullmodTable() {
    return DataTable<HullmodVersionDTO, typeof keyOrder>({
        endpoint: '/api/hullmods/table',
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

const keyOrder = [
    'display_name',
    'manufacturer',
    'base_value',
    'cost_frigate',
    'cost_destroyer',
    'cost_cruiser',
    'cost_capital',
] as const satisfies (keyof HullmodVersionDTO)[];

const displayMap = humanizeKeys(keyOrder);
