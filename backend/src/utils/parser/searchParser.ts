import type { ReqQuery } from '../../types/generic.ts';

export function parseSearch(query: ReqQuery): string {
    const rawSearch = query['q'];
    const search = String(rawSearch);

    return search;
}
