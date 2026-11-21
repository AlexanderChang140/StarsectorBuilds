import { z } from 'zod';
import {
    coercedId,
    id,
    idPairs,
    requiredString,
    stringOrNull,
} from '../zod.js';
import { keysOf } from '../utils.js';

export type BuildStats = z.infer<typeof BuildStatsSchema>;

export const BuildStatsSchema = z.object({
    vents: z.number().int().nonnegative(),
    capacitors: z.number().int().nonnegative(),
});

export type PreparedBuild = z.infer<typeof PreparedBuildSchema>;

export const PreparedBuildSchema = z.object({
    ship_version_id: coercedId,
    title: z.string().min(1).max(100),
    content: z.string().max(10000).optional(),

    stats: BuildStatsSchema,
    modVersions: z.array(id),
    weapons: z.record(z.string().transform(Number), id),
    wings: z.record(z.string().transform(Number), id),
    hullmods: z.record(z.string().transform(Number), z.boolean()),
});

export type BuildComment = z.infer<typeof BuildCommentSchema>;

export const BuildCommentSchema = z.object({
    user_id: id,
    build_id: id,
    content: z.string().min(1).max(2000),
});

export const BuildFullSchema = z.object({
    build_id: id,
    title: requiredString,
    content: stringOrNull,
    created_at: z.date(),
    updated_at: z.date(),
    user_id: id,
    username: requiredString,
    ship_id: id,
    ship_version_id: id,
    ship_instance_id: id,
    ship_code: requiredString,
    ship_name: stringOrNull,
    ship_image_file_path: stringOrNull,
    ship_size: requiredString,
    vents: z.int().nonnegative(),
    capacitors: z.int().nonnegative(),
    mod_versions: z.array(id),
    installed_weapons: idPairs,
    installed_wings: idPairs,
    installed_hullmods: z.array(id),
    built_in_hullmods: z.array(id),
});

export type BuildFull = z.infer<typeof BuildFullSchema>;

export const BUILD_FULL_KEYS = keysOf(BuildFullSchema.shape);
