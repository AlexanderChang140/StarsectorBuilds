import { filterKeys, filterValues } from './helpers.ts';
import { clamp } from './math.ts';
import type { Filter } from '../db/helpers/filter.ts';
import type { Order } from '../db/types.ts';
import type { Options } from '../types/generic.ts';

export function sanitizeFilter<T>(
    filter: Filter<T> | undefined,
    keys: readonly (keyof T)[],
): Filter<T> {
    const filtered = filterKeys(filter ?? {}, keys);
    const sanitized = Object.fromEntries(
        Object.entries(filtered).filter(
            ([, v]) =>
                v !== undefined &&
                v !== null &&
                (!Array.isArray(v) || v.length !== 0),
        ),
    ) as Filter<T>;

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

export function sanitizeAll<T, TKeys extends readonly (keyof T)[]>(
    options: Options<T>,
    filterColumns: TKeys,
    defaultLimit = 20,
): Options<T> {
    return {
        filter: sanitizeFilter(options.filter, filterColumns),
        order: sanitizeOrder(options.order),
        limit: sanitizeLimit(options.limit, defaultLimit),
        offset: sanitizeOffset(options.offset),
        client: options.client,
    };
}
