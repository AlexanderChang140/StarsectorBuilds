import type { PoolClient } from 'pg';

import {
    createFilterCondition,
    createKeyedFilter,
} from '../../db/helpers/filter.ts';
import { makeInsertReturn } from '../../db/helpers/insert.ts';
import { makeSelectExists, select } from '../../db/helpers/select.ts';
import type { UsersRow } from '../../db/tables.ts';
import type { Options, Selection } from '../../db/types.ts';

export async function fetchUserById<TSelection extends Selection<UsersRow>>(
    selection: TSelection,
    userId: number,
) {
    const options: Options<UsersRow> = {
        filter: {
            id: createFilterCondition(userId),
        },
    };

    return getUser(selection, options);
}

export async function getUser<TSelection extends Selection<UsersRow>>(
    selection: TSelection,
    options?: Options<UsersRow>,
) {
    const result = await select('users', selection, options);
    return result[0];
}

export function getUserExists(
    username: string,
    options?: { client: PoolClient },
) {
    return selectUserExists({
        where: createKeyedFilter('username', username),
        client: options?.client,
    });
}

export const selectUserExists = makeSelectExists('users');

export const insertUser = makeInsertReturn('users', ['username']);
