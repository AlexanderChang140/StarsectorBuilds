export function aliasArray(arr: readonly string[], alias: string) {
    return arr.map((val) => `${alias}.${val}`);
}
export function createSelectClause<TValues>(values: readonly TValues[]): string {
    const fragment = `SELECT ${values.join(', \n')}`;
    return fragment;
}
