import type { Entries } from '../../types/generic.ts';

export type MatchType = (typeof MATCH_TYPES)[number];

export const MATCH_TYPES = [
    'exact',
    'contains',
    'starts_with',
    'ends_with',
] as const satisfies readonly string[];

export type FilterOptions = {
    values: (string | number)[] | undefined;
    match?: MatchType;
    not?: boolean;
};

export type Filter<T> = Partial<Record<keyof T, FilterOptions>>;

export function createFilterFragment<T extends object>(
    conditions: Filter<T> | undefined,
    startIndex: number = 1,
): { clause: string; params: (string | number)[] } {
    if (conditions === undefined) {
        return { clause: '', params: [] };
    }

    const params: (string | number)[] = [];
    const clauses = [];
    let i = startIndex;

    for (const [col, v] of Object.entries(conditions) as Entries<Filter<T>>) {
        const values = v?.values;
        const not = v?.not;
        const match = v?.match ?? 'exact';

        if (values !== undefined && values.length !== 0) {
            const inner = values
                .map((val) => {
                    if (typeof val === 'string') {
                        let placeholder = `$${i++}`;
                        switch (match) {
                            case 'contains':
                                val = `%${val}%`;
                                break;
                            case 'starts_with':
                                val = `${val}%`;
                                break;
                            case 'ends_with':
                                val = `%${val}`;
                                break;
                        }
                        params.push(val);
                        return `${String(col)} ILIKE ${placeholder}`;
                    } else {
                        params.push(val);
                        return `${String(col)} = $${i++}`;
                    }
                })
                .join(' OR ');

            const clause = not ? `NOT (${inner})` : `(${inner})`;
            clauses.push(clause);
        }
    }
    const clause = clauses.join(' AND ');
    return { clause, params };
}

export function createFilterFragmentWithAlias<T extends object>(
    conditions: Filter<T>,
    alias: string,
    startIndex: number = 1,
): { clause: string; params: (string | number)[] } {
    const params = [];
    const clauses = [];
    let i = startIndex;
    for (const [col, values] of Object.entries(conditions) as [
        keyof T,
        (string | number)[],
    ][]) {
        if (values) {
            const clause = values
                .map(() => `${alias}.${String(col)} = $${i++}`)
                .join(' OR ');
            clauses.push(`(${clause})`);
            params.push(...values);
        }
    }
    const clause = clauses.join(' AND ');
    return { clause, params };
}

export function createFilterFragmentWithAliases<T extends object>(
    aliases: Record<string, Filter<T> | undefined>,
    startIndex: number = 1,
): { clause: string; params: (string | number)[] } {
    const params = [];
    const clauses = [];
    for (const [alias, filter] of Object.entries(aliases)) {
        if (filter) {
            const {
                clause: c,
                params: p,
            }: { clause: string; params: (string | number)[] } =
                createFilterFragmentWithAlias(
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
