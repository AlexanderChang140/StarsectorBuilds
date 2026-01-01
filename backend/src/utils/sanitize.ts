import { filterKeys, filterValues } from './helpers.ts';
import { clamp } from './math.ts';
import type { Filter } from '../db/helpers/filter.ts';
import type { Order } from '../db/types.ts';

export function sanitizeFilter<T>(
    filter: Filter<T> | undefined,
    keys: readonly (keyof T)[],
): Partial<T> {
    const filtered = filterKeys(filter ?? {}, keys);
    const sanitized = Object.fromEntries(
        Object.entries(filtered).filter(
            ([, v]) =>
                v !== undefined &&
                v !== null &&
                (!Array.isArray(v) || v.length !== 0),
        ),
    ) as Partial<T>;

    return sanitized;
}

export function sanitizeOrder<T>(
    order: Partial<Record<keyof T, Order>> | undefined,
): Partial<Record<keyof T, Order>> {
    return filterValues(order ?? {}, (val) => val === 'ASC' || val === 'DESC');
}

export function sanitizeLimit(
    limit: number | undefined,
    maxLimit: number,
): number {
    return clamp(limit ?? maxLimit, 1, maxLimit);
}

export function sanitizeOffset(offset: number | undefined): number {
    return Math.max(offset ?? 0, 0);
}
