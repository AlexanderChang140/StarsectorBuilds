import type { PoolClient } from 'pg';

import { pool } from '../db/client.ts';
import { makeInsertReturn } from '../db/helpers/insert.ts';
import {
    type Mod,
    type ModVersion,
    type InsertedMod,
    type InsertedModVersion,
} from '../types/mod.ts';

export async function getMod() {}

export async function getModVersion(
    code: string,
    major: number,
    minor: number,
    patch: string,
): Promise<ModVersion | null> {
    const query = `
        SELECT 
            id
            mod_id
            major
            minor
            patch
            data_changes
        FROM modVersions mv
        WHERE mod_id = $1
            AND major = $2
            AND minor = $3
            AND patch = $4
        LIMIT 1;
    `;
    const result = await pool.query<ModVersion>(query, [
        code,
        major,
        minor,
        patch,
    ]);
    return result.rows[0] ?? null;
}

export async function getLatestModVersion(modCode: string) {
    const query = `
        SELECT * 
        FROM mod_versions mv
        WHERE mv.mod_code = $1
        ORDER BY mv.major DESC, mv.minor DESC, mv.patch DESC
        LIMIT 1;
    `;
    const result = await pool.query(query, [modCode]);
    return result.rows[0] || null;
}

export async function getLatestModifiedModVersion(modId: number) {
    const query = `
        SELECT id, mod_id, major, minor, patch
        FROM mod_versions
        WHERE mod_id = $1
            AND data_changed = TRUE
        ORDER BY major DESC, minor DESC, patch DESC
        LIMIT 1;
    `;
    const result = await pool.query(query, [modId]);
    return result.rows[0] || null;
}

export async function getPreviousModifiedModVersion(modVersionId: number) {
    const query = `
        SELECT * 
        FROM mod_versions mv
        WHERE mv.id = $1
            AND data_changed = TRUE
            AND mv.major < 
        ORDER BY mv.major DESC, mv.minor DESC, mv.patch DESC
        LIMIT 1;
    `;
    const result = await pool.query(query, [modVersionId]);
    return result.rows[0] || null;
}

export async function setDataChanged(modVersionId: number, client: PoolClient) {
    const query = `
        UPDATE mod_versions
        SET data_changed = TRUE
        WHERE id = $1;
    `;
    await client.query(query, [modVersionId]);
}

export const insertMod = makeInsertReturn<InsertedMod, Mod>('mods', ['code']);

export const insertModVersion = makeInsertReturn<
    InsertedModVersion,
    ModVersion
>('mod_versions', ['mod_id', 'major', 'minor', 'patch']);
