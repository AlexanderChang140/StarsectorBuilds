import { useState } from 'react';

import styles from './Dropdown.module.css';

interface SearchDropdownProps {
    placeholder: string;
    onInputChange: (input: string) => void;
    isActive?: boolean;
    onActiveChange?: (active: boolean) => void;
    children: React.ReactNode;
}

export default function SearchDropdown({
    placeholder,
    isActive,
    onActiveChange,
    onInputChange,
    children,
}: SearchDropdownProps) {
    const [internalActive, setInternalActive] = useState(false);

    const isControlled = isActive !== undefined;
    const active = isControlled ? isActive : internalActive;

    const setActive = (value: boolean) => {
        if (!isControlled) setInternalActive(value);
        onActiveChange?.(value);
    };

    return (
        <div
            className={styles.dropdown}
            onFocus={() => setActive(true)}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setActive(false);
                    onInputChange?.('');
                }
            }}
        >
            <input
                className={styles.activator}
                placeholder={placeholder}
                onChange={(e) => onInputChange(e.target.value)}
            />
            {active && <div className={styles.menu}>{children}</div>}
        </div>
    );
}
