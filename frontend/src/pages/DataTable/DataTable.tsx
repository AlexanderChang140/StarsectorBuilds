import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';

import PaginationControls from '@/components/table/pagination/PaginationControls';
import Table from '@/components/table/Table';
import useTableQuery from '@/hooks/useTableQuery';
import type { ApiEndpoint } from '@/types/api';
import type { SortOrder } from '@/types/generic';
import { buildApiRequest } from '@/utils/apiRequestBuilder';
import fetchSafe from '@/utils/fetchSafe';

import './DataTable.css';

interface DataTableProps<
    TData extends Record<string, unknown>,
    TTableKeys extends readonly (keyof TData)[],
    TKeyOrder extends readonly (keyof TData)[],
> {
    endpoint: ApiEndpoint;
    queryKey: string;
    tableKeys: TTableKeys;
    keyOrder: TKeyOrder;
    displayMap: Partial<Record<TKeyOrder[number], string>>;
    initialSort?: { sortField: TKeyOrder[number]; sortOrder: SortOrder };
    link?: { linkField: TKeyOrder[number]; linkFn: (row: TData) => string };
    title?: string;
    defaultLimit?: number;
}

export function DataTable<
    TData extends Record<string, unknown>,
    TTableKeys extends readonly (keyof TData)[],
    TKeyOrder extends readonly (keyof TData)[],
>({
    endpoint,
    queryKey,
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

    const { filter, sort, order, limit, offset } = useTableQuery<
        TData,
        TTableKeys
    >(tableKeys, {
        limit: defaultLimit,
        sort: initialSort?.sortField,
        order: initialSort?.sortOrder,
    });

    const request = buildApiRequest({
        endpoint,
        params: {
            ...filter,
            sort,
            order,
            limit,
            offset,
            fields: tableKeys.join(','),
        },
    });

    const { data, isPending, isError, error } = useQuery<TData[]>({
        queryKey: [queryKey, sort, order, limit, offset],
        queryFn: () => fetchSafe<TData[]>(request),
    });

    if (isError) return <div>Error: {error.message}</div>;
    if (isPending) return <div>Loading...</div>;
    if (!data?.length) return <div>No data found</div>;

    const keys = Object.keys(data[0]) as (keyof TData)[];
    const columns = keyOrder
        .filter((key: keyof TData) => keys.includes(key))
        .map((key) => {
            const sortByOrder: SortOrder | undefined = undefined;
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
