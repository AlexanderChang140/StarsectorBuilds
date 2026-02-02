import { useEffect, useState } from 'react';
import type { SetURLSearchParams } from 'react-router';

import type { Item } from '@/types/component';
import { typedEntries, removeKey, addKey, updateKey } from '@/utils/object';

import useURLChips from './hooks/useURLChips';
import CommandComboBox from '../CommandComboBox/CommandComboBox';
import type { ChipState } from '../filter/hooks/useChipFilterState';
import useFilterChipsData, {
    type CategoryConfig,
    type ChipConfig,
} from '../filter/hooks/useFilterChipsData';
import createChipState from '../LabeledSelectChip/createChipState';
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
    const [chipStates, setChipStates] = useState<Record<string, ChipState>>({});

    const handleURLChipsChange = (next: Record<string, ChipState>) => {
        setChipStates((prev) => ({ ...prev, ...next }));
    };

    useURLChips<TCategory, TCategoryKeys, TChip, TChipKeys>({
        onURLChipsChange: handleURLChipsChange,
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

    const handleChipSelectedChange = (
        categoryValue: string,
        selected: Item | undefined,
    ) => {
        setChipStates((prev) => {
            const chipState = updateKey(
                prev[categoryValue],
                'selected',
                selected,
            );
            return addKey(prev, categoryValue, chipState);
        });
    };

    const handleRemoveChip = (categoryValue: string) => {
        setChipStates((prev) => removeKey(prev, categoryValue));
    };

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
                    onSelectedChange={handleChipSelectedChange}
                    onRemoveChip={handleRemoveChip}
                />
            );
        },
    );

    return (
        <CommandComboBox
            commands={categoryFilters}
            input={categoryInput}
            onInputChange={setCategoryInput}
            onSelect={(categoryValue) =>
                setChipStates((prev) => {
                    const nextCategory = categoryData.find(
                        (data) =>
                            String(data[category.valueKey]) === categoryValue,
                    );

                    if (nextCategory === undefined) return prev;

                    const newChipState: ChipState = createChipState(
                        category.labelTransform(nextCategory),
                    );

                    return addKey(prev, categoryValue, newChipState);
                })
            }
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
