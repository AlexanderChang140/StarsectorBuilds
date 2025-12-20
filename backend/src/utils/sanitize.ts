import { filterKeys, filterValues } from './helpers.ts';
import { clamp } from './math.ts';
import type { Order } from '../types/generic.ts';

export function sanitizeFilter<T>(
    filter: Partial<T> | undefined,
    keys: readonly (keyof T)[],
) {
    return filterKeys(filter ?? {}, keys);
}

export function sanitizeOrder(order: Record<string, Order> | undefined) {
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
