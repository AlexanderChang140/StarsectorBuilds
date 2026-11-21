import type { Projection } from '@starsector-builds/shared/types';
import type { WingVersionFull } from '@starsector-builds/shared/wings/schema';

import { RowSpace, StatRow } from './Info';
import styles from './Info.module.css';
import type { WING_KEYS } from '../../constants/keys';

interface WeaponInfoProps {
    wing: Projection<WingVersionFull, typeof WING_KEYS>;
}

export default function WingInfo({ wing }: WeaponInfoProps) {
    console.log(wing)
    return (
        <article className={styles.info}>
            <section className={styles.description}>
                <h3 className={styles.displayName}>{wing.display_name}</h3>
                <p>
                    <span className={styles.designTypeLabel}>
                        Design type:{' '}
                    </span>
                    {wing.manufacturer ?? 'Common'}
                </p>
                {wing.text1 && <p>{wing.text1?.split(/\r?\n/)[0]}</p>}
                {wing.text2 && <p>{wing.text2}</p>}
                <p>
                    Base value:{' '}
                    <span className={styles.baseValue}>{wing.base_value}¢</span>
                </p>
            </section>
            <section>
                <h4 className={styles.sectionHeader}>Technical data</h4>
                <dl className={styles.data}>
                    <StatRow label={'Primary role'} value={wing.role_desc} />
                    <StatRow label={'Ordnance points'} value={wing.op_cost} />
                    <StatRow
                        label={'Crew per fighter'}
                        value={wing.min_crew ?? wing.max_crew}
                    />
                    <StatRow
                        label={'Maximum engagement range'}
                        value={wing.deployment_range}
                    />
                    <RowSpace />
                    <StatRow
                        label={'Fighters in wing'}
                        value={wing.num_fighters}
                    />
                    <StatRow
                        label={'Base replacement time (seconds)'}
                        value={wing.refit_time}
                    />
                    <StatRow
                        label={'Hull integrity'}
                        value={wing.hitpoints}
                    />
                    <StatRow label={'Armor rating'} value={wing.armor_rating} />
                    <StatRow label={'Top speed'} value={wing.max_speed} />
                </dl>
            </section>
            <RowSpace />
            <section>
                <dl className={styles.data}>
                    <dt>System:</dt>
                    <dd></dd>
                    <dt>Arnaments:</dt>
                    <dd></dd>
                    <dt>Hull mods:</dt>
                    <dd></dd>
                </dl>
            </section>
        </article>
    );
}
