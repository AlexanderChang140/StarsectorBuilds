import { ListBox } from '@/components/ListBox/ListBox';

import styles from './GenericList.module.css';

interface GenericListProps<T> {
    items: T[];
    renderItem: (item: T) => React.ReactNode;
    ariaLabel: string;
}

export default function GenericList<T>({
    items,
    renderItem,
    ariaLabel,
}: GenericListProps<T>) {
    return (
        <ListBox className={styles.listbox} aria-label={ariaLabel}>
            {items.map((item) => renderItem(item))}
        </ListBox>
    );
}
