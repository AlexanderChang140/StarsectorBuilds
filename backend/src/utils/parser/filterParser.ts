import type z from 'zod';

import {
    MATCH_TYPES,
    type Filter,
    type FilterOptions,
    type MatchType,
} from '../../db/helpers/filter.ts';
import type { SelectableRow } from '../../db/types.ts';
import type { ReqQuery } from '../../types/generic.ts';
import {
    removeNull,
    removeUndefined,
    filterKeys,
    removeArrayKeys,
} from '../helpers.ts';
import { typedEntries } from '../object.ts';

export type FilterKeys<T> = {
    [K in keyof T]: T[K] extends string | number | boolean | null ? K : never;
}[keyof T];

export type FilterableColumnKeys<T> = readonly FilterKeys<SelectableRow<T>>[];

type RawFilter = { [K in keyof FilterOptions]?: unknown };

export function parseFilter<
    TData extends Record<string, unknown>,
    TKeys extends readonly FilterKeys<TData>[],
>(
    query: ReqQuery,
    validKeys: TKeys,
    schema: z.ZodObject<{ [K in keyof TData]: z.ZodType<TData[K]> }>,
): Filter<TData> {
    const cleanedQuery = removeNull(removeUndefined(query));
    const filteredQuery = filterKeys<TData>(cleanedQuery, validKeys);

    const filter: Filter<TData> = {};

    for (const [key, rawFilter] of typedEntries(filteredQuery)) {
        if (
            typeof rawFilter !== 'object' ||
            rawFilter === null ||
            !validKeys.includes(key as TKeys[number])
        )
            continue;

        const {
            values: rawValues,
            match: rawMatch,
            not: rawNot,
        } = rawFilter as RawFilter;

        if (rawValues == null) continue;

        const fieldSchema = schema.shape[key as keyof typeof schema.shape];
        const wrappedValues = Array.isArray(rawValues)
            ? rawValues
            : [rawValues];

        if (wrappedValues.length === 0) continue;

        const values = wrappedValues
            .filter((v) => v !== undefined && v !== null)
            .map((v) => fieldSchema.parse(v))
            .filter((v) => v != null);

        const match: MatchType =
            typeof rawMatch === 'string' &&
            MATCH_TYPES.includes(rawMatch as MatchType)
                ? (rawMatch as MatchType)
                : 'exact';

        const not = rawNot === 'true' || rawNot === true;

        filter[key] = { values: values as (string | number)[], match, not };
    }
    return filter;
}

export function parseFilterWithExcludedKeys<
    TData extends Record<string, unknown>,
    TKeys extends readonly FilterKeys<TData>[],
    TExcludeKeys extends readonly TKeys[number][] = [],
>(
    query: ReqQuery,
    schema: z.ZodObject<{ [K in keyof TData]: z.ZodType<TData[K]> }>,
    keys: TKeys,
    excludeKeys?: TExcludeKeys | undefined,
) {
    const safeExcludeKeys = (excludeKeys ?? []) as TExcludeKeys;

    const validKeys = removeArrayKeys(keys, safeExcludeKeys);
    return parseFilter<TData, typeof validKeys>(query, validKeys, schema);
}
