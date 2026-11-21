import z from 'zod';

import type { DB } from '../../db/db.js';
import type { SelectableRow } from '../../db/types.ts';
import { schemaForTable } from '../../utils/zod.ts';

export const ModsSchema = schemaForTable<SelectableRow<DB['mods']>>()(
    z.object({
        code: z.string(),
        display_name: z.string(),
        id: z.coerce.number(),
    }),
);

export const ModVersionsFullSchema = schemaForTable<
    SelectableRow<DB['mod_versions_full']>
>()(
    z.object({
        data_changed: z.stringbool().nullable(),
        major: z.coerce.number().nullable(),
        minor: z.coerce.number().nullable(),
        mod_code: z.string().nullable(),
        mod_id: z.coerce.number().nullable(),
        mod_name: z.string().nullable(),
        mod_version_id: z.coerce.number().nullable(),
        patch: z.string().nullable(),
    }),
);
