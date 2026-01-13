import Select, {
    type Item,
    type SelectedItems,
} from '@/components/select/Select';

interface ComboboxProps<T> {
    value: string;
    items: readonly Item[];
    Dropdown: React.ComponentType<T>;
    dropdownProps: Omit<T, 'children'>;
    selected: SelectedItems;
    onSelectedChange: (value: string, selected: SelectedItems) => void;
    isMultiSelect?: boolean;
}

export default function Combobox<T>({
    value,
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
                    onChange={(selected) => onSelectedChange(value, selected)}
                    isMultiSelect={isMultiSelect}
                ></Select>
            </Dropdown>
        </div>
    );
}
