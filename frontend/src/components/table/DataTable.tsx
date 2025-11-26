import useFetch from '../../hooks/useFetch';
import useQuery, { buildTableQuery } from '../../hooks/useTableQuery';
import type { ApiEndpoint } from '../../types/api';
import type { SortOrder } from '../../types/generic';
import Table from './Table';

interface DataTableProps<T extends object> {
    endpoint: ApiEndpoint;
    displayMap: Partial<Record<keyof T, string>>;
    keyOrder: (keyof T)[];
    initialSort?: { sortField: keyof T; sortOrder: SortOrder };
    link?: { linkField: keyof T; linkFn: (row: T) => string };
    title?: string;
}

export function DataTable<T extends object>({
    endpoint,
    displayMap,
    keyOrder,
    initialSort,
    link,
    title,
}: DataTableProps<T>) {
    const query = useQuery(keyOrder);
    const queryString = buildTableQuery(query);
    const { data, loading, error } = useFetch<T[]>(
        `${endpoint}?${queryString}`,
    );
    if (loading || data === undefined) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    console.log(data);
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
