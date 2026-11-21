import type { ModDTO, ModVersionDTO } from '@starsector-builds/shared/mods/types';
import type { Projection } from '@starsector-builds/shared/types';
import type { PoolClient } from 'pg';

import { MOD_COLUMNS, MOD_VERSION_FULL_COLUMNS } from './constants.ts';
import { pool } from '../../db/client.ts';
import { makeInsertReturn } from '../../db/helpers/insert.ts';
import {
    selectWithCount,
    type PaginatedResult,
} from '../../db/helpers/select.ts';
import type {
    ModsRow,
    ModVersionsFullRow,
    ModVersionsRow,
} from '../../db/tables.ts';
import type { Options } from '../../db/types.ts';
import {
    sanitizeAll,
    sanitizeFilter,
    sanitizeLimit,
    sanitizeOffset,
    sanitizeOrder,
} from '../../server/sanitize.ts';
import { assertProjectionRowsNonNullableKeys } from '../../utils/assert.ts';

export async function fetchMods<TSelection extends readonly (keyof ModsRow)[]>(
    selection: TSelection,
    options: Options<ModsRow>,
): Promise<PaginatedResult<Projection<ModDTO, TSelection>>> {
    const safeOptions = sanitizeAll(options, MOD_COLUMNS);

    const result = await getMods(selection, safeOptions);

    return result;
}

export async function fetchModVersions<
    TSelection extends readonly (keyof ModVersionsFullRow)[],
>(
    selection: TSelection,
    options: Options<ModVersionsFullRow>,
): Promise<PaginatedResult<Projection<ModVersionDTO, TSelection>>> {
    const safeOptions = sanitizeAll(options, MOD_VERSION_FULL_COLUMNS);

    const result = await getModVersionsFull(selection, safeOptions);

    return result;
}

export async function searchModsByDisplayName<
    TSelection extends readonly (keyof ModsRow)[],
>(
    displayName: string,
    selection: TSelection,
    options: Options<ModsRow>,
): Promise<PaginatedResult<Projection<ModDTO, TSelection>>> {
    const safeOptions: Options<ModsRow> = {
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

export async function getMods<TSelection extends readonly (keyof ModsRow)[]>(
    selection: TSelection,
    options: Options<ModsRow>,
) {
    const result = await selectWithCount('mods', selection, options);
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
] as const satisfies readonly (keyof ModVersionsFullRow)[];

export async function getModVersionsFull<
    TSelection extends readonly (keyof ModVersionsFullRow)[],
>(selection: TSelection, options: Options<ModVersionsFullRow>) {
    const result = await selectWithCount(
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
): Promise<ModVersionsRow | null> {
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
    const result = await pool.query<ModVersionsRow>(query, [
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
