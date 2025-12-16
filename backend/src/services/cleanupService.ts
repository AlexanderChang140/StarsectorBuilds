import type { PoolClient } from 'pg';

import { pool } from '../db/client.ts';

/**
 * Deletes  a mod from the database and performs cleanup operations.
 *
 * @param modCode - The unique code identifying the mod to delete.
 * @throws {Error} Error if deletion or cleanup fails
 */
export async function deleteMod(modCode: string) {
    const query = `
        DELETE FROM mods
        WHERE code = $1;
    `;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await executeAll(client, [query], [[modCode]]);
        await executeAll(client, CLEANUP_QUERIES);
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw new Error(`Failed to delete mod: ${modCode}`, { cause: err });
    } finally {
        client.release();
    }
}

/**
 * Deletes a specific version of a mod from the database and performs cleanup operations.
 *
 * @param modCode - The unique code identifying the mod.
 * @param major - The major version number of the mod to delete.
 * @param minor - The minor version number of the mod to delete.
 * @param patch - The patch version string of the mod to delete.
 * @throws Error if deletion or cleanup fails.
 */
export async function deleteModVersion(
    modCode: string,
    major: number,
    minor: number,
    patch: string,
): Promise<void> {
    const query = `
        DELETE FROM mod_versions mv
        WHERE EXISTS (
            SELECT 1
            FROM mods m
            WHERE m.id = mv.mod_id
                AND code = $1
        ) 
        AND major = $2 
        AND minor = $3 
        AND patch = $4;
    `;
    try {
        await withTransaction(async (client) => {
            await client.query(query, [modCode, major, minor, patch]);
            await executeAll(client, CLEANUP_QUERIES);
        });
    } catch (err) {
        throw new Error(
            `Failed to delete mod version: ${modCode} ${major}.${minor}.${patch}`,
            { cause: err },
        );
    }
}

async function withTransaction<T>(
    fn: (client: PoolClient) => Promise<T>,
): Promise<T> {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await fn(client);
        await client.query('COMMIT');
        return result;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

async function executeAll(
    client: PoolClient,
    queries: string[],
    values: (string | number)[][] = [],
): Promise<void> {
    for (let i = 0; i < queries.length; i++) {
        const q = queries[i]!;
        await client.query(q, values[i]);
    }
}

export async function cleanup(): Promise<void> {
    await withTransaction(async (client) => {
        await executeAll(client, CLEANUP_QUERIES);
    });
}

/**
 * Tables must be cleaned from most-dependent
 * to least-dependent.
 * Tags/groups/hints are fully independent.
 */
const CLEANUP_QUERIES = [
    cleanupImagesQuery(),
    cleanupWeaponHintsQuery(),
    cleanupWeaponTagsQuery(),
    cleanupWeaponGroupsQuery(),
    cleanupHullUiTagsQuery(),
    cleanupShipTagsQuery(),
];

interface TableReference {
    table: string;
    column: string;
}

/**
 * Generates a SQL DELETE query that removes rows from a specified table
 * where no references exist in one or more related tables.
 *
 * @param fromTable - The name of the table from which rows will be deleted.
 * @param fromColumn - The column in the source table to check for references.
 * @param whereReferences - An array of objects specifying the reference tables and columns to check for existence.
 * Each object should have a `table` and `column` property.
 * @returns A SQL DELETE query string that deletes rows from `fromTable` where no corresponding references exist in the specified tables.
 * @throws Error if `whereReferences` is empty.
 */
function cleanupTablesQuery(
    fromTable: string,
    fromColumn: string,
    whereReferences: TableReference[],
): string {
    if (whereReferences.length === 0) {
        throw new Error('Must provide at least one reference table');
    }

    const whereClause = whereReferences
        .map(
            (w) =>
                `NOT EXISTS(SELECT 1 FROM ${w.table} WHERE ${w.table}.${w.column} = ${fromTable}.${fromColumn})`,
        )
        .join(' AND ');
    const query = `
        DELETE FROM ${fromTable}
        WHERE ${whereClause};
    `;
    return query;
}

function cleanupImagesQuery(): string {
    return cleanupTablesQuery('images', 'id', [
        { table: 'weapon_versions', column: 'turret_image_id' },
        { table: 'weapon_versions', column: 'turret_gun_image_id' },
        { table: 'weapon_versions', column: 'hardpoint_image_id' },
        { table: 'weapon_versions', column: 'hardpoint_gun_image_id' },

        { table: 'hullmod_versions', column: 'hullmod_image_id' },
        { table: 'ship_system_versions', column: 'ship_system_image_id' },
        { table: 'ship_versions', column: 'ship_image_id' },
    ]);
}

function cleanupWeaponHintsQuery(): string {
    return cleanupTablesQuery('weapon_hints', 'id', [
        { table: 'weapon_hint_junction', column: 'hint_id' },
    ]);
}

function cleanupWeaponTagsQuery(): string {
    return cleanupTablesQuery('weapon_tags', 'id', [
        { table: 'weapon_tag_junction', column: 'tag_id' },
    ]);
}

function cleanupWeaponGroupsQuery(): string {
    return cleanupTablesQuery('weapon_groups', 'id', [
        { table: 'weapon_group_junction', column: 'group_id' },
    ]);
}

function cleanupHullUiTagsQuery(): string {
    return cleanupTablesQuery('hullmod_ui_tags', 'id', [
        { table: 'hullmod_ui_tag_junction', column: 'tag_id' },
    ]);
}

function cleanupShipTagsQuery(): string {
    return cleanupTablesQuery('ship_tags', 'id', [
        { table: 'ship_tag_junction', column: 'tag_id' },
    ]);
}
