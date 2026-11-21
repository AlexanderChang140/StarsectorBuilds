import type { ReqQuery } from '../../types/generic.ts';

export function parseFields<T>(
    query: ReqQuery,
    validKeys: readonly (keyof T)[],
): (keyof T)[] {
    const validKeySet = new Set(validKeys);
    const rawFields = String(query.fields).split(',');

    const fields = rawFields.filter((k) =>
        validKeySet.has(k as keyof T),
    ) as (keyof T)[];

    return fields;
}
