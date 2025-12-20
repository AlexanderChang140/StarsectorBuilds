import type { ReqQuery } from '../../types/generic.ts';

export function parseLimit(query: ReqQuery) {
    const rawLimit = query['limit'];

    if (!rawLimit) return 0;
    const limit = parseInt(String(rawLimit), 10);
    return isNaN(limit) ? 0 : limit;
}
