export type Filter = Record<string, (string | number)[] | undefined>;

export function createFilter(
    conditions: Filter,
    startIndex: number = 1,
): { clause: string; params: (string | number)[] | undefined } {
    const params = [];
    const clauses = [];
    let i = startIndex;
    for (const [col, values] of Object.entries(conditions)) {
        if (values) {
            const clause = values.map(() => `$${col} = $${i++}`).join(' OR ');
            clauses.push(`(${clause})`);
            params.push(...values);
        }
    }
    const clause = clauses.join(' AND ');
    return { clause, params };
}

export function createFilterWithAlias(
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

export function createFilterWithAliases(
    aliases: Record<string, Filter | undefined>,
    startIndex: number = 1,
): { clause: string; params: (string | number)[] } {
    const params = [];
    const clauses = [];
    for (const [alias, filter] of Object.entries(aliases)) {
        if (filter) {
            const { clause: c, params: p } = createFilterWithAlias(
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
