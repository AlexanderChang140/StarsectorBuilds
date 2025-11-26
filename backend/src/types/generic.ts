import type QueryString from 'qs';
import type { ParsedQs } from 'qs';

export type RenameKeys<T, M extends Record<string, string>> = {
    [K in keyof T as K extends keyof M ? M[K] : K]: T[K];
};

export type WithId<T> = T & { id: number };

export type Id = {
    id: number;
};

export type Inserted = {
    inserted: boolean;
};

export type Code = {
    code: string;
};

export type CodeTable = Code & Id;

export type Order = 'ASC' | 'DESC';

export type Entries<T> = [keyof T, T[keyof T]][];

export type ReqQuery = ParsedQs | QueryString.ParsedQs;

export type Prettify<T> = {
    [K in keyof T]: Prettify<T[K]>;
} & {};
