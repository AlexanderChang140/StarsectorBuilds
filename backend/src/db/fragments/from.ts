import type { DB } from '../db.js';

export function createFromClause(table: keyof DB): string {
    return `FROM ${table}`;
}

export function createFromWithAlias(table: keyof DB, alias: string): string {
    const fromClause = createFromClause(table);
    return `${fromClause} AS ${alias}`;
}
