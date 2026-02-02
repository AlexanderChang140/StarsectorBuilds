import {
    Button,
    Label,
    Popover,
    Select,
    SelectValue,
} from 'react-aria-components';

import type { Item } from '@/types/component';

import styles from './LabeledSelectChip.module.css';
import { ListBox, ListBoxItem } from '../ListBox/ListBox';

type Options = {
    noneLabel?: string;
};

interface LabeledSelectChipProps {
    categoryItem: Item;
    items: Item[];
    selected: Item | undefined;
    onSelectedChange: (
        categoryValue: string,
        selected: Item | undefined,
    ) => void;
    onRemoveChip: (categoryValue: string) => void;
    options?: Options;
}

export default function LabeledSelectChip({
    categoryItem,
    items,
    selected,
    onSelectedChange,
    onRemoveChip,
    options,
}: LabeledSelectChipProps) {
    const defaultOptions: Options = {
        noneLabel: 'None',
    };

    const mergedOptions = {
        ...defaultOptions,
        options,
    };

    return (
        <div className={styles.chip}>
            <Select
                className={styles.select}
                value={selected?.value}
                onChange={(value) => {
                    const nextSelected = items.find(
                        (item) => item.value === value,
                    );
                    onSelectedChange(categoryItem.value, nextSelected);
                }}
            >
                <Label>{`${categoryItem.label} (${selected?.label ?? mergedOptions.noneLabel})`}</Label>
                <Button className={styles.button}>
                    <SelectValue />
                </Button>
                <Popover className={styles.content}>
                    <ListBox>
                        {items.map(({ value, label }) => (
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
