import { useSearchParams } from 'react-router';

import PaginationControls from './pagination/PaginationControls';
import Table from './Table';
import useFetch from '../../hooks/useFetch';
import useTableQuery, { buildQueryString } from '../../hooks/useTableQuery';
import type { ApiEndpoint } from '../../types/api';
import type { SortOrder } from '../../types/generic';

import './DataTable.css';

interface DataTableProps<
    T extends object,
    TSortKeys extends readonly (keyof T)[],
> {
    endpoint: ApiEndpoint;
    displayMap: Partial<Record<TSortKeys[number], string>>;
    keyOrder: TSortKeys;
    initialSort?: { sortField: TSortKeys[number]; sortOrder: SortOrder };
    link?: { linkField: TSortKeys[number]; linkFn: (row: T) => string };
    title?: string;
    defaultLimit?: number;
}

export function DataTable<
    T extends object,
    TSortKeys extends readonly (keyof T)[],
>({
    endpoint,
    displayMap,
    keyOrder,
    initialSort,
    link,
    title,
    defaultLimit = 20,
}: DataTableProps<T, TSortKeys>) {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get('page') ?? 1);

    const onPageChange = (pageIndex: number) => {
        setSearchParams({ page: (pageIndex + 1).toString() });
    };

    const query = useTableQuery<T, TSortKeys>(keyOrder, {
        limit: defaultLimit,
        sort: initialSort?.sortField,
        order: initialSort?.sortOrder,
    });
    
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
        <div className="data-table-container">
            {title && <h1>{title}</h1>}
            {data.length} records found
            <Table columns={columns} initialData={data} links={links} />
            <PaginationControls
                totalPages={5}
                currPageIndex={page - 1}
                onPageChange={onPageChange}
            />
        </div>
    );
}
