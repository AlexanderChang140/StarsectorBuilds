import ButtonDropdown from '@/components/dropdown/ButtonDropdown';
import SearchDropdown from '@/components/dropdown/SearchDropdown';
import Select, {
    type Item,
    type SelectedItems,
} from '@/components/select/Select';
import { typedEntries } from '@/utils/object';

import styles from './FilterChips.module.css';

export type ChipState = {
    parentLabel: string;
    input: string;
    selected?: Item;
};

export type ChipFilterState = {
    input: string;
    chips: Record<string, ChipState>;
};

interface FilterChipsProps {
    categoryFilters: Item[];
    chipFilters: Record<string, Item[]>;
    filterState: ChipFilterState;
    onCategorySelectedChange: (selected: SelectedItems) => void;
    onCategoryInputChange: (input: string) => void;
    onChipInputChange: (parentValue: string, input: string) => void;
    onChipSelectedChange: (
        parentValue: string,
        selected: string | undefined,
    ) => void;
    filterPlaceholder?: string;
    chipPlaceholder?: string;
}

export default function FilterChips({
    categoryFilters,
    chipFilters,
    filterState,
    onCategorySelectedChange,
    onCategoryInputChange,
    onChipInputChange,
    onChipSelectedChange,
    filterPlaceholder = 'Search...',
    chipPlaceholder = 'Search...',
}: FilterChipsProps) {
    const NONE_LABEL = 'None';

    const handleChipSelectedChange = (
        parentValue: string,
        selected: SelectedItems,
    ) => {
        const value = [...selected][0];
        onChipSelectedChange(parentValue, value);
    };

    const chips = typedEntries(filterState.chips).map(
        ([parentValue, { parentLabel, selected }]) => {
            const chipItems = chipFilters[parentValue];
            const currSelected: Set<string> = selected
                ? new Set([selected.value])
                : new Set();

            return (
                <div key={parentValue} className={styles.chip}>
                    {`${parentLabel} (${selected?.label ?? NONE_LABEL})`}
                    <div className={styles.dropdown}>
                        <SearchDropdown
                            placeholder={chipPlaceholder}
                            onInputChange={(input) =>
                                onChipInputChange(parentValue, input)
                            }
                        >
                            <Select
                                items={chipItems}
                                selected={currSelected}
                                onChange={(selected) =>
                                    handleChipSelectedChange(
                                        parentValue,
                                        selected,
                                    )
                                }
                            />
                        </SearchDropdown>
                    </div>
                </div>
            );
        },
    );

    const selected = new Set(Object.keys(filterState.chips));

    return (
        <ButtonDropdown label={'Filter'}>
            <div className="select">
                <SearchDropdown
                    placeholder={filterPlaceholder}
                    onInputChange={onCategoryInputChange}
                >
                    <Select
                        items={categoryFilters}
                        selected={selected}
                        onChange={onCategorySelectedChange}
                        isMultiSelect={true}
                    />
                </SearchDropdown>
                {chips}
            </div>
        </ButtonDropdown>
    );
}
