import type { Projection } from '@starsector-builds/shared/types';
import type { WeaponVersionFull } from '@starsector-builds/shared/weapons/schema';

import { capitalize } from '@/utils/string';

import { MiscStat, RowSpace, StatRow } from './Info';
import styles from './Info.module.css';
import type { WEAPON_KEYS } from '../../constants/keys';

interface WeaponInfoProps {
    weapon: Projection<WeaponVersionFull, typeof WEAPON_KEYS>;
}

export default function WeaponInfo({ weapon }: WeaponInfoProps) {
    const fluxPerDamage =
        weapon.flux_per_second != null && weapon.damage_per_second != null
            ? (weapon.flux_per_second / weapon.damage_per_second).toFixed(2)
            : null;

    return (
        <article className={styles.info}>
            <section className={styles.description}>
                <h3 className={styles.displayName}>{weapon.display_name}</h3>
                <p>
                    <span className={styles.designTypeLabel}>
                        Design type:{' '}
                    </span>
                    {weapon.manufacturer ?? 'Common'}
                </p>
                {weapon.text1 && <p>{weapon.text1?.split(/\r?\n/)[0]}</p>}
                {weapon.text2 && <p>{weapon.text2}</p>}
                <p>
                    Base value:{' '}
                    <span className={styles.baseValue}>
                        {weapon.base_value}¢
                    </span>
                </p>
            </section>
            <section>
                <h4 className={styles.sectionHeader}>Primary data</h4>
                <dl className={styles.data}>
                    <StatRow
                        label={'Primary role'}
                        value={weapon.primary_role_str}
                    />
                    <StatRow
                        label={'Mount type'}
                        value={`${capitalize(weapon.weapon_size)}, ${capitalize(weapon.weapon_type)}`}
                    />
                    <StatRow label={'Ordnance points'} value={weapon.op_cost} />
                    <RowSpace />
                    <StatRow label={'Range'} value={weapon.weapon_range} />
                    <StatRow label={'Damage'} value={weapon.damage_per_shot} />
                    <StatRow
                        label={'Damage / second'}
                        value={weapon.damage_per_second}
                    />
                    <StatRow label={'EMP damage'} value={weapon.emp} />
                    <RowSpace />
                    <StatRow
                        label={'Flux / second'}
                        value={weapon.flux_per_second}
                    />
                    <StatRow
                        label={'Flux / shot'}
                        value={weapon.flux_per_shot}
                        enabled={weapon.flux_per_shot != 0}
                    />
                    <StatRow label={'Flux / damage'} value={fluxPerDamage} />
                </dl>
                <p className={styles.miscTip}>{getMiscTip(weapon)}</p>
            </section>
            <section>
                <h4 className={styles.sectionHeader}>Ancillary data</h4>
                <dl className={styles.data}>
                    <dt className={styles.label}>Damage type</dt>
                    <dd className={styles.value}>
                        <div>
                            {getDamageTypeStr(
                                weapon.damage_type,
                                weapon.beam_speed,
                            )}
                        </div>
                        <div>
                            {getDamageTypeTip(
                                weapon.damage_type,
                                weapon.beam_speed,
                            )}
                        </div>
                    </dd>
                    <StatRow label={'Accuracy'} value={weapon.accuracy_str} />
                    <StatRow label={'Turn rate'} value={weapon.turn_rate_str} />
                    <RowSpace />
                    <StatRow
                        label={'Max charges'}
                        value={weapon.max_ammo}
                        enabled={weapon.ammo_per_second != null}
                    />
                    <StatRow
                        label={'Seconds / recharge'}
                        value={weapon.ammo_per_second}
                    />
                    <StatRow
                        label={capitalize(
                            `${getAmmoStr(weapon.damage_type)} gained`,
                        )}
                        value={weapon.reload_size}
                        enabled={weapon.ammo_per_second != null}
                    />
                    <RowSpace />
                    <StatRow label={'Speed'} value={weapon.proj_speed_str} />
                    <StatRow label={'Tracking'} value={weapon.tracking_str} />
                    <StatRow label={'Hitpoints'} value={weapon.hitpoints} />
                    <StatRow
                        label={'Refire delay (seconds)'}
                        value={weapon.chargedown}
                    />
                </dl>
            </section>
            <section>
                <h5>Base stats:</h5>
                <ul>
                    <MiscStat
                        label={'Turn rate'}
                        value={weapon.turn_rate}
                        append={'°/s'}
                    />
                    <MiscStat
                        label={'Beam speed'}
                        value={weapon.beam_speed}
                        append={'u/s'}
                    />
                    <MiscStat
                        label={'Min spread'}
                        value={weapon.min_spread}
                        append={'°'}
                    />
                    <MiscStat
                        label={'Max spread'}
                        value={weapon.max_spread}
                        append={'°'}
                    />
                    <MiscStat
                        label={'Spread per shot'}
                        value={weapon.spread_per_shot}
                        append={'°'}
                    />
                    <MiscStat
                        label={'Spread decay'}
                        value={weapon.spread_decay_per_second}
                        append={'°/s'}
                    />
                    <MiscStat
                        label={'Projectile speed'}
                        value={weapon.speed}
                        append={'u/s'}
                    />
                    <MiscStat
                        label={'Projectile health'}
                        value={weapon.hitpoints}
                        append={'hp'}
                    />
                    <MiscStat
                        label={'Launch speed'}
                        value={weapon.launch_speed}
                        append={'u/s'}
                    />
                    <MiscStat
                        label={'Flight time'}
                        value={weapon.flight_time}
                        append={'s'}
                    />
                    <MiscStat
                        label={'Acceleration'}
                        value={'TODO'}
                        append={'u/s²'}
                    />
                    <MiscStat
                        label={'Deceleration'}
                        value={'TODO'}
                        append={'u/s²'}
                    />
                    <MiscStat
                        label={'Max turn rate'}
                        value={'TODO'}
                        append={'°/s'}
                    />
                    <MiscStat
                        label={'Turn acceleration'}
                        value={'TODO'}
                        append={'°/s²'}
                    />
                </ul>
            </section>
        </article>
    );
}

