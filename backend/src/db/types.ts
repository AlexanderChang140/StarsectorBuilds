import type { Numeric, ArrayType, Generated } from './db.js';

export type InsertableRow<T> = {
    [K in keyof T as T[K] extends { __insert__: never }
        ? never
        : K]?: InsertableValue<T[K]>;
};

export type InsertableValue<T> = T extends Numeric
    ? number | string
    : T extends ArrayType<infer U>
    ? InsertableValue<U>[]
    : T extends { __insert__: infer I }
    ? I | null
    : T;

export type SelectableRow<T> = {
    [K in keyof T]: SelectValue<T[K]>;
};

export type SelectValue<T> = T extends { __select__: infer S } ? S : T;

export type OmitGenerated<T> = {
    [K in keyof T as T[K] extends Generated<unknown> ? never : K]: T[K];
};

export type Selection<TRow> = readonly (keyof SelectableRow<TRow>)[];

export type AllowedKeys<TRow> =
    | readonly (keyof SelectableRow<TRow>)[]
    | undefined;

export type AllowedKey<TAllowedKeys, TRow> =
    TAllowedKeys extends readonly (infer K)[]
        ? K & keyof SelectableRow<TRow>
        : keyof SelectableRow<TRow>;

export type Inserted = {
    inserted: boolean;
};

export type Order = 'ASC' | 'DESC';
