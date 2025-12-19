export function createLimitClause(limit: number | undefined) {
    if (limit === undefined || Number.isNaN(limit)) {
        return '';
    }

    return `LIMIT ${limit}`;
}