function getAmmoStr(damageType: string) {
    return damageType == 'energy' ? 'charges' : 'ammo';
}

function getMiscTip(weapon: Projection<WeaponVersionFull, typeof WEAPON_KEYS>) {
    const tips = [];
    if (!weapon.flux_per_second && !weapon.flux_per_shot) {
        tips.push('no flux cost to fire');
    }
    if (weapon.max_ammo && !weapon.ammo_per_second) {
        tips.push(
            `limited ${getAmmoStr(weapon.damage_type)} (${weapon.max_ammo})`,
        );
    }
    return capitalize(tips.join(', '));
}

const DAMAGE_TYPE_STR: Record<string, string> = {
    none: 'None',
    kinetic: 'Kinetic',
    energy: 'Energy',
    high_explosive: 'High Explosive',
    fragmentation: 'Fragmentation',
};

function isBeam(beamSpeed: number | null) {
    return beamSpeed != null && beamSpeed > 0;
}

function getDamageTypeStr(
    damageType: string,
    beamSpeed: number | null,
): string {
    const base = DAMAGE_TYPE_STR[damageType.toLowerCase()] ?? 'None';

    return isBeam(beamSpeed) ? `${base} (Beam)` : base;
}

const DAMAGE_TYPE_TIP: Record<string, string> = {
    kinetic: '200% vs shields, 50% vs armor',
    energy: '100% vs shields, armor, and hull',
    high_explosive: '200% vs armor, 50% vs shields',
    fragmentation: '25% vs shields and armor, 100% vs hull',
};

function getDamageTypeTip(damageType: string, beamSpeed: number | null) {
    const base: string | null =
        DAMAGE_TYPE_TIP[damageType?.toLowerCase()] ?? null;
    return base ? (isBeam(beamSpeed) ? `${base} (no hard flux)` : base) : null;
}
