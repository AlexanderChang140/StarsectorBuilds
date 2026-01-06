export default function getFilterParams<
    T,
    TFilterKeys extends readonly (keyof T)[],
>(query: URLSearchParams, validFilterKeys: TFilterKeys) {
    const filter: Partial<Record<keyof T, string[]>> = {};

    for (const key of validFilterKeys) {
        const values = query.getAll(String(key));
        filter[key] = values;
    }

    return filter;
}
