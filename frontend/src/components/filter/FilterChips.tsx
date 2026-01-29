import {
    Button,
    ComboBox,
    DialogTrigger,
    Input,
    Label,
    ListBoxItem,
    Popover,
} from 'react-aria-components';

import listBoxStyles from '@/components/ListBox/Listbox.module.css';
import type { Item } from '@/types/component';
import type { StringTransform } from '@/types/generic';
import { typedEntries } from '@/utils/object';

import FilterChip from './FilterChip';
import styles from './FilterChips.module.css';
import type { ChipFilterState } from './hooks/useChipFilterState';
import { ListBox } from '../ListBox/ListBox';

interface FilterChipsProps<TCategory> {
    categoryFilters: Item[];
    chipFilters: Record<string, Item[]>;
    chipFilterState: ChipFilterState<TCategory>;
    categoryLabelTransform: StringTransform<TCategory>;
    onCategoryInputChange: (input: string) => void;
    onSelectCategory: (value: string) => void;
    onUnselectCategory: (value: string) => void;
    onChipInputChange: (parentValue: string, input: string) => void;
    onChipSelectedChange: (
        parentValue: string,
        selected: Item | undefined,
    ) => void;
    categoryPlaceholder?: string;
    chipPlaceholder?: string;
}

export default function FilterChips<TCategory>({
    categoryFilters,
    chipFilters,
    chipFilterState,
    categoryLabelTransform,
    onCategoryInputChange,
    onSelectCategory,
    onUnselectCategory,
    onChipInputChange,
    onChipSelectedChange,
    categoryPlaceholder = 'Search...',
    chipPlaceholder = 'Search...',
}: FilterChipsProps<TCategory>) {
    const chips = typedEntries(chipFilterState.chips).map(
        ([categoryValue, { category, selected }]) => {
            const chipItems =
                (chipFilters[categoryValue] as Item[] | undefined) ?? [];
            return (
                <FilterChip
                    key={categoryValue}
                    categoryItem={{
                        value: categoryValue,
                        label: categoryLabelTransform(category),
                    }}
                    chipFilters={chipItems}
                    selected={selected}
                    onChipSelectedChange={onChipSelectedChange}
                    onRemoveChip={onUnselectCategory}
                />
            );
        },
    );

    return (
        <div>
            <DialogTrigger>
                <Label>Mods</Label>
                <Button>Select mods</Button>
                <Popover className={styles.content}>
                    <ComboBox
                        defaultFilter={() => true}
                        inputValue={chipFilterState.input}
                        onInputChange={(input) => {
                            onCategoryInputChange(input);
                        }}
                        selectedKey={null}
                        onSelectionChange={(value) => {
                            if (value === null) return;
                            onSelectCategory(String(value));
                            onCategoryInputChange('');
                        }}
                        aria-label="Versions"
                    >
                        <Input placeholder={categoryPlaceholder}></Input>
                        <Popover>
                            <ListBox>
                                {categoryFilters.map((item) => (
                                    <ListBoxItem
                                        key={item.value}
                                        className={listBoxStyles.listboxItem}
                                        id={item.value}
                                    >
                                        {item.label}
                                    </ListBoxItem>
                                ))}
                            </ListBox>
                        </Popover>
                    </ComboBox>
                    {chips}
                </Popover>
            </DialogTrigger>
        </div>
    );
}
