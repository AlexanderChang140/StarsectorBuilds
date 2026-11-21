import type { HullmodVersionFull } from '@starsector-builds/shared/hullmods/types';
import type { Projection } from '@starsector-builds/shared/types';
import type { WeaponVersionFull } from '@starsector-builds/shared/weapons/schema';
import type { WingVersionFull } from '@starsector-builds/shared/wings/schema';
import clsx from 'clsx';

import PaginationControls from '@/components/pagination/PaginationControls';
import type { ShipSize } from '@/types/ship';
import { clamp } from '@/utils/math';

import GenericList from './GenericList';
import HullmodRow from './HullmodRow';
import styles from './ListManager.module.css';
import WeaponRow from './WeaponRow';
import WingRow from './WingRow';
import type {
    HULLMOD_KEYS,
    WEAPON_KEYS,
    WING_KEYS,
} from '../../constants/keys';
import { QUERY_LIMIT } from '../../constants/query';
import useCtrlPressed from '../../hooks/useCtrlPressed';

export type Category = 'weapon' | 'hullmod' | 'wing';

interface WeaponListProps {
    weaponsData: Projection<WeaponVersionFull, typeof WEAPON_KEYS>[];
    weaponTotal: number;
    activeWeapon: Projection<WeaponVersionFull, typeof WEAPON_KEYS> | null;
    onSetWeapon: (weaponVid: number) => void;
}

interface HullmodListProps {
    hullmodsData: Projection<HullmodVersionFull, typeof HULLMOD_KEYS>[];
    hullmodTotal: number;
    shipSize: ShipSize;
    onSetHullmod: (hullmodVid: number) => void;
}

interface WingListProps {
    wingsData: Projection<WingVersionFull, typeof WING_KEYS>[];
    wingTotal: number;
    onSetWing: (wingVid: number) => void;
}

interface ListManagerProps {
    categoryState: {
        category: Category;
        setCategory: (category: Category) => void;
    };
    pageIndexState: {
        pageIndex: number;
        setPageIndex: (pageIndex: number) => void;
    };
    weaponListProps: WeaponListProps;
    hullmodListProps: HullmodListProps;
    wingListProps: WingListProps;
}

const PAGINATION_SIBLING_COUNT = 2;

export function ListManager({
    categoryState: { category, setCategory },
    pageIndexState: { pageIndex, setPageIndex },
    weaponListProps: { weaponsData, weaponTotal, activeWeapon, onSetWeapon },
    hullmodListProps: { hullmodsData, hullmodTotal, shipSize, onSetHullmod },
    wingListProps: { wingsData, wingTotal, onSetWing },
}: ListManagerProps) {
    const isCtrlPressed = useCtrlPressed();

    const total =
        category == 'weapon'
            ? weaponTotal
            : category == 'hullmod'
              ? hullmodTotal
              : category == 'wing'
                ? wingTotal
                : 0;

    const totalPages = Math.ceil(total / QUERY_LIMIT);

    const handleSetCategory = (category: Category) => {
        setPageIndex(0);
        setCategory(category);
    };

    return (
        <>
            <div className={styles.categorySelect}>
                <button
                    className={clsx(
                        styles.button,
                        category === 'weapon' && styles.active,
                    )}
                    onClick={() => handleSetCategory('weapon')}
                >
                    Weapons
                </button>
                <button
                    className={clsx(
                        styles.button,
                        category === 'hullmod' && styles.active,
                    )}
                    onClick={() => handleSetCategory('hullmod')}
                >
                    Hullmods
                </button>
                <button
                    className={clsx(
                        styles.button,
                        category === 'wing' && styles.active,
                    )}
                    onClick={() => handleSetCategory('wing')}
                >
                    Wings
                </button>
            </div>
            {category === 'weapon' && (
                <GenericList
                    items={weaponsData}
                    ariaLabel="Weapon list"
                    renderItem={(weapon) => (
                        <WeaponRow
                            key={weapon.weapon_version_id}
                            weapon={weapon}
                            activeWeapon={activeWeapon}
                            isCtrlPressed={isCtrlPressed}
                            onSetWeapon={onSetWeapon}
                        />
                    )}
                />
            )}
            {category === 'hullmod' && (
                <GenericList
                    items={hullmodsData}
                    ariaLabel="Hullmod list"
                    renderItem={(hullmod) => (
                        <HullmodRow
                            key={hullmod.hullmod_version_id}
                            hullmod={hullmod}
                            shipSize={shipSize}
                            onSetHullmod={onSetHullmod}
                        />
                    )}
                />
            )}
            {category === 'wing' && (
                <GenericList
                    items={wingsData}
                    ariaLabel="Hullmod list"
                    renderItem={(wing) => (
                        <WingRow
                            key={wing.wing_version_id}
                            wing={wing}
                            activeWing={null}
                            isCtrlPressed={isCtrlPressed}
                            onSetWing={onSetWing}
                        />
                    )}
                />
            )}
            <PaginationControls
                parentStyles={styles}
                totalPages={totalPages}
                siblingCount={PAGINATION_SIBLING_COUNT}
                currPageIndex={pageIndex}
                onPageChange={(pageIndex) =>
                    setPageIndex(clamp(pageIndex, 0, totalPages - 1))
                }
            />
        </>
    );
}
