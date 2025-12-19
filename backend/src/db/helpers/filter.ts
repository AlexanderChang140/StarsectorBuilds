export type Filter = Record<string, (string | number)[]  | undefined>;

export function createFilterFragment(
    conditions: Filter | undefined,
    startIndex: number = 1,
): { clause: string; params: (string | number)[] | undefined } {
    if (conditions === undefined) {
        return { clause: '', params: [] };
    }

    const params = [];
    const clauses = [];
    let i = startIndex;
    for (const [col, values] of Object.entries(conditions)) {
        if (values) {
            const clause = values.map(() => `${col} = $${i++}`).join(' OR ');
            clauses.push(`(${clause})`);
            params.push(...values);
        }
    }
    const clause = clauses.join(' AND ');
    return { clause, params };
}

export function createFilterFragmentWithAlias(
    conditions: Filter,
    alias: string,
    startIndex: number = 1,
): { clause: string; params: (string | number)[] } {
    const params = [];
    const clauses = [];
    let i = startIndex;
    for (const [col, values] of Object.entries(conditions)) {
        if (values) {
            const clause = values
                .map(() => `${alias}.${col} = $${i++}`)
                .join(' OR ');
            clauses.push(`(${clause})`);
            params.push(...values);
        }
    }
    const clause = clauses.join(' AND ');
    return { clause, params };
}

export function createFilterFragmentWithAliases(
    aliases: Record<string, Filter | undefined>,
    startIndex: number = 1,
): { clause: string; params: (string | number)[] } {
    const params = [];
    const clauses = [];
    for (const [alias, filter] of Object.entries(aliases)) {
        if (filter) {
            const { clause: c, params: p } = createFilterFragmentWithAlias(
                filter,
                alias,
                startIndex + params.length,
            );
            if (c) {
                clauses.push(c);
                params.push(...p);
            }
        }
    }
    const clause = clauses.join(' AND ');
    return { clause, params };
}
