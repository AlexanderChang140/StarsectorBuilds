import type { PaginatedResponse } from '@shared/types';

import type {
    CategoryConfig,
    ChipConfig,
} from '@/components/DataTable/DataTableFilterChips';
import { useDebounce } from '@/hooks/useDebounce';
import type { Item } from '@/types/component';
import { typedEntries } from '@/utils/object';

import useCategoriesQuery from './useCategoriesQuery';
import type { ChipFilterState } from './useChipFilterState';
import useChipsQuery from './useChipsQuery';

interface UseFilterChipsDataProps<
    TCategory,
    TCategoryKeys extends readonly (keyof TCategory)[],
    TChip,
    TChipKeys extends readonly (keyof TChip)[],
> {
    chipFilterState: ChipFilterState<TCategory>;
    category: CategoryConfig<TCategory, TCategoryKeys>;
    chips: ChipConfig<TChip, TChipKeys>;
}

export default function useFilterChipsData<
    TCategory,
    TCategoryKeys extends readonly (keyof TCategory)[],
    TChip,
    TChipKeys extends readonly (keyof TChip)[],
>({
    chipFilterState,
    category,
    chips,
}: UseFilterChipsDataProps<TCategory, TCategoryKeys, TChip, TChipKeys>) {
    const debouncedInput = useDebounce(chipFilterState.input, 300);

    const categoriesQuery = useCategoriesQuery<TCategory, TCategoryKeys>({
        input: debouncedInput,
        exclude: typedEntries(chipFilterState.chips).map(([value]) => value),
        excludeKey: category.valueKey,
        filterKey: category.filterKey,
        queryKey: category.queryKey,
        endpoint: category.endpoint,
        fieldKeys: category.keys,
    });

    const { categoryValues, chipsQueries } = useChipsQuery<
        TCategory,
        TChip,
        TChipKeys
    >(
        chips.queryKey,
        chips.endpoint,
        chips.keys,
        chips.categoryKey,
        chipFilterState.chips,
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
