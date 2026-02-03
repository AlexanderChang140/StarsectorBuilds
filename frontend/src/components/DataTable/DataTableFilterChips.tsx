import { useEffect, useState } from 'react';
import type { SetURLSearchParams } from 'react-router';

import type { Item } from '@/types/component';
import { typedEntries } from '@/utils/object';

import useURLChips from './hooks/useURLChips';
import CommandComboBox from '../CommandComboBox/CommandComboBox';
import useFilterChipsData, {
    type CategoryConfig,
    type ChipConfig,
} from '../filter/hooks/useFilterChipsData';
import useChipStates from '../LabeledSelectChip/hooks/useChipStates';
import LabeledSelectChip from '../LabeledSelectChip/LabeledSelectChip';

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
    const [categoryInput, setCategoryInput] = useState('');
    const {
        chipStates,
        addChipState,
        removeChipState,
        updateChipState,
        hydrateChipStates,
    } = useChipStates();

    useURLChips<TCategory, TCategoryKeys, TChip, TChipKeys>({
        onURLChipsChange: hydrateChipStates,
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
        chipStates,
        categoryInput,
        category,
        chips,
    });

    useEffect(() => {
        setSearchParams((prevParams) => {
            const params = new URLSearchParams(prevParams);
            params.delete(String(chips.valueKey));
            typedEntries(chipStates).forEach(([, { selected }]) => {
                if (selected) {
                    params.append(String(chips.valueKey), selected.value);
                }
            });
            return params;
        });
    }, [chipStates, chips.valueKey, setSearchParams]);

    const chipList = typedEntries(chipStates).map(
        ([categoryValue, { categoryLabel, selected }]) => {
            const chipItems =
                (chipFilters[categoryValue] as Item[] | undefined) ?? [];
            return (
                <LabeledSelectChip
                    key={categoryValue}
                    categoryItem={{
                        value: categoryValue,
                        label: categoryLabel,
                    }}
                    items={chipItems}
                    selected={selected}
                    onSelectedChange={updateChipState}
                    onRemoveChip={removeChipState}
                />
            );
        },
    );

    return (
        <CommandComboBox
            commands={categoryFilters}
            input={categoryInput}
            onInputChange={setCategoryInput}
            onSelect={(categoryValue) => {
                const nextCategory = categoryData.find(
                    (data) => String(data[category.valueKey]) === categoryValue,
                );

                if (nextCategory === undefined) return;

                addChipState({
                    value: categoryValue,
                    label: category.labelTransform(nextCategory),
                });
            }}
            options={{
                button: {
                    label: 'Mods',
                    isLabelVisible: true,
                    text: 'Select a mod',
                },
                comboBox: { defaultFilter: () => true },
            }}
        >
            {chipList}
        </CommandComboBox>
    );
}
