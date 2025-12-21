import type { Filter } from '../../db/helpers/filter.ts';
import type { ReqQuery } from '../../types/generic.ts';
import { removeNull, removeUndefined } from '../helpers.ts';

export function parseFilter<T>(
    query: ReqQuery,
    valMap: (values: unknown[]) => (string | number)[],
): Filter<T> {
    const validated: Record<string, unknown> = removeNull(
        removeUndefined(query),
    );

    const filter = Object.fromEntries(
        Object.entries(validated).map(([k, v]) => {
            const value = valMap(Array.isArray(v) ? v : [v]);
            return [k, value];
        }),
    ) as Filter<T>;

    return filter;
}

export function parseIntArray(values: unknown[]): number[] {
    return values
        .filter((v) => typeof v === 'string')
        .map((v) => parseInt(v, 10))
        .filter(Number.isFinite);
}
