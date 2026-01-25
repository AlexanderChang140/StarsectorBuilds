import z from 'zod';

import type { DB } from '../../db/db.js';
import type { SelectableRow } from '../../db/types.ts';
import type { Nullable } from '../../types/generic.ts';
import { schemaForTable } from '../../utils/zod.ts';

export const ModsSchema = schemaForTable<Nullable<SelectableRow<DB['mods']>>>()(
    z.object({
        code: z.string().nullable(),
        display_name: z.string().nullable(),
        id: z.coerce.number().nullable(),
    }),
);

export const ModVersionsFullSchema = schemaForTable<
    SelectableRow<DB['mod_versions_full']>
>()(
    z.object({
        data_changed: z.coerce.boolean().nullable(),
        major: z.coerce.number().nullable(),
        minor: z.coerce.number().nullable(),
        mod_code: z.string().nullable(),
        mod_id: z.coerce.number().nullable(),
        mod_name: z.string().nullable(),
        mod_version_id: z.coerce.number().nullable(),
        patch: z.string().nullable(),
    }),
);
