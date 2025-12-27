import { useSearchParams } from 'react-router';

import PaginationControls from './pagination/PaginationControls';
import Table from './Table';
import useFetch from '../../hooks/useFetch';
import useTableQuery, { buildQueryString } from '../../hooks/useTableQuery';
import type { ApiEndpoint } from '../../types/api';
import type { SortOrder } from '../../types/generic';

import './DataTable.css';

interface DataTableProps<
    TData extends object,
    TTableKeys extends readonly (keyof TData)[],
    TKeyOrder extends readonly (keyof TData)[],
> {
    endpoint: ApiEndpoint;
    tableKeys: TTableKeys;
    keyOrder: TKeyOrder;
    displayMap: Partial<Record<TKeyOrder[number], string>>;
    initialSort?: { sortField: TKeyOrder[number]; sortOrder: SortOrder };
    link?: { linkField: TKeyOrder[number]; linkFn: (row: TData) => string };
    title?: string;
    defaultLimit?: number;
}

export function DataTable<
    TData extends object,
    TTableKeys extends readonly (keyof TData)[],
    TKeyOrder extends readonly (keyof TData)[],
>({
    endpoint,
    tableKeys,
    keyOrder,
    displayMap,
    initialSort,
    link,
    title,
    defaultLimit = 20,
}: DataTableProps<TData, TTableKeys, TKeyOrder>) {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get('page') ?? 1);

    const onPageChange = (pageIndex: number) => {
        setSearchParams({ page: (pageIndex + 1).toString() });
    };

    const query = useTableQuery<TData, TTableKeys>(tableKeys, {
        limit: defaultLimit,
        sort: initialSort?.sortField,
        order: initialSort?.sortOrder,
    });

    const queryString = buildQueryString({
        ...query,
        fields: tableKeys.join(','),
    });
    const { data, loading, error } = useFetch<TData[]>(
        `${endpoint}?${queryString}`,
    );

    if (error) return <div>Error: {error.message}</div>;
    if (loading || data === undefined) return <div>Loading...</div>;
    if (!data?.length) return <div>No data found</div>;

    const keys = Object.keys(data[0]) as (keyof TData)[];
    const columns = keyOrder
        .filter((key: keyof TData) => keys.includes(key))
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
            ? ({
                  [link.linkField]: (row: TData) => link.linkFn(row),
              } as Partial<Record<keyof TData, (row: TData) => string>>)
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
