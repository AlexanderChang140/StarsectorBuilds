import { clamp } from '@/utils/math';

import styles from './ShipStats.module.css';

export type StatChange = {
    base: number | null;
    delta: number;
};

interface ShipInfoProps {
    className?: string;
    currOp: number;
    maxOp: number | null;
    topSpeed: StatChange;
    armor: StatChange;
    hull: StatChange;
    capacity: StatChange;
    dissipation: StatChange;
    capacitors: number;
    vents: number;
    shieldArc: StatChange;
    shieldUpkeep: number | null | undefined;
    shieldEfficiency: number | null | undefined;
    weaponFluxUpkeep: number;
    isInteractable?: boolean;
    onChangeCapacitors?: (e: React.MouseEvent, value: number) => void;
    onChangeVents?: (e: React.MouseEvent, value: number) => void;
}

export function ShipInfo({
    className = '',
    currOp,
    maxOp,
    topSpeed,
    armor,
    hull,
    capacity,
    dissipation,
    capacitors,
    vents,
    shieldArc,
    shieldEfficiency,
    shieldUpkeep,
    weaponFluxUpkeep,
    isInteractable = true,
    onChangeCapacitors,
    onChangeVents,
}: ShipInfoProps) {
    return (
        <div className={`${styles.shipInfo} ${className}`}>
            <FillBar value={currOp} max={maxOp ?? 0} />
            <div className={styles.line}>
                <Stat label={'TOP SPEED'} value={topSpeed?.base ?? 'N/A'} />
                <Stat label={'ARMOR'} value={armor?.base ?? 'N/A'} />
                <Stat label={'HULL'} value={hull?.base ?? 'N/A'} />
            </div>
            <div className={styles.line}>
                <div className={styles.capVent}>
                    Capacitors
                    {isInteractable && (
                        <button
                            className={styles.button}
                            onClick={(e) => onChangeCapacitors?.(e, -1)}
                        >
                            -
                        </button>
                    )}
                    <span className={styles.capVentNum}>{capacitors}</span>
                    {isInteractable && (
                        <button
                            className={styles.button}
                            onClick={(e) => onChangeCapacitors?.(e, 1)}
                        >
                            +
                        </button>
                    )}
                </div>
                <Stat
                    label={'FLUX CAPACITY'}
                    value={
                        capacity.base ? capacity.base + capacity.delta : 'N/A'
                    }
                    color={
                        capacity.base ? getStatColor(capacity.delta) : 'white'
                    }
                />
            </div>
            <div className={styles.line}>
                <div className={styles.capVent}>
                    Vents
                    {isInteractable && (
                        <button
                            className={styles.button}
                            onClick={(e) => onChangeVents?.(e, -1)}
                        >
                            -
                        </button>
                    )}
                    <span className={styles.capVentNum}>{vents}</span>
                    {isInteractable && (
                        <button
                            className={styles.button}
                            onClick={(e) => onChangeVents?.(e, 1)}
                        >
                            +
                        </button>
                    )}
                </div>
                <Stat
                    label={'FLUX DISSIPATION'}
                    value={
                        dissipation.base
                            ? dissipation.base + dissipation.delta
                            : 'N/A'
                    }
                    color={
                        dissipation.base
                            ? getStatColor(dissipation.delta)
                            : 'white'
                    }
                />
            </div>
            <div className={styles.line}>
                <Stat label={'SHIELD ARC'} value={shieldArc?.base ?? 'N/A'} />
                <Stat
                    label={'SHIELD FLUX / SEC'}
                    value={shieldUpkeep?.toFixed(1)}
                />
                <Stat
                    label={'SHIELD FLUX / DAM'}
                    value={shieldEfficiency?.toFixed(1)}
                />
            </div>
            <div className={styles.line}>
                <Stat label={'WEAPON FLUX / SEC'} value={weaponFluxUpkeep} />
            </div>
        </div>
    );
}

const Stat = ({
    label,
    value,
    color,
}: {
    label: string;
    value: string | number | null | undefined;
    color?: string;
}) => (
    <div className={styles.stat}>
        <div className={styles.label}>{label}</div>
        <div
            className={styles.value}
            style={{ color: color ?? 'var(--text2-color)' }}
        >
            {value ?? '---'}
        </div>
    </div>
);

function getStatColor(delta: number) {
    if (delta > 0) {
        return 'var(--positive-color)';
    } else if (delta < 0) {
        return 'var(--negative-color)';
    } else {
        return 'var(--text2-color)';
    }
}

const FillBar = ({ value, max }: { value: number; max: number }) => {
    const percentage = max !== 0 ? Math.min((value / max) * 100, 100) : 0;
    const overflow = max !== 0 ? clamp((value / max) * 100 - 100, 0, 100) : 0;

    return (
        <div className={styles.track}>
            <div
                className={styles.fill}
                style={{
                    width: `${percentage}%`,
                }}
            />
            <div
                className={styles.overflow}
                style={{
                    width: `${overflow}%`,
                }}
            />
            <div className={styles.op}>{`${value} / ${max}`}</div>
        </div>
    );
};
