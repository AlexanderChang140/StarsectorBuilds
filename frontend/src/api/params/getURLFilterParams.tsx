import type { Filter } from '../types';

export default function getURLFilterParams(
    query: URLSearchParams,
    validFilterKeys: readonly string[],
) {
    const filter: Record<string, Filter> = {};

    for (const key of validFilterKeys) {
        const values = query.getAll(key);
        if (values.length !== 0) {
            filter[key] = { values };
        }
    }

    return filter;
}
