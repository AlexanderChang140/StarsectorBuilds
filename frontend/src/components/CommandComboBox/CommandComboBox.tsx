import {
    Button,
    ComboBox,
    DialogTrigger,
    Input,
    Label,
    ListBoxItem,
    Popover,
} from 'react-aria-components';

import type { Item } from '@/types/component';

import styles from './CommandComboBox.module.css';
import { ListBox } from '../ListBox/ListBox';

type Options = {
    button?: {
        label?: string;
        isLabelVisible?: boolean;
        text?: string;
    };
    comboBox?: {
        defaultFilter?: (textValue: string, inputValue: string) => boolean;
        label?: string;
    };
    placeholder?: string;
};

interface CommandComboBoxProps {
    commands: readonly Item[];
    input: string;
    onInputChange: (input: string) => void;
    onSelect: (value: string) => void;
    options?: Options;
    children?: React.ReactNode;
}

export default function CommandComboBox({
    commands,
    input,
    onInputChange,
    onSelect,
    options,
    children,
}: CommandComboBoxProps) {
    const defaultOptions = {
        button: {
            label: 'Commands',
            isLabelVisible: true,
            text: 'Select a command',
        },
        comboBox: {
            defaultFilter: undefined,
            label: 'Commands',
        },
        placeholder: 'Search...',
    } satisfies Options;

    const mergedOptions = {
        button: {
            ...defaultOptions.button,
            ...options?.button,
        },
        comboBox: {
            ...defaultOptions.comboBox,
            ...options?.comboBox,
        },
        placeholder: options?.placeholder ?? defaultOptions.placeholder,
    };

    const { button, comboBox, placeholder } = mergedOptions;

    return (
        <div>
            <DialogTrigger>
                {button.isLabelVisible && <Label>{button.label}</Label>}
                <Button aria-label={button.label}>{button.text}</Button>
                <Popover className={styles.content}>
                    <ComboBox
                        defaultFilter={comboBox.defaultFilter}
                        inputValue={input}
                        onInputChange={(input) => {
                            onInputChange(input);
                        }}
                        selectedKey={null}
                        onSelectionChange={(value) => {
                            if (value !== null) {
                                onSelect(String(value));
                                onInputChange('');
                            }
                        }}
                        aria-label={comboBox.label}
                    >
                        <Input placeholder={placeholder}></Input>
                        <Popover>
                            <ListBox>
                                {commands.map((item) => (
                                    <ListBoxItem
                                        key={item.value}
                                        id={item.value}
                                    >
                                        {item.label}
                                    </ListBoxItem>
                                ))}
                            </ListBox>
                        </Popover>
                    </ComboBox>
                    {children}
                </Popover>
            </DialogTrigger>
        </div>
    );
}
