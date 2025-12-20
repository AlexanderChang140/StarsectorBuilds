import type { PoolClient } from 'pg';
import type QueryString from 'qs';
import type { ParsedQs } from 'qs';

import type { ArrayType, Generated, Numeric } from '../db/db.js';
import type { ColumnOrder } from '../db/fragments/order.ts';
import type { Filter } from '../db/helpers/filter.ts';

export type RenameKeys<T, M extends Record<string, string>> = {
    [K in keyof T as K extends keyof M ? M[K] : K]: T[K];
};

export type WithId<T> = T & { id: number };

export type Inserted = {
    inserted: boolean;
};

export type Order = 'ASC' | 'DESC';

export type Entries<T> = [keyof T, T[keyof T]][];

export type ReqQuery = ParsedQs | QueryString.ParsedQs;

export type Prettify<T> = {
    [K in keyof T]: Prettify<T[K]>;
} & {};

export type OmitGenerated<T> = {
    [K in keyof T as T[K] extends Generated<unknown> ? never : K]: T[K];
};

export type SelectValue<T> = T extends { __select__: infer S } ? S : T;

export type SelectableRow<T> = {
    [K in keyof T]: SelectValue<T[K]>;
};

type InsertableValue<T> = T extends Numeric
    ? number | string
    : T extends ArrayType<infer U>
    ? InsertableValue<U>[]
    : T extends { __insert__: infer I }
    ? I | null
    : T;

export type InsertableRow<T> = {
    [K in keyof T as T[K] extends { __insert__: never }
        ? never
        : K]?: InsertableValue<T[K]>;
};

export type Options<T> = {
    filter?: Filter<T>;
    order?: ColumnOrder<T>;
    limit?: number;
    offset?: number;
    client?: PoolClient;
};
