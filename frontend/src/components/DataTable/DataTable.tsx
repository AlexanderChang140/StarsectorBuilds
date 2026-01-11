import type { PaginatedResponse } from '@shared/types';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useSearchParams } from 'react-router';

import ButtonDropdown from '@/components/dropdown/ButtonDropdown';
import PaginationControls from '@/components/pagination/PaginationControls';
import Select from '@/components/select/Select';
import Table from '@/components/table/Table';
import useTableParams from '@/hooks/useTableParams';
import type { ApiEndpoint } from '@/types/api';
import type { SortOrder } from '@/types/generic';
import { buildApiRequest } from '@/utils/apiRequestBuilder';
import fetchSafe from '@/utils/fetchSafe';

import styles from './DataTable.module.css';

type FilterConfig<TData, TKey extends keyof TData & string> = {
    field: TKey;
    label: string;
    values: { value: TData[TKey]; label: string }[];
    isMultiSelect: boolean;
};

type FilterState = {
    [field: string]: string[];
};

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
    controlConfig?: {
        filters?: FilterConfig<TData, keyof TData & string>[];
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
    controlConfig: { filters } = {},
    link,
    title,
}: DataTableProps<TData, TTableKeys, TKeyOrder>) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeDropdowns, setActiveDropdowns] = useState<
        Record<string, boolean>
    >({});

    const page = Number(searchParams.get('page') ?? 1);
    const selected =
        filters?.reduce((acc, filter) => {
            acc[filter.field] = searchParams.getAll(filter.field) ?? [];
            return acc;
        }, {} as FilterState) ?? {};

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

    const handleFilterChange = (field: string, values: string[]) => {
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            params.delete(field);
            values.forEach((v) => {
                params.append(field, v);
            });
            return params;
        });
    };

    const handleActiveChange = (field: string, active: boolean) => {
        setActiveDropdowns((prev) => ({ ...prev, [field]: active }));
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

    const {
        data: response,
        isPending,
        isError,
        error,
    } = useQuery<PaginatedResponse<TData>>({
        queryKey: [queryKey, filter, sort, order, limit, offset],
        queryFn: () => fetchSafe<TData[]>(request),
    });

    if (isError) return <div>Error: {error.message}</div>;
    if (isPending) return <div>Loading...</div>;
    if (!response?.data?.length) return <div>No data found</div>;

    const rows = response.data;
    const keys = (Object.keys(rows[0]) as (keyof TData)[]) ?? 0;
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
            <div className={styles.options}>
                {filters &&
                    filters.map((filter) => (
                        <div key={filter.field} className={styles.option}>
                            <ButtonDropdown
                                label={filter.label}
                                isActive={activeDropdowns[filter.field]}
                                onActiveChange={(active) =>
                                    handleActiveChange(filter.field, active)
                                }
                            >
                                <Select
                                    items={filter.values.map((v) => ({
                                        value: String(v.value),
                                        label: v.label,
                                    }))}
                                    selected={selected[filter.field]}
                                    onChange={(selected) =>
                                        handleFilterChange(
                                            filter.field,
                                            selected,
                                        )
                                    }
                                    isMultiSelect={filter.isMultiSelect}
                                ></Select>
                            </ButtonDropdown>
                        </div>
                    ))}
            </div>
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
