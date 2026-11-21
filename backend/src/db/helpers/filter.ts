import { typedEntries } from '../../utils/object.ts';
import type { SelectableRow } from '../types.ts';

export type MatchType = (typeof MATCH_TYPES)[number];

export const MATCH_TYPES = [
    'exact',
    'contains',
    'starts_with',
    'ends_with',
    'gt',
    'lt',
    'gte',
    'lte',
] as const satisfies readonly string[];

type FilterableValues = string | number | boolean | null | Date;

export type FilterableKeys<T> = {
    [K in keyof T]: T[K] extends FilterableValues ? K : never;
}[keyof T];

export type FilterableColumnKeys<T> = readonly FilterableKeys<
    SelectableRow<T>
>[];

export type FilterOptions<T, K extends FilterableKeys<T>> = {
    values: T[K][] | undefined;
    match?: MatchType;
    not?: boolean;
};

type FilterCondition<T> = {
    [K in FilterableKeys<T>]?: FilterOptions<T, K>;
};

export type Filter<T> = FilterCondition<T> & {
    AND?: Filter<T>[];
    OR?: Filter<T>[];
};

export function createFilterCondition<
    const TValue,
    const TMatch extends MatchType,
>(value: TValue, match?: TMatch): { values: TValue[]; match?: TMatch } {
    const values = Array.isArray(value) ? value : [value];

    return { values, ...(match ? { match } : {}) };
}

export function createKeyedFilter<
    const TKey extends PropertyKey,
    const TValue,
    const TMatch extends MatchType,
>(
    key: TKey,
    value: TValue,
    match?: TMatch,
): { [K in TKey]: { values: TValue[]; match?: TMatch } } {
    return {
        [key]: createFilterCondition(value, match),
    } as { [K in TKey]: { values: TValue[]; match?: TMatch } };
}

export function createFilterOption<
    const TKey extends string | number | symbol,
    const TValue,
    const TMatch extends MatchType,
>(
    key: TKey,
    value: TValue,
    match?: TMatch,
): { filter: { [K in TKey]: { values: TValue[]; match?: TMatch } } } {
    return { filter: createKeyedFilter(key, value, match) };
}

export function createFilterFragment<T extends object>(
    conditions: Filter<T> | undefined,
    startIndex: number = 1,
): { clause: string; params: FilterableValues[] } {
    if (conditions === undefined) {
        return { clause: '', params: [] };
    }

    const params: FilterableValues[] = [];
    let i = startIndex;

    function processNode(node: Filter<T>): string {
        const clauses: string[] = [];

        if (node.AND && Array.isArray(node.AND)) {
            const subClauses: string[] = [];
            for (const subFilter of node.AND) {
                const res = processNode(subFilter);
                if (res) subClauses.push(`(${res})`);
            }
            if (subClauses.length > 0) {
                clauses.push(subClauses.join(' AND '));
            }
        }

        if (node.OR && Array.isArray(node.OR)) {
            const subClauses: string[] = [];
            for (const subFilter of node.OR) {
                const res = processNode(subFilter);
                if (res) subClauses.push(`(${res})`);
            }
            if (subClauses.length > 0) {
                clauses.push(`(${subClauses.join(' OR ')})`);
            }
        }

        const columnConditions = typedEntries(node).filter(
            ([col]) => col !== 'AND' && col !== 'OR',
        );

        const fieldClauses: string[] = [];
        for (const [col, v] of columnConditions) {
            const filterOptions = v as
                | FilterOptions<T, FilterableKeys<T>>
                | undefined;
            const values = filterOptions?.values;
            const not = filterOptions?.not;
            const match = filterOptions?.match ?? 'exact';

            if (values !== undefined && values.length !== 0) {
                const inner = values
                    .map((val) => {
                        if (val === null) {
                            const op = not ? 'IS NOT NULL' : 'IS NULL';
                            return `${String(col)} ${op}`;
                        }

                        const placeholder = `$${i++}`;

                        if (
                            typeof val === 'string' &&
                            ['contains', 'starts_with', 'ends_with'].includes(
                                match,
                            )
                        ) {
                            let value;
                            switch (match) {
                                case 'contains':
                                    value = `%${val}%`;
                                    break;
                                case 'starts_with':
                                    value = `${val}%`;
                                    break;
                                case 'ends_with':
                                    value = `%${val}`;
                                    break;
                            }
                            params.push(value ?? val);
                            return `${String(col)} ILIKE ${placeholder}`;
                        }

                        let operator = '=';
                        switch (match) {
                            case 'gt':
                                operator = '>';
                                break;
                            case 'lt':
                                operator = '<';
                                break;
                            case 'gte':
                                operator = '>=';
                                break;
                            case 'lte':
                                operator = '<=';
                                break;
                            case 'exact':
                            default:
                                operator = '=';
                                break;
                        }

                        params.push(val as FilterableValues);
                        return `${String(col)} ${operator} ${placeholder}`;
                    })
                    .join(' OR ');

                const clause = not ? `NOT (${inner})` : `(${inner})`;
                fieldClauses.push(clause);
            }
        }

        if (fieldClauses.length > 0) {
            clauses.push(fieldClauses.join(' AND '));
        }

        return clauses.join(' AND ');
    }

    const clause = processNode(conditions);
    return { clause, params };
}
