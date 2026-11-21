import type { BuildFull } from '@starsector-builds/shared/builds/types';
import type { Projection } from '@starsector-builds/shared/types';
import type { WeaponVersionFull } from '@starsector-builds/shared/weapons/schema';
import type { WingVersionFull } from '@starsector-builds/shared/wings/schema';
import clsx from 'clsx';

import type { ShipSize } from '@/types/ship';

import { ShipCanvas } from './canvas/ShipCanvas';
import { DisplayHullmods } from './overview/DisplayHullmods';
import { ShipName } from '../components/misc/ShipName';
import { WingSlots } from '../components/misc/WingSlots';
import { ShipInfo } from '../components/overview/ShipStats';
import styles from '../components/ShipBuilder.module.css';
import type { WEAPON_KEYS, WING_KEYS } from '../constants/keys';
import { useShipSlots } from '../hooks/data/useShipSlots';
import useInstalledHullmodsQuery from '../hooks/queries/useInstalledHullmodsQuery';
import useInstalledWeaponsQuery from '../hooks/queries/useInstalledWeaponsQuery';
import useInstalledWingsQuery from '../hooks/queries/useInstalledWingsQuery';
import type { ShipData } from '../types';
import {
    calculateWeaponFluxUpkeep,
    getCapacity,
    getDissipation,
} from '../utils/flux';
import { calculateOp } from '../utils/op';

interface ShipViwerProps {
    buildData: BuildFull;
    shipData: ShipData;
}

export function ShipViewer({ buildData, shipData }: ShipViwerProps) {
    const slots = useShipSlots({ shipData });
    const weapons = useShipWeapons({ buildData, shipData });
    const wings = useShipWings({ buildData, shipData });
    const hullmods = useShipHullmods({ buildData, shipData });

    const { capacitors, vents } = buildData;

    return (
        <div className={clsx(styles.shipBuilder, 'grid-bg')}>
            <ShipName ship={shipData} />
            <WingSlots
                builtInWings={wings.builtIn}
                installedWings={wings.installedBySlot}
                slotsData={slots.data}
                isInteractable={false}
            />
            <div className={styles.canvas}>
                {buildData.ship_image_file_path ? (
                    <ShipCanvas
                        src={buildData.ship_image_file_path}
                        slotsProps={{
                            shipCenter: {
                                x: shipData.x,
                                y: shipData.y,
                            },
                            installedWeapons: weapons.installedBySlot,
                            slotsData: slots.data,
                            isInteractable: false,
                        }}
                    />
                ) : (
                    'No ship image found'
                )}
            </div>
            <div className={styles.overview}>
                <ShipInfo
                    currOp={calculateOp({
                        weapons: Object.values(weapons.installedBySlot),
                        wings: Object.values(wings.installedBySlot),
                        hullmods: hullmods.nonBuiltIn,
                        shipSize: shipData.ship_size as ShipSize,
                        capacitors,
                        vents,
                    })}
                    maxOp={shipData.op}
                    topSpeed={{ base: shipData.max_speed, delta: 0 }}
                    armor={{ base: shipData.armor_rating, delta: 0 }}
                    hull={{ base: shipData.hitpoints, delta: 0 }}
                    capacity={{
                        base: shipData.max_flux,
                        delta: getCapacity(capacitors),
                    }}
                    dissipation={{
                        base: shipData.flux_dissipation,
                        delta: getDissipation(vents),
                    }}
                    capacitors={capacitors}
                    vents={vents}
                    shieldArc={{ base: shipData.shield_arc, delta: 0 }}
                    shieldUpkeep={shipData.shield_upkeep}
                    shieldEfficiency={shipData.shield_efficiency}
                    weaponFluxUpkeep={calculateWeaponFluxUpkeep(
                        Object.values(weapons.combinedBySlot),
                    )}
                    isInteractable={false}
                />
                <DisplayHullmods
                    shipBuiltIn={hullmods.shipBuiltIn}
                    playerBuiltIn={hullmods.playerBuiltIn}
                    nonBuiltIn={hullmods.nonBuiltIn}
                    shipSize={shipData.ship_size as ShipSize}
                    isInteractable={false}
                />
            </div>
        </div>
    );
}

