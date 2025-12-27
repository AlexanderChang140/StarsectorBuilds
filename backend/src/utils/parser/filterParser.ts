import type { Filter } from '../../db/helpers/filter.ts';
import type { ReqQuery } from '../../types/generic.ts';
import {
    filterKeys,
    removeArrayKeys,
    removeNull,
    removeUndefined,
} from '../helpers.ts';

export function parseFilter<T>(
    query: ReqQuery,
    validKeys: readonly (keyof T)[],
    valMap: (values: unknown[]) => (string | number)[],
): Filter<T> {
    const cleanedQuery: Record<string, unknown> = removeNull(
        removeUndefined(query),
    );
    const filteredQuery = filterKeys(cleanedQuery, validKeys);

    const filter = Object.fromEntries(
        Object.entries(filteredQuery).map(([k, v]) => {
            const value = valMap(Array.isArray(v) ? v : [v]);
            return [k, value];
        }),
    ) as Filter<T>;

    return filter;
}

export function parseFilterWithExcludedKeys<
    TData extends object,
    TKeys extends readonly (keyof TData)[],
    TExcludeKeys extends readonly TKeys[number][] = [],
>(query: ReqQuery, keys: TKeys, excludeKeys?: TExcludeKeys | undefined) {
    const safeExcludeKeys = (excludeKeys ?? []) as TExcludeKeys;

    const validKeys = removeArrayKeys(keys, safeExcludeKeys);
    return parseFilter<Partial<TData>>(query, validKeys, parseIntArray);
}

export function parseIntArray(values: unknown[]): number[] {
    return values
        .filter((v) => typeof v === 'string')
        .map((v) => parseInt(v, 10))
        .filter(Number.isFinite);
}
