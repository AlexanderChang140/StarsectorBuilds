import Select, {
    type Item,
    type SelectedItems,
} from '@/components/select/Select';

interface ComboboxProps<T> {
    items: readonly Item[];
    Dropdown: React.ComponentType<T>;
    dropdownProps: Omit<T, 'children'>;
    selected: SelectedItems;
    onSelectedChange: (selected: SelectedItems) => void;
    isMultiSelect?: boolean;
}

export default function Combobox<T>({
    items,
    Dropdown,
    dropdownProps,
    selected,
    onSelectedChange,
    isMultiSelect = false,
}: ComboboxProps<T>) {
    return (
        <div>
            <Dropdown {...(dropdownProps as T)}>
                <Select
                    items={items}
                    selected={selected}
                    onChange={(selected) => onSelectedChange(selected)}
                    isMultiSelect={isMultiSelect}
                ></Select>
            </Dropdown>
        </div>
    );
}
