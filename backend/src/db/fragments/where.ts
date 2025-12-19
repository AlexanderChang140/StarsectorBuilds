export function createWhereClause<T extends Record<string, unknown>>(
    where: T | undefined,
    startIndex: number = 1,
): { clause: string; values: T[keyof T][] } {
    if (where === undefined || Object.keys(where).length === 0) {
        return { clause: '', values: [] };
    }

    const { fragment, values } = createWhereFragment(where, startIndex);
    const clause = `WHERE ${fragment}`;
    return { clause, values };
}

export function createWhereFragment<T extends Record<string, unknown>>(
    where: T,
    startIndex: number = 1,
): { fragment: string; values: T[keyof T][] } {
    let i = startIndex;
    const fragment = Object.keys(where)
        .map((k) => `${k} = $${i++}`)
        .join(' AND ');
    const values = Object.values(where) as T[keyof T][];
    return { fragment, values };
}
