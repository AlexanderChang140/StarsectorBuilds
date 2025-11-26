import type { ReqQuery } from '../../types/generic.ts';

export function parseLimit(query: ReqQuery, maxLimit: number) {
    const rawLimit = query['limit'];

    if (!rawLimit) return maxLimit;
    const limit = parseInt(String(rawLimit), 10);
    return Math.max(0, Math.min(maxLimit, limit));
}
