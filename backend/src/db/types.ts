import type { PoolClient } from 'pg';

import type { Numeric, Generated } from './db.js';
import type { ColumnOrder } from './fragments/order.ts';
import type { Filter } from './helpers/filter.ts';

export type TransformNumeric<T> = {
    [K in keyof T]: T[K] extends Numeric
        ? number
        : T[K] extends Numeric | null
          ? number | null
          : T[K] extends Numeric | undefined
            ? number | undefined
            : T[K] extends Numeric | null | undefined
              ? number | null | undefined
              : T[K];
};

type SelectValue<T> = T extends { __select__: infer S } ? S : T;

export type SelectableRow<T> = {
    [K in keyof T]: SelectValue<T[K]>;
};

export type FilterableRow<T> = SelectableRow<TransformNumeric<T>>;

type IsNullable<T> = null | undefined extends T ? true : false;

type InsertableValue<T> = T extends Numeric
    ? number | string
    : T extends { __insert__: infer I }
      ? I | null
      : T;

export type InsertableRow<T> = {
    [K in keyof T as T[K] extends { __insert__: never }
        ? never
        : IsNullable<InsertableValue<T[K]>> extends true
          ? never
          : K]: InsertableValue<T[K]>;
} & {
    [K in keyof T as T[K] extends { __insert__: never }
        ? never
        : IsNullable<InsertableValue<T[K]>> extends true
          ? K
          : never]?: InsertableValue<T[K]>;
};

// TODO: Remove unused
export type OmitGenerated<T> = {
    [K in keyof T as T[K] extends Generated<unknown> ? never : K]: T[K];
};

export type Selection<TRow> = readonly (keyof SelectableRow<TRow>)[];

// TODO: Remove unused
export type AllowedKeys<TRow> =
    | readonly (keyof SelectableRow<TRow>)[]
    | undefined;

// TODO: Remove unused
export type AllowedKey<TAllowedKeys, TRow> =
    TAllowedKeys extends readonly (infer K)[]
        ? K & keyof SelectableRow<TRow>
        : keyof SelectableRow<TRow>;

export type Order = 'ASC' | 'DESC';

export type QueryOrder<T> = ColumnOrder<FilterableRow<T>>;

export type QueryFilter<T> = Filter<FilterableRow<T>>;

export type Options<T> = {
    filter?: QueryFilter<T> | undefined;
    order?: QueryOrder<T> | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
    client?: PoolClient | undefined;
    isNullsLast?: boolean;
};

export type Inserted = {
    inserted: boolean;
};
