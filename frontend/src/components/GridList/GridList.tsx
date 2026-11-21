import {
    GridList as AriaGridList,
    GridListItem as AriaGridListItem,
    type GridListItemProps,
    type GridListProps,
} from 'react-aria-components';

import styles from './GridList.module.css';

export function GridList<T extends object>({
    children,
    className,
    layout = 'grid',
    ...props
}: GridListProps<T>) {
    return (
        <AriaGridList
            className={`${styles.gridList} ${className ?? ''}`}
            {...props}
            layout={layout}
        >
            {children}
        </AriaGridList>
    );
}

export function GridListItem({
    children,
    ...props
}: Omit<GridListItemProps, 'children'> & {
    children?: React.ReactNode;
}) {
    const textValue = typeof children === 'string' ? children : undefined;
    return (
        <AriaGridListItem
            className={styles.gridListItem}
            textValue={textValue}
            {...props}
        >
            {children}
        </AriaGridListItem>
    );
}
