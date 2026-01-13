import clsx from 'clsx';

import styles from './Select.module.css';

export type Item = {
    value: string;
    label: string;
};

export type SelectedItems = Set<string>;

interface SelectProps {
    items: readonly Item[];
    selected: SelectedItems | undefined;
    onChange: (selected: SelectedItems) => void;
    isMultiSelect?: boolean;
    allowDeselect?: boolean;
}

export default function Select({
    items,
    selected,
    onChange,
    isMultiSelect = false,
    allowDeselect = true,
}: SelectProps) {
    const handleItemClick = (value: string) => {
        const isItemSelected = selected?.has(value) ?? false;
        if (isMultiSelect && selected) {
            if (isItemSelected) {
                onChange(new Set([...selected].filter((v) => v !== value)));
            } else {
                onChange(new Set([...selected, value]));
            }
        } else {
            if (allowDeselect && isItemSelected) {
                onChange(new Set());
            } else {
                onChange(new Set([value]));
            }
        }
    };

    return (
        <div className={styles.items}>
            {items.map((item) => (
                <button
                    key={item.value}
                    className={clsx(
                        styles.item,
                        selected?.has(item.value) && styles.selected,
                    )}
                    onClick={() => handleItemClick(item.value)}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}
