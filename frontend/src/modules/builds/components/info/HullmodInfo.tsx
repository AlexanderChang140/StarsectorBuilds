import type { HullmodVersionFull } from '@starsector-builds/shared/hullmods/types';
import type { Projection } from '@starsector-builds/shared/types';
import { clsx } from 'clsx';

import customStyles from './HullmodInfo.module.css';
import styles from './Info.module.css';

type HullmodKeys = ['display_name', 'hullmod_desc', 'hullmod_desc_s_mod'];

interface HullmodInfoProps {
    hullmod: Projection<HullmodVersionFull, HullmodKeys>;
}

export default function HullmodInfo({ hullmod }: HullmodInfoProps) {
    return (
        <article className={styles.info}>
            <section className={styles.description}>
                <h3 className={styles.displayName}>{hullmod.display_name}</h3>
                <p className={customStyles.desc}>{hullmod.hullmod_desc}</p>
                {hullmod.hullmod_desc_s_mod && (
                    <>
                        <h4
                            className={clsx(
                                styles.sectionHeader,
                                customStyles.sectionHeader,
                            )}
                        >
                            S-mod bonus
                        </h4>
                        <p className={customStyles.desc}>
                            {hullmod.hullmod_desc_s_mod}
                        </p>
                    </>
                )}
            </section>
        </article>
    );
}
