import * as z from 'zod';
import { id, numberOrNull, stringOrNull } from '../zod.js';
import { keysOf } from '../utils.js';

export const HullmodVersionFullSchema = z.object({
    mod_id: id,
    mod_name: stringOrNull,
    mod_version_id: id,
    hullmod_id: id,
    hullmod_instance_id: id,
    hullmod_version_id: id,
    hullmod_code: z.string(),
    data_hash: z.string(),

    display_name: stringOrNull,
    manufacturer: stringOrNull,
    hullmod_image_file_path: stringOrNull,
    hullmod_desc: stringOrNull,
    hullmod_desc_s_mod: stringOrNull,
    tags: z.array(z.string()).nullable(),
    ui_tags: z.array(z.string()).nullable(),

    major: z.number(),
    minor: z.number(),
    patch: z.string(),

    cost_frigate: z.number(),
    cost_destroyer: z.number(),
    cost_cruiser: z.number(),
    cost_capital: z.number(),
    base_value: numberOrNull,

    hide: z.boolean(),
    hide_everywhere: z.boolean(),
});

export type HullmodVersionFull = z.infer<typeof HullmodVersionFullSchema>;

export const HULLMOD_VERSION_FULL_KEYS = keysOf(HullmodVersionFullSchema.shape);

export type HullmodVersionFullKeys = typeof HULLMOD_VERSION_FULL_KEYS;
