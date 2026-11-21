import type { ParsedQs } from 'qs';

export type Entries<T> = [keyof T, T[keyof T]][];

export type ReqQuery = ParsedQs;

export type QueryParam = string | ParsedQs | (string | ParsedQs)[] | undefined;

export type Nullable<T> = {
    [K in keyof T]: T[K] | null;
};

export type ReplaceKey<T, K extends keyof T, NewType> = {
    [P in keyof T]: P extends K ? NewType : T[P];
};
