import { useEffect } from 'react';
import type { SetURLSearchParams } from 'react-router';

import type { ApiEndpoint } from '@/api/types';
import type { StringTransform } from '@/types/generic';
import { typedEntries } from '@/utils/object';

import useURLChips from './hooks/useURLChips';
import FilterChips from '../filter/FilterChips';
import useChipFilterState from '../filter/hooks/useChipFilterState';
import useFilterChipsData from '../filter/hooks/useFilterChipsData';

type ValueKeys<
    TCategory,
    TCategoryKeys extends readonly (keyof TCategory)[],
> = {
    [K in TCategoryKeys[number]]: TCategory[K] extends string | number
        ? K
        : never;
}[TCategoryKeys[number]];

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
};

export type ChipConfig<TChip, TChipKeys extends readonly (keyof TChip)[]> = {
    queryKey: string;
    endpoint: ApiEndpoint;
    keys: TChipKeys;
    categoryKey: TChipKeys[number];
    valueKey: ValueKeys<TChip, TChipKeys>;
    labelTransform: StringTransform<TChip>;
};

interface DataTableFilterChipsProps<
    TCategory,
    TCategoryKeys extends readonly (keyof TCategory)[],
    TChip,
    TChipKeys extends readonly (keyof TChip)[],
> {
    category: CategoryConfig<TCategory, TCategoryKeys>;
    chips: ChipConfig<TChip, TChipKeys>;
    searchParams: URLSearchParams;
    setSearchParams: SetURLSearchParams;
}

export default function DataTableFilterChips<
    TCategory,
    TCategoryKeys extends readonly (keyof TCategory)[],
    TChip,
    TChipKeys extends readonly (keyof TChip)[],
>({
    category,
    chips,
    searchParams,
    setSearchParams,
}: DataTableFilterChipsProps<TCategory, TCategoryKeys, TChip, TChipKeys>) {
    const {
        chipFilterState,
        setChipFilterState,
        getNextCategoryInput,
        getNextCategorySelected,
        getNextChipInput,
        addSelectedCategory,
        removeSelectedCategory,
    } = useChipFilterState<TCategory>();

    useURLChips<TCategory, TCategoryKeys, TChip, TChipKeys>({
        onFilterStateChange: setChipFilterState,
        category,
        chips,
        searchParams,
    });

    const { categoryData, categoryFilters, chipFilters } = useFilterChipsData<
        TCategory,
        TCategoryKeys,
        TChip,
        TChipKeys
    >({
        chipFilterState,
        category,
        chips,
    });

    useEffect(() => {
        setSearchParams((prevParams) => {
            const params = new URLSearchParams(prevParams);
            params.delete(String(chips.valueKey));
            typedEntries(chipFilterState.chips).forEach(([, { selected }]) => {
                if (selected) {
                    params.append(String(chips.valueKey), selected.value);
                }
            });
            return params;
        });
    }, [chipFilterState.chips, chips.valueKey, setSearchParams]);

    return (
        <FilterChips
            categoryFilters={categoryFilters}
            chipFilters={chipFilters}
            chipFilterState={chipFilterState}
            categoryLabelTransform={category.labelTransform}
            onCategoryInputChange={(input) =>
                setChipFilterState((prev) => getNextCategoryInput(prev, input))
            }
            onSelectCategory={(value) =>
                setChipFilterState((prev) => {
                    const nextCategory = categoryData.find(
                        (data) => String(data[category.valueKey]) === value,
                    );

                    if (nextCategory === undefined) return prev;
                    return getNextCategorySelected(prev, nextCategory, value);
                })
            }
            onUnselectCategory={(value) =>
                setChipFilterState((prev) =>
                    removeSelectedCategory(prev, value),
                )
            }
            onChipInputChange={(value, input) =>
                setChipFilterState((prev) =>
                    getNextChipInput(prev, value, input),
                )
            }
            onChipSelectedChange={(categoryValue, selected) =>
                setChipFilterState((prev) =>
                    addSelectedCategory(prev, categoryValue, selected),
                )
            }
        />
    );
}
