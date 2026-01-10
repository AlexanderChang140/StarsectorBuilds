import ButtonDropdown from '@/components/dropdown/ButtonDropdown';
import SearchDropdown from '@/components/dropdown/SearchDropdown';
import Select, { type Item } from '@/components/select/Select';

import styles from './FilterChips.module.css';

type Filter = {
    item: Item;
    children?: Item[];
};

type ChipState = {
    input: string;
    selected?: string;
};

type FilterState = {
    input: string;
    chips: Record<string, ChipState>;
};

interface FilterChipsProps {
    filters: Filter[];
    filterState: FilterState;
    onSelectedChange: (selected: string[]) => void;
    onInputChange: (input: string) => void;
    onChipInputChange: (value: string, input: string) => void;
    onChipSelectedChange: (value: string, selected: string[]) => void;
    filterPlaceholder?: string;
    chipPlaceholder?: string;
}

export default function FilterChips({
    filters,
    filterState,
    onSelectedChange,
    onInputChange,
    onChipInputChange,
    onChipSelectedChange,
    filterPlaceholder = 'Search...',
    chipPlaceholder = 'Search...',
}: FilterChipsProps) {
    const NONE_LABEL = 'None';

    const chips = Object.keys(filterState.chips).map((value) => {
        const parent = filters.find((filter) => filter.item.value === value);
        const children = parent?.children ?? [];

        const parentLabel = parent?.item.label;
        const selectedChildValue = filterState.chips[value]?.selected;
        const childLabel =
            children.find((item) => item.value === selectedChildValue)?.label ??
            NONE_LABEL;

        const selectedChildren =
            filterState.chips[value]?.selected !== undefined
                ? [filterState.chips[value].selected]
                : [];

        return (
            <div key={value} className={styles.chip}>
                {`${parentLabel} (${childLabel})`}
                <div className={styles.dropdown}>
                    <SearchDropdown
                        placeholder={chipPlaceholder}
                        onInputChange={(input) =>
                            onChipInputChange(value, input)
                        }
                    >
                        <Select
                            items={children}
                            selected={selectedChildren}
                            onChange={(selected) =>
                                onChipSelectedChange(value, selected)
                            }
                        />
                    </SearchDropdown>
                </div>
            </div>
        );
    });

    return (
        <ButtonDropdown label={'Filter'}>
            <div className="select">
                <SearchDropdown
                    placeholder={filterPlaceholder}
                    onInputChange={onInputChange}
                >
                    <Select
                        items={filters.map((filter) => filter.item)}
                        selected={Object.keys(filterState.chips)}
                        onChange={onSelectedChange}
                        isMultiSelect={true}
                    />
                </SearchDropdown>
                {chips}
            </div>
        </ButtonDropdown>
    );
}
