import * as z from 'zod';
import { id, numberOrNull, stringOrNull } from '../zod.js';
import { keysOf } from '../utils.js';

export const WingVersionFullSchema = z.object({
    base_value: numberOrNull,
    capacitors: z.number(),
    data_hash: z.string(),
    deployment_range: z.number(),
    fighter_ship_code: z.string(),
    fighter_ship_id: id,
    formation: stringOrNull,
    formation_id: id.nullable(),
    major: z.number(),
    minor: z.number(),
    mod_id: id,
    mod_name: stringOrNull,
    mod_version_id: id,
    num_fighters: z.number(),
    op_cost: z.number(),
    patch: z.string(),
    refit_time: numberOrNull,
    role: stringOrNull,
    role_desc: stringOrNull,
    role_id: id,
    tags: z.array(z.string()).nullable(),
    vents: z.number(),
    wing_instance_id: id,
    wing_version_id: id,

    display_name: stringOrNull,
    ship_image_file_path: stringOrNull,
    manufacturer: stringOrNull,
    text1: stringOrNull,
    text2: stringOrNull,
    min_crew: numberOrNull,
    max_crew: numberOrNull,
    hitpoints: numberOrNull,
    armor_rating: numberOrNull,
    shield_type: stringOrNull,
    max_speed: numberOrNull,
});

export type WingVersionFull = z.infer<typeof WingVersionFullSchema>;

export const WING_KEYS = keysOf(WingVersionFullSchema.shape);
