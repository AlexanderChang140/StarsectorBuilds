import type { PaginatedResponse } from '@shared/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { buildApiRequest } from '@/api/apiRequestBuilder';
import fetchSafe from '@/api/fetchSafe';
import type { ApiEndpoint } from '@/api/types';
import createChipState from '@/components/filter/createChipState';
import type {
    ChipFilterState,
    ChipState,
} from '@/components/filter/hooks/useChipFilterState';

import type { CategoryConfig, ChipConfig } from '../DataTableFilterChips';

interface UseURLChipsProps<
    TCategory,
    TCategoryKeys extends readonly (keyof TCategory)[],
    TChip,
    TChipKeys extends readonly (keyof TChip)[],
> {
    onFilterStateChange: React.Dispatch<
        React.SetStateAction<ChipFilterState<TCategory>>
    >;
    category: CategoryConfig<TCategory, TCategoryKeys>;
    chips: ChipConfig<TChip, TChipKeys>;
    searchParams: URLSearchParams;
}

export default function useURLChips<
    TCategory,
    TCategoryKeys extends readonly (keyof TCategory)[],
    TChip,
    TChipKeys extends readonly (keyof TChip)[],
>({
    onFilterStateChange,
    category,
    chips,
    searchParams,
}: UseURLChipsProps<TCategory, TCategoryKeys, TChip, TChipKeys>) {
    const urlChipsValues = searchParams.getAll(String(chips.valueKey));
    const urlChipsQuery = useURLChipsQuery<TChip, TChipKeys>(
        chips.queryKey,
        chips.endpoint,
        chips.keys,
        chips.categoryKey,
        urlChipsValues,
    );

    const urlCategoriesQuery = useURLCategoryQuery<TCategory, TCategoryKeys>(
        category.queryKey,
        category.endpoint,
        category.keys,
        category.filterKey,
        urlChipsQuery.data?.data.map((chipRow) =>
            String(chipRow[chips.categoryKey]),
        ) ?? [],
    );

    useEffect(() => {
        if (!urlChipsQuery.data) return;
        if (!urlCategoriesQuery.data) return;

        const urlChipState = Object.fromEntries(
            urlChipsQuery.data.data.map(
                (chipRow): [string, ChipState<TCategory>] => {
                    const categoryValue = String(chipRow[chips.categoryKey]);
                    const categoryRow = urlCategoriesQuery.data.data.find(
                        (cat) =>
                            String(cat[category.valueKey]) === categoryValue,
                    );
                    if (!categoryRow) throw new Error('wtf');
                    return [
                        categoryValue,
                        createChipState<TCategory>(categoryRow!, '', {
                            value: String(chipRow[chips.valueKey]),
                            label: chips.labelTransform(chipRow),
                        }),
                    ];
                },
            ),
        );

        onFilterStateChange((prev) => {
            return {
                ...prev,
                chips: {
                    ...prev.chips,
                    ...urlChipState,
                },
            };
        });
    }, [
        chips,
        onFilterStateChange,
        urlChipsQuery.data,
        urlCategoriesQuery.data,
        category.filterKey,
        category.valueKey,
    ]);
}

function useURLChipsQuery<TChip, TChipKeys extends readonly (keyof TChip)[]>(
    queryKey: string,
    endpoint: ApiEndpoint,
    fieldKeys: TChipKeys,
    filterKey: keyof TChip,
    values: string[],
) {
    const chipsRequest = buildApiRequest({
        endpoint,
        params: {
            [filterKey]: values,
            fields: fieldKeys.join(','),
        },
    });

    return useQuery<PaginatedResponse<TChip>>({
        queryKey: [queryKey + 'Generated', values],
        queryFn: () => fetchSafe(chipsRequest),
        enabled: values.length !== 0,
    });
}

function useURLCategoryQuery<
    TCategory,
    TCategoryKeys extends readonly (keyof TCategory)[],
>(
    queryKey: string,
    endpoint: ApiEndpoint,
    fieldKeys: TCategoryKeys,
    filterKey: keyof TCategory,
    values: string[],
) {
    const chipsRequest = buildApiRequest({
        endpoint,
        params: {
            [filterKey]: values,
            fields: fieldKeys.join(','),
        },
    });

    return useQuery<PaginatedResponse<TCategory>>({
        queryKey: [queryKey + 'Generated', values],
        queryFn: () => fetchSafe(chipsRequest),
        enabled: values.length !== 0,
    });
}
