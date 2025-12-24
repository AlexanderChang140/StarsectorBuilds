import type { ApiEndpoint } from 'src/types/api';
import useFetch from '../../hooks/useFetch';
import useTableQuery, { buildQueryString } from '../../hooks/useTableQuery';
import type { SortOrder } from '../../types/generic';
import Table from './Table';

interface DataTableProps<T extends object> {
    endpoint: ApiEndpoint;
    displayMap: Partial<Record<keyof T, string>>;
    keyOrder: readonly (keyof T)[];
    initialSort?: { sortField: keyof T; sortOrder: SortOrder };
    link?: { linkField: keyof T; linkFn: (row: T) => ApiEndpoint };
    title?: string;
    defaultLimit?: number;
}

export function DataTable<T extends object>({
    endpoint,
    displayMap,
    keyOrder,
    initialSort,
    link,
    title,
    defaultLimit = 20,
}: DataTableProps<T>) {
    const query = useTableQuery(keyOrder, { limit: defaultLimit });

    const queryString = buildQueryString(query);
    const { data, loading, error } = useFetch<T[]>(
        `${endpoint}?${queryString}`,
    );
    if (error) return <div>Error: {error.message}</div>;
    if (loading || data === undefined) return <div>Loading...</div>;
    if (!data?.length) return <div>No data found</div>;

    const keys = Object.keys(data[0]) as (keyof T)[];
    const columns = keyOrder
        .filter((key: keyof T) => keys.includes(key))
        .map((key) => {
            const sortByOrder: SortOrder = '';
            return {
                label: displayMap[key] ?? String(key),
                accessor: key,
                sortable: true,
                sortByOrder,
            };
        });

    const links =
        link?.linkField && link.linkFn
            ? ({ [link.linkField]: (row: T) => link.linkFn(row) } as Partial<
                  Record<keyof T, (row: T) => string>
              >)
            : undefined;

    return (
        <div>
            {title && <h1>{title}</h1>}
            {data.length} records found
            <Table
                columns={columns}
                initialData={data}
                initialSort={initialSort}
                links={links}
            />
        </div>
    );
}
