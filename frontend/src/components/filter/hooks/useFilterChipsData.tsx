import type { PaginatedResponse } from '@shared/types';

import type { ApiEndpoint, Sort } from '@/api/types';
import type { ChipState } from '@/components/LabeledSelectChip/hooks/useChipStates';
import { useDebounce } from '@/hooks/useDebounce';
import type { Item } from '@/types/component';
import type { ValueKeys, StringTransform } from '@/types/generic';
import { typedEntries } from '@/utils/object';

import useCategoriesQuery from './useCategoriesQuery';
import useChipsQuery from './useChipsQuery';

export type CategoryConfig<
    TCategory,
    TCategoryKeys extends readonly (keyof TCategory)[],
> = {
    queryKey: string;
    endpoint: ApiEndpoint;
    keys: TCategoryKeys;
    filterKey: TCategoryKeys[number];
    valueKey: ValueKeys<TCategory, TCategoryKeys>;
    labelTransform: StringTransform<TCategory>;
    options?: {
        sort: (categoryRow: TCategory) => Sort;
    };
};

export type ChipConfig<TChip, TChipKeys extends readonly (keyof TChip)[]> = {
    queryKey: string;
    endpoint: ApiEndpoint;
    keys: TChipKeys;
    categoryKey: TChipKeys[number];
    valueKey: ValueKeys<TChip, TChipKeys>;
    labelTransform: StringTransform<TChip>;
};

interface UseFilterChipsDataProps<
    TCategory,
    TCategoryKeys extends readonly (keyof TCategory)[],
    TChip,
    TChipKeys extends readonly (keyof TChip)[],
> {
    chipStates: Record<string, ChipState>;
    categoryInput: string;
    category: CategoryConfig<TCategory, TCategoryKeys>;
    chips: ChipConfig<TChip, TChipKeys>;
}

export default function useFilterChipsData<
    TCategory,
    TCategoryKeys extends readonly (keyof TCategory)[],
    TChip,
    TChipKeys extends readonly (keyof TChip)[],
>({
    chipStates,
    categoryInput,
    category,
    chips,
}: UseFilterChipsDataProps<TCategory, TCategoryKeys, TChip, TChipKeys>) {
    const debouncedInput = useDebounce(categoryInput, 300);

    const categoriesQuery = useCategoriesQuery<TCategory, TCategoryKeys>({
        input: debouncedInput,
        exclude: typedEntries(chipStates).map(([value]) => value),
        excludeKey: category.valueKey,
        filterKey: category.filterKey,
        queryKey: category.queryKey,
        endpoint: category.endpoint,
        fieldKeys: category.keys,
    });

    const { categoryValues, chipsQueries } = useChipsQuery<TChip, TChipKeys>(
        chips.queryKey,
        chips.endpoint,
        chips.keys,
        chips.categoryKey,
        chipStates,
    );

    const categoriesData = categoriesQuery?.data?.data ?? [];
    const hasChipsData = !chipsQueries?.some(
        (query) => query.data === undefined,
    );
    const chipsData = hasChipsData
        ? chipsQueries.map((query) => query.data as PaginatedResponse<TChip>)
        : [];

    const categoryFilters: Item[] = categoriesData.map((categoryRow) => ({
        value: String(categoryRow[category.valueKey]),
        label: category.labelTransform(categoryRow),
    }));

    const chipFilters: Record<string, Item[]> = Object.fromEntries(
        chipsData.map((data, i) => {
            const categoryValue = categoryValues[i];
            const item = data.data.map((chipRow) => ({
                value: String(chipRow[chips.valueKey]),
                label: chips.labelTransform(chipRow),
            }));
            return [categoryValue, item];
        }),
    );

    return { categoryData: categoriesData, categoryFilters, chipFilters };
}
