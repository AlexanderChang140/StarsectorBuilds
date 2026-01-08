import { useQuery } from '@tanstack/react-query';
import { memo, useMemo } from 'react';
import { useSearchParams } from 'react-router';

import PaginationControls from '@/components/pagination/PaginationControls';
import Table from '@/components/table/Table';
import useTableParams from '@/hooks/useTableParams';
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
    dataConfig: {
        endpoint: ApiEndpoint;
        queryKey: string;
        initialSort?: { sortField: TKeyOrder[number]; sortOrder: SortOrder };
        defaultLimit?: number;
    };
    tableConfig: {
        tableKeys: TTableKeys;
        keyOrder: TKeyOrder;
        displayMap: Partial<Record<TKeyOrder[number], string>>;
    };
    link?: { linkField: TKeyOrder[number]; linkFn: (row: TData) => string };
    title?: string;
}

export function DataTable<
    TData extends Record<string, unknown>,
    TTableKeys extends readonly (keyof TData)[],
    TKeyOrder extends readonly (keyof TData)[],
>({
    dataConfig: { endpoint, queryKey, initialSort, defaultLimit = 20 },
    tableConfig: { tableKeys, keyOrder, displayMap },
    link,
    title,
}: DataTableProps<TData, TTableKeys, TKeyOrder>) {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get('page') ?? 1);

    const onPageChange = (pageIndex: number) => {
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            params.set('page', (pageIndex + 1).toString());
            return params;
        });
    };

    const onSortChange = (accessor: keyof TData, sortOrder: SortOrder) => {
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            params.set('sort', accessor.toString());
            params.set('order', sortOrder);
            params.set('page', '1');
            return params;
        });
    };

    const { filter, sort, order, limit, offset } = useTableParams<
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

    const columns = useMemo(() => {
        if (!data) return [];
        const keys = (Object.keys(data[0]) as (keyof TData)[]) ?? 0;
        return keyOrder
            .filter((key: keyof TData) => keys.includes(key))
            .map((key) => {
                return {
                    label: displayMap[key] ?? String(key),
                    accessor: key,
                    sortable: true,
                    sortByOrder: key === sort ? order : undefined,
                };
            });
    }, [data, keyOrder, displayMap, sort, order]);

    const links = useMemo(() => {
        return link?.linkField && link.linkFn
            ? ({
                  [link.linkField]: (row: TData) => link.linkFn(row),
              } as Partial<Record<keyof TData, (row: TData) => string>>)
            : undefined;
    }, [link]);

    if (isError) return <div>Error: {error.message}</div>;
    if (isPending) return <div>Loading...</div>;
    if (!data?.length) return <div>No data found</div>;

    const TableMemo = memo(Table<TData>);

    return (
        <div className="data-table">
            <div className="data-table-header">
                {title && <h1>{title}</h1>}
                <span>{data.length} records found</span>
            </div>
            <div className="data-table-options"></div>
            <div className="data-table-container">
                <TableMemo
                    columns={columns}
                    initialData={data}
                    links={links}
                    sort={
                        order
                            ? { field: sort as keyof TData, order: order }
                            : undefined
                    }
                    onSortChange={onSortChange}
                />
                <PaginationControls
                    //TODO Get total page count from backend
                    totalPages={5}
                    currPageIndex={page - 1}
                    onPageChange={onPageChange}
                />
                <div className="data-container-options"></div>
            </div>
        </div>
    );
}
