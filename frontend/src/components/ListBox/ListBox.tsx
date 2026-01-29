import {
    ListBox as AriaListBox,
    ListBoxItem as AriaListBoxItem,
    composeRenderProps,
    type ListBoxItemProps,
    type ListBoxProps,
} from 'react-aria-components';

import styles from './Listbox.module.css';
import { Text } from '../Content/Content';

export function ListBox<T extends object>({
    children,
    ...props
}: ListBoxProps<T>) {
    return (
        <AriaListBox className={styles.listbox} {...props}>
            {children}
        </AriaListBox>
    );
}

export function ListBoxItem(props: ListBoxItemProps) {
    const textValue =
        props.textValue ||
        (typeof props.children === 'string' ? props.children : undefined);
    return (
        <AriaListBoxItem
            className={styles.listboxItem}
            {...props}
            textValue={textValue}
        >
            {composeRenderProps(props.children, (children) =>
                typeof children === 'string' ? (
                    <Text slot="label">{children}</Text>
                ) : (
                    children
                ),
            )}
        </AriaListBoxItem>
    );
}
