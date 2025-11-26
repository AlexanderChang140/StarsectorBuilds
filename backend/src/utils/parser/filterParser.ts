import type { ReqQuery } from '../../types/generic.ts';

export function parseFilter<T>(
    query: ReqQuery,
    filterKeys: (keyof T)[],
    mapping: (key: keyof T, values: unknown[]) => T[keyof T],
): T {
    const filter: Partial<T> = {};

    for (const key of filterKeys) {
        const value = query[key as string];
        if (!value) continue;

        const values = Array.isArray(value) ? value : [value];
        filter[key] = mapping(key, values);
    }

    return filter as T;
}
