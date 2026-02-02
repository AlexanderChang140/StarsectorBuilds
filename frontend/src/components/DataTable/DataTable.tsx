import type { PaginatedResponse } from '@shared/types';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, type SetURLSearchParams } from 'react-router';

import { buildApiRequest } from '@/api/apiRequestBuilder';
import fetchSafe from '@/api/fetchSafe';
import type { ApiEndpoint, Order, Sort } from '@/api/types';
import PaginationControls from '@/components/pagination/PaginationControls';
import Table from '@/components/table/Table';
import type { StringKeys } from '@/types/generic';

import styles from './DataTable.module.css';
import useTableParams from './hooks/useTableParams';

interface DataTableProps<
    TData extends Record<string, unknown>,
    TTableKeys extends readonly StringKeys<TData>[],
    TKeyOrder extends readonly StringKeys<TData>[],
> {
    dataConfig: {
        endpoint: ApiEndpoint;
        queryKey: string;
        initialSort?: { sortField: TKeyOrder[number]; sortOrder: Order };
        defaultLimit?: number;
    };
    tableConfig: {
        tableKeys: TTableKeys;
        keyOrder: TKeyOrder;
        displayMap: Partial<Record<TKeyOrder[number], string>>;
    };
    searchConfig?: {
        externalSearchParams: URLSearchParams;
        setExternalSearchParams: SetURLSearchParams;
    };
    filters?: React.ReactNode[];
    link?: { linkField: TKeyOrder[number]; linkFn: (row: TData) => string };
    title?: string;
}

export function DataTable<
    TData extends Record<string, unknown>,
    TTableKeys extends readonly StringKeys<TData>[],
    TKeyOrder extends readonly StringKeys<TData>[],
>({
    dataConfig: { endpoint, queryKey, initialSort, defaultLimit = 20 },
    tableConfig: { tableKeys, keyOrder, displayMap },
    searchConfig,
    filters,
    link,
    title,
}: DataTableProps<TData, TTableKeys, TKeyOrder>) {
    const [internalSearchParams, setInternalSearchParams] = useSearchParams();

    const searchParams = searchConfig
        ? searchConfig.externalSearchParams
        : internalSearchParams;
    const setSearchParams = searchConfig
        ? searchConfig.setExternalSearchParams
        : setInternalSearchParams;

    const page = Number(searchParams.get('page') ?? 1);

    const handlePageChange = (pageIndex: number) => {
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            params.set('page', (pageIndex + 1).toString());
            return params;
        });
    };

    const handleSortChange = (accessor: keyof TData, sortOrder: Order) => {
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            params.set('sort', accessor.toString());
            params.set('order', sortOrder);
            params.set('page', '1');
            return params;
        });
    };

    const { filter, sortField, order, limit, offset } =
        useTableParams<TTableKeys>(tableKeys, {
            limit: defaultLimit,
            sort: initialSort?.sortField,
            order: initialSort?.sortOrder,
        });

    const sort: Sort[] | undefined =
        sortField !== undefined && order !== undefined
            ? [[sortField, order]]
            : undefined;

    const request = buildApiRequest({
        endpoint,
        params: {
            filter,
            sort,
            limit,
            offset,
            fields: tableKeys.join(','),
        },
    });

    const { data: response } = useQuery<PaginatedResponse<TData>>({
        queryKey: [queryKey, filter, sort, limit, offset],
        queryFn: () => fetchSafe<PaginatedResponse<TData>>(request),
    });

    const rows = response?.data ?? [];
    const keys = rows[0] ? (Object.keys(rows[0]) as (keyof TData)[]) : [];
    const columns = keyOrder
        .filter((key: keyof TData) => keys.includes(key))
        .map((key) => {
            return {
                label: displayMap[key] ?? String(key),
                accessor: key,
                sortable: true,
                sortByOrder: key === sortField ? order : undefined,
            };
        });

    const links =
        link?.linkField && link.linkFn
            ? ({
                  [link.linkField]: (row: TData) => link.linkFn(row),
              } as Partial<Record<keyof TData, (row: TData) => string>>)
            : undefined;

    const count = response?.meta.total ?? 0;
    const totalPages = Math.ceil(count / defaultLimit);

    return (
        <div className={styles.dataTable}>
            <div className={styles.header}>
                {title && <h1>{title}</h1>}
                <span>{rows.length} records found</span>
            </div>
            <div className={styles.options}>{filters}</div>
            <div className={styles.container}>
                <Table
                    columns={columns}
                    initialData={rows}
                    links={links}
                    sort={
                        order !== undefined && sortField !== undefined
                            ? { field: sortField, order }
                            : undefined
                    }
                    onSortChange={handleSortChange}
                />
                <PaginationControls
                    totalPages={totalPages}
                    currPageIndex={page - 1}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}
