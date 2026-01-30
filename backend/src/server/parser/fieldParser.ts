import type { ReqQuery } from '../../types/generic.ts';

export function parseFields<T, TValidKeys extends readonly (keyof T)[]>(
    query: ReqQuery,
    validKeys: TValidKeys,
): (keyof T)[] {
    const validKeySet = new Set(validKeys);
    const rawFields = String(query.fields).split(',');

    const fields = rawFields.filter((k) =>
        validKeySet.has(k as keyof T),
    ) as (keyof T)[];

    return fields;
}
