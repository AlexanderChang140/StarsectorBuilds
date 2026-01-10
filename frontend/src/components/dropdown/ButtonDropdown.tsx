import { useState } from 'react';

import styles from './Dropdown.module.css';

interface ButtonDropdownProps {
    label: string;
    isActive?: boolean;
    onActiveChange?: (active: boolean) => void;
    children: React.ReactNode;
}

export default function ButtonDropdown({
    label,
    isActive,
    onActiveChange,
    children,
}: ButtonDropdownProps) {
    const [internalActive, setInternalActive] = useState(false);

    const isControlled = isActive !== undefined;
    const active = isControlled ? isActive : internalActive;

    const setActive = (value: boolean) => {
        if (!isControlled) setInternalActive(value);
        onActiveChange?.(value);
    };

    return (
        <div className={styles.dropdown}>
            <button
                className={styles.activator}
                onClick={() => setActive(!active)}
            >
                {label}
            </button>
            {active && <div className={styles.menu}>{children}</div>}
        </div>
    );
}
