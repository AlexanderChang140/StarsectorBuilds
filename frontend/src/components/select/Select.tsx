import styles from './Select.module.css';

export type Item = {
    value: string;
    label: string;
};

interface DropdownProps {
    items: Item[];
    selected: string[];
    onChange: (selected: string[]) => void;
    isMultiSelect?: boolean;
    showSelected?: boolean;
    allowDeselect?: boolean;
}

export default function Select({
    items,
    selected = [],
    onChange,
    isMultiSelect = false,
    showSelected = true,
    allowDeselect = true,
}: DropdownProps) {
    const handleItemClick = (item: string) => {
        if (isMultiSelect) {
            if (selected.includes(item)) {
                onChange(selected.filter((i) => i !== item));
            } else {
                onChange([...selected, item]);
            }
        } else {
            if (allowDeselect && selected[0] === item) {
                onChange([]);
            } else {
                onChange([item]);
            }
        }
    };

    const shownItems = showSelected
        ? items
        : items.filter((item) => selected.includes(item.value));

    return (
        <div className={styles.items}>
            {shownItems.map((item) => (
                <button
                    key={item.value}
                    className={styles.item}
                    onClick={() => handleItemClick(item.value)}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}
