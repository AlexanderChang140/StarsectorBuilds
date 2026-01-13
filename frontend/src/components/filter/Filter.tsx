import ButtonDropdown from '@/components/dropdown/ButtonDropdown';
import Select, {
    type Item,
    type SelectedItems,
} from '@/components/select/Select';

interface FilterProps {
    value: string;
    label: string;
    items: readonly Item[];
    selected: SelectedItems;
    isActive: boolean;
    onActiveChange: (field: string, active: boolean) => void;
    onSelectedChange: (field: string, selected: SelectedItems) => void;
    isMultiSelect?: boolean;
}

export default function Filter({
    value,
    label,
    items,
    selected,
    isActive,
    onActiveChange,
    onSelectedChange,
    isMultiSelect = false,
}: FilterProps) {
    return (
        <div key={value}>
            <ButtonDropdown
                label={label}
                isActive={isActive}
                onActiveChange={(active) => onActiveChange(value, active)}
            >
                <Select
                    items={items}
                    selected={selected}
                    onChange={(selected) => onSelectedChange(value, selected)}
                    isMultiSelect={isMultiSelect}
                ></Select>
            </ButtonDropdown>
        </div>
    );
}
