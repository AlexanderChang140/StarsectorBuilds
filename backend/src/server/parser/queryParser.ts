import { parseFields } from './fieldParser.ts';
import { parseFilter } from './filterParser.ts';
import { parseLimit } from './limitParser.ts';
import { parseOffset } from './offsetParser.ts';
import { parseSort, type SortableColumnKeys } from './sortParser.ts';
import type { FilterableKeys } from '../../db/helpers/filter.ts';
import type { FilterableRow, Options } from '../../db/types.ts';
import type { ReqQuery } from '../../types/generic.ts';
import type { Schema } from '../../types/zod.ts';

export function parseQuery<TData extends object>(
    query: ReqQuery,
    fieldKeys: readonly (keyof TData)[],
    filterKeys: readonly FilterableKeys<FilterableRow<TData>>[],
    filterSchema: Schema<FilterableRow<TData>>,
    sortKeys: SortableColumnKeys<TData>,
): { selection: (keyof TData)[]; options: Options<TData> } {
    const selection = parseFields(query, fieldKeys);
    const filter = parseFilter(query, filterKeys, filterSchema);
    const order = parseSort(query, sortKeys);
    const limit = parseLimit(query);
    const offset = parseOffset(query);

    return { selection, options: { filter, order, limit, offset } };
}
