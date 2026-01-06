import type { HullmodVersionDTO } from '@shared/hullmods/types';

import { DataTable } from '@/pages/DataTable/DataTable';
import {
    HULLMOD_TABLE_ROW_KEYS,
    type HullmodTableRows,
} from '@/modules/hullmods/types';
import { humanizeKeys } from '@/utils/humanizeKeys';


export default function HullmodTable() {
    return DataTable<
        HullmodTableRows,
        typeof HULLMOD_TABLE_ROW_KEYS,
        typeof KEY_ORDER
    >({
        endpoint: '/api/hullmod-versions',
        queryKey: 'hullmodsTable',
        tableKeys: HULLMOD_TABLE_ROW_KEYS,
        keyOrder: KEY_ORDER,
        displayMap,
        initialSort: { sortField: 'display_name', sortOrder: 'ASC' },
        link: {
            linkField: 'display_name',
            linkFn: (row) => `/hullmods/${row.hullmod_id}`,
        },
        title: 'Hullmods',
    });
}

const KEY_ORDER = [
    'display_name',
    'manufacturer',
    'base_value',
    'cost_frigate',
    'cost_destroyer',
    'cost_cruiser',
    'cost_capital',
] as const satisfies (keyof HullmodVersionDTO)[];

const displayMap = humanizeKeys(KEY_ORDER);
