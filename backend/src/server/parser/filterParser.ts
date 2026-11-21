import {
    MATCH_TYPES,
    type FilterableKeys,
    type MatchType,
} from '../../db/helpers/filter.ts';
import type { FilterableRow, QueryFilter } from '../../db/types.ts';
import type { ReqQuery } from '../../types/generic.ts';
import type { Schema } from '../../types/zod.ts';
import {
    removeNull,
    removeUndefined,
    filterKeys,
    removeArrayKeys,
} from '../../utils/helpers.ts';
import { typedEntries } from '../../utils/object.ts';
import { getFilterSchema, safeParse } from '../../utils/zod.ts';

type RawFilter = {
    values?: unknown;
    match?: unknown;
    not?: unknown;
};

export function parseFilter<TData extends object>(
    query: ReqQuery,
    validKeys: readonly FilterableKeys<FilterableRow<TData>>[],
    schema: Schema<FilterableRow<TData>>,
): QueryFilter<TData> {
    type Row = FilterableRow<TData>;

    const cleanedQuery = removeNull(removeUndefined(query));
    const filteredQuery = filterKeys<Row>(cleanedQuery, validKeys);

    const filter = {} as QueryFilter<TData>;

    for (const [key, rawFilter] of typedEntries(filteredQuery)) {
        if (
            typeof rawFilter !== 'object' ||
            rawFilter === null ||
            !validKeys.includes(key as FilterableKeys<Row>)
        ) {
            continue;
        }

        const {
            values: rawValues,
            match: rawMatch,
            not: rawNot,
        } = rawFilter as RawFilter;

        if (rawValues == null) continue;

        const baseFieldSchema = schema.shape[key as keyof typeof schema.shape];
        const fieldSchema = getFilterSchema(baseFieldSchema);
        const wrappedValues = Array.isArray(rawValues)
            ? rawValues
            : [rawValues];

        if (wrappedValues.length === 0) continue;

        const values = wrappedValues
            .filter((v) => v !== undefined && v !== null)
            .flatMap((v) => {
                const result = safeParse(v, fieldSchema);
                return result.success ? [result.data] : [];
            });

        if (values.length === 0) continue;

        const match: MatchType =
            typeof rawMatch === 'string' &&
            MATCH_TYPES.includes(rawMatch as MatchType)
                ? (rawMatch as MatchType)
                : 'exact';

        const not = rawNot === 'true' || rawNot === true;

        Object.assign(filter, {
            [key]: { values, match, not },
        });
    }

    return filter;
}

export function parseFilterWithExcludedKeys<
    TData extends Record<string, unknown>,
>(
    query: ReqQuery,
    schema: Schema<FilterableRow<TData>>,
    keys: readonly FilterableKeys<FilterableRow<TData>>[],
    excludeKeys: readonly FilterableKeys<FilterableRow<TData>>[] = [],
): QueryFilter<TData> {
    const validKeys = removeArrayKeys(keys, excludeKeys);
    return parseFilter(query, validKeys, schema);
}
