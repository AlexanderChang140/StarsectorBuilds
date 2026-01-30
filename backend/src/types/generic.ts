import type { ParsedQs } from 'qs';

export type Entries<T> = [keyof T, T[keyof T]][];

export type ReqQuery = ParsedQs;

export type ReqQuery2<T extends Record<string, unknown>> = ParsedQs & {
    [K in keyof T]?: string | string[];
};

export type QueryParam = string | ParsedQs | (string | ParsedQs)[] | undefined;

export type Nullable<T> = {
    [K in keyof T]: T[K] | null;
};
