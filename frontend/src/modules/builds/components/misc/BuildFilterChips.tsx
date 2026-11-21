import type { SetURLSearchParams } from 'react-router';

import CommandComboBox from '@/components/CommandComboBox/CommandComboBox';
import useFilterChipsData, {
    type CategoryConfig,
    type ChipConfig,
} from '@/components/filter/hooks/useFilterChipsData';
import type { ChipState } from '@/components/LabeledSelectChip/hooks/useChipStates';
import LabeledSelectChip from '@/components/LabeledSelectChip/LabeledSelectChip';
import type { Item } from '@/types/component';
import { typedEntries } from '@/utils/object';

interface BuildFilterChipsProps<
    TCategory,
    TCategoryKeys extends readonly (keyof TCategory)[],
    TChip,
    TChipKeys extends readonly (keyof TChip)[],
> {
    categoryInput: string;
    onCategoryInputChange: (input: string) => void;
    chipStates: Record<string, ChipState>;
    onAddChip: (categoryItem: Item) => void;
    onRemoveChip: (categoryValue: string) => void;
    onUpdateChip: (categoryValue: string, selected?: Item) => void;
    category: CategoryConfig<TCategory, TCategoryKeys>;
    chips: ChipConfig<TChip, TChipKeys>;
    searchParams: URLSearchParams;
    setSearchParams: SetURLSearchParams;
}

export default function BuildFilterChips<
    TCategory,
    TCategoryKeys extends readonly (keyof TCategory)[],
    TChip,
    TChipKeys extends readonly (keyof TChip)[],
>({
    categoryInput,
    onCategoryInputChange,
    chipStates,
    onAddChip,
    onRemoveChip,
    onUpdateChip,
    category,
    chips,
}: BuildFilterChipsProps<TCategory, TCategoryKeys, TChip, TChipKeys>) {
    const { categoryFilters, chipFilters } = useFilterChipsData<
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
                    onSelectedChange={onUpdateChip}
                    onRemoveChip={onRemoveChip}
                />
            );
        },
    );

    return (
        <CommandComboBox
            commands={categoryFilters}
            input={categoryInput}
            onInputChange={onCategoryInputChange}
            onSelect={(categoryValue) => {
                const nextCategory = categoryFilters.find(
                    (categoryFilter) => categoryFilter.value === categoryValue,
                );

                if (nextCategory === undefined) return;

                onAddChip({ value: categoryValue, label: nextCategory.label });
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
