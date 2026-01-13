import type { PaginatedResponse } from '@shared/types';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, type SetURLSearchParams } from 'react-router';

import PaginationControls from '@/components/pagination/PaginationControls';
import Table from '@/components/table/Table';
import useTableParams from '@/hooks/useTableParams';
import type { ApiEndpoint } from '@/types/api';
import type { SortOrder } from '@/types/generic';
import { buildApiRequest } from '@/utils/apiRequestBuilder';
import fetchSafe from '@/utils/fetchSafe';

import styles from './DataTable.module.css';

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
    TTableKeys extends readonly (keyof TData)[],
    TKeyOrder extends readonly (keyof TData)[],
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

    const handleSortChange = (accessor: keyof TData, sortOrder: SortOrder) => {
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

    const { data: response } = useQuery<PaginatedResponse<TData>>({
        queryKey: [queryKey, filter, sort, order, limit, offset],
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
                sortByOrder: key === sort ? order : undefined,
            };
        });

    const links =
        link?.linkField && link.linkFn
            ? ({
                  [link.linkField]: (row: TData) => link.linkFn(row),
              } as Partial<Record<keyof TData, (row: TData) => string>>)
            : undefined;

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
                        order
                            ? { field: sort as keyof TData, order: order }
                            : undefined
                    }
                    onSortChange={handleSortChange}
                />
                <PaginationControls
                    //TODO Get total page count from backend
                    totalPages={5}
                    currPageIndex={page - 1}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}
