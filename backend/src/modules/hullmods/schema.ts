import z from 'zod';

import type { DB } from '../../db/db.js';
import type { SelectableRow } from '../../db/types.ts';
import { schemaForTable } from '../../utils/zod.ts';

export const HullmodVersionsFullSchema = schemaForTable<
    SelectableRow<DB['hullmod_versions_full']>
>()(
    z.object({
        base_value: z.coerce.number().nullable(),

        cost_capital: z.coerce.number().nullable(),
        cost_cruiser: z.coerce.number().nullable(),
        cost_destroyer: z.coerce.number().nullable(),
        cost_frigate: z.coerce.number().nullable(),

        data_hash: z.coerce.string().nullable(),
        display_name: z.coerce.string().nullable(),

        hide: z.coerce.boolean().nullable(),
        hide_everywhere: z.coerce.boolean().nullable(),

        hullmod_code: z.coerce.string().nullable(),
        hullmod_desc: z.coerce.string().nullable(),

        hullmod_id: z.coerce.number().nullable(),
        hullmod_image_file_path: z.coerce.string().nullable(),
        hullmod_instance_id: z.coerce.number().nullable(),
        hullmod_version_id: z.coerce.number().nullable(),

        major: z.coerce.number().nullable(),
        manufacturer: z.coerce.string().nullable(),
        minor: z.coerce.number().nullable(),

        mod_id: z.coerce.number().nullable(),
        mod_name: z.coerce.string().nullable(),
        mod_version_id: z.coerce.number().nullable(),

        patch: z.coerce.string().nullable(),

        tags: z.array(z.coerce.string()).nullable(),
        ui_tags: z.array(z.coerce.string()).nullable(),
    }),
);
