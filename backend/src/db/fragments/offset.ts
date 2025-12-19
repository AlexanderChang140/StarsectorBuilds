export function createOffsetClause(offset: number | undefined) {
    if (offset === undefined || Number.isNaN(offset)) {
        return '';
    }

    return `OFFSET ${offset}`;
}
