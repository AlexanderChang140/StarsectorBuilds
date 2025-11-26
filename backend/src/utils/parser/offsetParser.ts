import type { ReqQuery } from '../../types/generic.ts';

export function parseOffset(query: ReqQuery) {
    const rawOffset = query['offset'];

    if (!rawOffset) return 0;
    const offset = parseInt(String(rawOffset), 10);
    return Math.max(0, offset);
}
