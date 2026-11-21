import { clsx } from 'clsx';

import styles from './Info.module.css';

export const StatRow = ({
    label,
    value,
    enabled = true,
    customStyles,
}: {
    label: string;
    value: string | number | null;
    enabled?: boolean;
    customStyles?: Record<string, string>;
}) => {
    if (value == null || !enabled) {
        return null;
    }

    return (
        <>
            <dt
                className={clsx(
                    styles.label,
                    customStyles && customStyles.label,
                )}
            >
                {label}
            </dt>
            <dd
                className={clsx(
                    styles.value,
                    customStyles && customStyles.value,
                )}
            >
                {value}
            </dd>
        </>
    );
};

export const MiscStat = ({
    label,
    value,
    append,
}: {
    label: string;
    value: string | number | null;
    append?: string;
}) => {
    if (value == null) {
        return null;
    }

    //TODO: Use dt/dd
    return (
        <li>
            {label}: {value}
            {append}
        </li>
    );
};

export const RowSpace = () => (
    <div className={styles.rowSpace} aria-hidden={true} />
);
