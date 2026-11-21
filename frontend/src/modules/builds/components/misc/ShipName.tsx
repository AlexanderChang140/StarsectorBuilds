import type { ShipVersionFull } from '@starsector-builds/shared/ships/schema';
import type { Projection } from '@starsector-builds/shared/types';

import styles from './ShipName.module.css';

type ShipKeys = ['display_name', 'designation'];

interface ShipNameProps {
    ship: Projection<ShipVersionFull, ShipKeys>;
    className?: string;
}

export function ShipName({ ship, className }: ShipNameProps) {
    return (
        <div className={className}>
            <h2 className={styles.name}>{ship.display_name ?? 'Unknown'}</h2>
            <div className={styles.designation}>{ship.designation}</div>
        </div>
    );
}