function useShipWings({
    buildData,
    shipData,
}: {
    buildData: BuildFull;
    shipData: ShipData;
}) {
    const builtInVids = shipData.built_in_wings.map(([, vid]) => vid);
    const installedVids = buildData.installed_wings.map(([, vid]) => vid);
    const installedQuery = useInstalledWingsQuery([
        ...builtInVids,
        ...installedVids,
    ]);
    const installedData = installedQuery.data?.data ?? [];
    const installedRecord = Object.fromEntries(
        installedData.map((w) => [w.wing_version_id, w]),
    );

    const builtIn = shipData.built_in_wings
        .map(([vid, numWings]) => ({
            wing: installedRecord[vid],
            numWings,
        }))
        .sort((a, b) => a.wing.wing_version_id - b.wing.wing_version_id);

    const installedBySlot: Record<
        number,
        Projection<WingVersionFull, typeof WING_KEYS>
    > = Object.fromEntries(
        buildData.installed_wings
            .map(([slotId, vid]) => [slotId, installedRecord[vid]])
            .filter(([, w]) => w != null),
    );

    return { installedBySlot, builtIn };
}

function useShipWeapons({
    buildData,
    shipData,
}: {
    buildData: BuildFull;
    shipData: ShipData;
}) {
    const builtInVids = shipData.built_in_weapons.map(([, vid]) => vid);
    const installedVids = buildData.installed_weapons.map(([, vid]) => vid);

    const installedQuery = useInstalledWeaponsQuery([
        ...installedVids,
        ...builtInVids,
    ]);
    const installedData = installedQuery.data?.data ?? [];
    const installedRecord = Object.fromEntries(
        installedData.map((w) => [w.weapon_version_id, w]),
    );

    const installedBySlot: Record<
        number,
        Projection<WeaponVersionFull, typeof WEAPON_KEYS>
    > = Object.fromEntries(
        buildData.installed_weapons
            .map(([slotId, vid]) => [slotId, installedRecord[vid]])
            .filter(([, w]) => w != null),
    );

    const builtInBySlot: Record<
        number,
        Projection<WeaponVersionFull, typeof WEAPON_KEYS>
    > = Object.fromEntries(
        shipData.built_in_weapons.map(([slotId, vid]) => [
            slotId,
            installedRecord[vid],
        ]),
    );

    return {
        installedBySlot,
        combinedBySlot: { ...installedBySlot, ...builtInBySlot },
    };
}

function useShipHullmods({
    buildData,
    shipData,
}: {
    buildData: BuildFull;
    shipData: ShipData;
}) {
    const shipBuiltInVids = shipData.built_in_hullmods.map(([, vid]) => vid);
    const playerBuiltInVids = buildData.built_in_hullmods;
    const nonBuiltInVids = buildData.installed_hullmods;

    const installedQuery = useInstalledHullmodsQuery([
        ...shipBuiltInVids,
        ...playerBuiltInVids,
        ...nonBuiltInVids,
    ]);
    const installedData = installedQuery.data?.data ?? [];
    const installedRecord = Object.fromEntries(
        installedData.map((hullmod) => [hullmod.hullmod_version_id, hullmod]),
    );

    const shipBuiltIn = shipBuiltInVids
        .map((vid) => installedRecord[vid])
        .filter((hullmod) => hullmod != null);

    const playerBuiltIn = playerBuiltInVids
        .map((vid) => installedRecord[vid])
        .filter((hullmod) => hullmod != null);

    const nonBuiltIn = nonBuiltInVids
        .map((vid) => installedRecord[vid])
        .filter((hullmod) => hullmod != null);

    return {
        shipBuiltIn,
        playerBuiltIn,
        nonBuiltIn,
    };
}
