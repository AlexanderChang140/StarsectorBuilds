import { parseIntOrNaN } from '@/utils/parse';

export default function getURLPagination(query: URLSearchParams, defaultLimit: number | undefined) {
    const rawLimit = query.get('limit');
    const parsedLimit = parseIntOrNaN(rawLimit);
    const limit = !Number.isNaN(parsedLimit) ? parsedLimit : defaultLimit;

    const rawPage = query.get('page');
    const parsedOffset = (parseIntOrNaN(rawPage) - 1) * (limit ?? 0);
    const offset = !Number.isNaN(parsedOffset) ? parsedOffset : 0;

    return { limit, offset };
}
