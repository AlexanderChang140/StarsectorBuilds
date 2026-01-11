import type { ModDTO, ModVersionDTO } from '@shared/mods/types.ts';
import type { Projection } from '@shared/types.ts';
import type { PoolClient } from 'pg';

import { MOD_COLUMNS, MOD_VERSION_FULL_COLUMNS } from './constants.ts';
import { pool } from '../../db/client.ts';
import type { DB } from '../../db/db.js';
import { makeInsertReturn } from '../../db/helpers/insert.ts';
import {
    selectFullWithCount,
    type PaginatedResult,
} from '../../db/helpers/select.ts';
import type { Options } from '../../types/generic.ts';
import { assertProjectionRowsNonNullableKeys } from '../../utils/assert.ts';
import {
    sanitizeAll,
    sanitizeFilter,
    sanitizeLimit,
    sanitizeOffset,
    sanitizeOrder,
} from '../../utils/sanitize.ts';

export async function fetchMods<
    TSelection extends readonly (keyof DB['mods'])[],
>(
    selection: TSelection,
    options: Options<DB['mods']>,
): Promise<PaginatedResult<Projection<ModDTO, TSelection>>> {
    const safeOptions = sanitizeAll(options, MOD_COLUMNS);

    const result = await getMods(selection, safeOptions);

    return result;
}

export async function fetchModVersions<
    TSelection extends readonly (keyof DB['mod_versions_full'])[],
>(
    selection: TSelection,
    options: Options<DB['mod_versions_full']>,
): Promise<PaginatedResult<Projection<ModVersionDTO, TSelection>>> {
    const safeOptions = sanitizeAll(options, MOD_VERSION_FULL_COLUMNS);

    const result = await getModVersionsFull(selection, safeOptions);

    return result;
}

export async function searchModsByDisplayName<
    TSelection extends readonly (keyof DB['mods'])[],
>(
    displayName: string,
    selection: TSelection,
    options: Options<DB['mods']>,
): Promise<PaginatedResult<Projection<ModDTO, TSelection>>> {
    const safeOptions: Options<DB['mods']> = {
        filter: {
            ...sanitizeFilter(options.filter, MOD_COLUMNS),
            display_name: {
                values: [displayName],
                match: 'starts_with',
            },
        },
        order: sanitizeOrder(options.order),
        limit: sanitizeLimit(options.limit, 20),
        offset: sanitizeOffset(options.offset),
        client: options.client,
    };

    const result = await getMods(selection, safeOptions);

    return result;
}

export async function getMods<TSelection extends readonly (keyof DB['mods'])[]>(
    selection: TSelection,
    options: Options<DB['mods']>,
) {
    const result = await selectFullWithCount('mods', selection, options);
    assertProjectionRowsNonNullableKeys(result.rows, ['id', 'code']);
    return { rows: result.rows, total: result.total };
}

const REQUIRED_MOD_VERSION_KEYS = [
    'mod_version_id',
    'major',
    'minor',
    'patch',
    'data_changed',
    'mod_id',
    'mod_code',
] as const satisfies readonly (keyof DB['mod_versions_full'])[];

export async function getModVersionsFull<
    TSelection extends readonly (keyof DB['mod_versions_full'])[],
>(selection: TSelection, options: Options<DB['mod_versions_full']>) {
    const result = await selectFullWithCount(
        'mod_versions_full',
        selection,
        options,
    );
    assertProjectionRowsNonNullableKeys(result.rows, REQUIRED_MOD_VERSION_KEYS);
    return { rows: result.rows, total: result.total };
}

export async function getModVersion(
    code: string,
    major: number,
    minor: number,
    patch: string,
): Promise<DB['mod_versions'] | null> {
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
    const result = await pool.query<DB['mod_versions']>(query, [
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

export const insertMod = makeInsertReturn('mods', ['code']);

export const insertModVersion = makeInsertReturn('mod_versions', [
    'mod_id',
    'major',
    'minor',
    'patch',
]);
