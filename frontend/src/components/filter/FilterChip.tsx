import {
    Button,
    Label,
    Popover,
    Select,
    SelectValue,
} from 'react-aria-components';

import type { Item } from '@/types/component';

import styles from './FilterChip.module.css';
import { ListBox, ListBoxItem } from '../ListBox/ListBox';

interface FilterChipProps {
    categoryItem: Item;
    chipFilters: Item[];
    selected: Item | undefined;
    onChipSelectedChange: (
        categoryValue: string,
        selected: Item | undefined,
    ) => void;
    onRemoveChip: (categoryValue: string) => void;
}

export default function FilterChip({
    categoryItem,
    chipFilters,
    selected,
    onChipSelectedChange,
    onRemoveChip,
}: FilterChipProps) {
    const NONE_LABEL = 'None';

    return (
        <div key={categoryItem.value} className={styles.chip}>
            <Select
                className={styles.select}
                value={selected?.value}
                onChange={(value) => {
                    const nextSelected = chipFilters.find(
                        (item) => item.value === value,
                    );
                    onChipSelectedChange(categoryItem.value, nextSelected);
                }}
            >
                <Label>{`${categoryItem.label} (${selected?.label ?? NONE_LABEL})`}</Label>
                <Button className={styles.button}>
                    <SelectValue />
                </Button>
                <Popover className={styles.content}>
                    <ListBox>
                        {chipFilters.map(({ value, label }) => (
                            <ListBoxItem key={value} id={value}>
                                {label}
                            </ListBoxItem>
                        ))}
                    </ListBox>
                </Popover>
            </Select>
            <Button onPress={() => onRemoveChip(categoryItem.value)}>X</Button>
        </div>
    );
}
