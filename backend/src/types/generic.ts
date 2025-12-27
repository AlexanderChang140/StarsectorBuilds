import type { PoolClient } from 'pg';
import type QueryString from 'qs';
import type { ParsedQs } from 'qs';

import type { ColumnOrder } from '../db/fragments/order.ts';
import type { Filter } from '../db/helpers/filter.ts';

export type Entries<T> = [keyof T, T[keyof T]][];

export type ReqQuery = ParsedQs | QueryString.ParsedQs;

export type Prettify<T> = {
    [K in keyof T]: Prettify<T[K]>;
} & {};

export type Options<T> = {
    fields?: readonly (keyof T)[];
    filter?: Filter<T>;
    order?: ColumnOrder<T>;
    limit?: number;
    offset?: number;
    client?: PoolClient;
};
