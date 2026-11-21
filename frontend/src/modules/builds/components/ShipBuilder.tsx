import { clsx } from 'clsx';
import { useState, type FormEvent } from 'react';
import { ComboBox, Label, Input, Popover } from 'react-aria-components';

import { ListBox, ListBoxItem } from '@/components/ListBox/ListBox';
import type { ShipSize } from '@/types/ship';

import { ShipCanvas } from './canvas/ShipCanvas';
import { type Category, ListManager } from './list/ListManager';
import { ShipName } from './misc/ShipName';
import { WingSlots } from './misc/WingSlots';
import { DisplayHullmods } from './overview/DisplayHullmods';
import { ShipInfo } from './overview/ShipStats';
import styles from './ShipBuilder.module.css';
import { useShipHullmods } from '../hooks/data/useShipHullmods';
import { useShipSlots } from '../hooks/data/useShipSlots';
import { useShipWeapons } from '../hooks/data/useShipWeapons';
import { useShipWings } from '../hooks/data/useShipWings';
import { useBuildState } from '../hooks/useBuildState';
import { useCreateBuild } from '../hooks/useCreateBuild';
import type { ActiveSlot, ShipData } from '../types';
import {
    calculateWeaponFluxUpkeep,
    getCapacity,
    getDissipation,
    getMaxFluxItems,
} from '../utils/flux';
import { calculateOp } from '../utils/op';
import { isBuiltin, isLaunchBay } from '../utils/slot';

interface ShipBuilderProps {
    shipData: ShipData;
    shipVersionId: number;
    shipVersionItems: { label: string; value: string }[];
}

const ITEM_SHIFT_MULTI = 5;

export function ShipBuilder({
    shipData,
    shipVersionId,
    shipVersionItems,
}: ShipBuilderProps) {
    const [activeSlot, setActiveSlot] = useState<ActiveSlot | null>(null);
    const [category, setCategory] = useState<Category>('weapon');
    const [pageIndex, setPageIndex] = useState(0);

    const {
        build,
        addModVersion,
        removeModVersion,
        setTitle,
        setContent,
        setVents,
        setCapacitors,
        addWeapon,
        removeWeapon,
        addWing,
        removeWing,
        addHullmod,
        removeHullmod,
        toggleBuiltInHullmod,
    } = useBuildState({
        modVid: shipData.mod_version_id,
        shipVid: shipVersionId,
        shipSize: shipData.ship_size,
    });
    const { capacitors, vents } = build.stats;

    const weapons = useShipWeapons({
        modVersions: [...build.modVersions],
        weapons: build.weapons,
        builtInWeapons: shipData.built_in_weapons,
        activeSlot,
        pageIndex,
    });

    const wings = useShipWings({
        modVersions: [...build.modVersions],
        wings: build.wings,
        builtInWings: shipData.built_in_wings,
        pageIndex,
    });

    const hullmods = useShipHullmods({
        modVersions: [...build.modVersions],
        hullmods: build.hullmods,
        builtInHullmods: shipData.built_in_hullmods,
        pageIndex,
    });

    const slots = useShipSlots({ shipData });

    const { mutate: createBuild } = useCreateBuild();

    const handleSubmitBuild = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createBuild(build);
    };

    const handleChangeCapacitors = (e: React.MouseEvent, value: number) => {
        const maxCapacitors = getMaxFluxItems(shipData.ship_size);
        let amount = value;
        if (e.shiftKey) {
            amount = value * ITEM_SHIFT_MULTI;
        } else if (e.ctrlKey) {
            amount = value > 0 ? maxCapacitors - capacitors : -capacitors;
        }
        setCapacitors((prev) => prev + amount);
    };

    const handleChangeVents = (e: React.MouseEvent, value: number) => {
        const maxVents = getMaxFluxItems(shipData.ship_size);
        let amount = value;
        if (e.shiftKey) {
            amount = value * ITEM_SHIFT_MULTI;
        } else if (e.ctrlKey) {
            amount = value > 0 ? maxVents - vents : -vents;
        }
        setVents((prev) => prev + amount);
    };

    const handleActiveSlotChange = (slotId: number | null) => {
        const slotData = slotId ? slots.record[slotId] : null;
        const isInvalid = !slotData || isBuiltin(slotData.weapon_type);

        if (isInvalid) {
            setActiveSlot(null);
            setCategory('weapon');
            setPageIndex(0);
            return;
        }

        setActiveSlot({
            weapon_size: slotData.weapon_size,
            weapon_type: slotData.weapon_type,
            weapon_slot_id: slotData.weapon_slot_id,
        });

        const isLaunchBay = slotData.weapon_type.toLowerCase() === 'launch_bay';
        setCategory(isLaunchBay ? 'wing' : 'weapon');
        setPageIndex(0);
    };

    const handleSetWeapon = (weaponVid: number) => {
        if (!activeSlot || isLaunchBay(activeSlot.weapon_type)) {
            return;
        }
        removeWeapon(activeSlot.weapon_slot_id);
        addWeapon(activeSlot.weapon_slot_id, weaponVid);
    };

    const handleSetWing = (wingVid: number) => {
        if (!activeSlot || !isLaunchBay(activeSlot.weapon_type)) {
            return;
        }
        removeWing(activeSlot.weapon_slot_id);
        addWing(activeSlot.weapon_slot_id, wingVid);
    };

    const handleSetHullmod = (hullmodVid: number) => {
        addHullmod(hullmodVid);
    };

    const handleBuildInHullmod = (hullmodVid: number) => {
        toggleBuiltInHullmod(hullmodVid);
    };

    return (
        <div className={clsx(styles.shipBuilder, 'grid-bg')}>
            <ShipName ship={shipData} />
            <div className={styles.versionSelect}>
                <ComboBox>
                    <Label>Versions</Label>
                    <Input></Input>
                    <Popover>
                        <ListBox aria-label="Select ship versions">
                            {shipVersionItems.map((version) => (
                                <ListBoxItem key={version.value}>
                                    {version.label}
                                </ListBoxItem>
                            ))}
                        </ListBox>
                    </Popover>
                </ComboBox>
            </div>
            <WingSlots
                builtInWings={wings.builtIn}
                installedWings={wings.installedBySlot}
                slotsData={slots.data}
                activeSlot={activeSlot}
                onActiveSlotChange={handleActiveSlotChange}
                onRemoveWing={removeWing}
            />
            <div className={styles.canvas}>
                {shipData.ship_image_file_path ? (
                    <ShipCanvas
                        src={shipData.ship_image_file_path}
                        slotsProps={{
                            shipCenter: {
                                x: Number(shipData.x),
                                y: Number(shipData.y),
                            },
                            activeSlot,
                            installedWeapons: weapons.combinedBySlot,
                            slotsData: slots.data,
                            onActiveSlotChange: handleActiveSlotChange,
                            onRemoveWeapon: removeWeapon,
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
                    onChangeCapacitors={handleChangeCapacitors}
                    onChangeVents={handleChangeVents}
                />
                <DisplayHullmods
                    shipBuiltIn={hullmods.shipBuiltIn}
                    playerBuiltIn={hullmods.playerBuiltIn}
                    nonBuiltIn={hullmods.nonBuiltIn}
                    shipSize={shipData.ship_size as ShipSize}
                    onBuildIn={handleBuildInHullmod}
                    onRemove={removeHullmod}
                />
            </div>
            <div className={styles.listManager}>
                <ListManager
                    categoryState={{ category, setCategory }}
                    pageIndexState={{ pageIndex, setPageIndex }}
                    weaponListProps={{
                        weaponsData: weapons.data,
                        weaponTotal: weapons.total,
                        activeWeapon: weapons.active,
                        onSetWeapon: handleSetWeapon,
                    }}
                    wingListProps={{
                        wingsData: wings.data,
                        wingTotal: wings.total,
                        onSetWing: handleSetWing,
                    }}
                    hullmodListProps={{
                        hullmodsData: hullmods.data,
                        hullmodTotal: hullmods.total,
                        shipSize: shipData.ship_size as ShipSize,
                        onSetHullmod: handleSetHullmod,
                    }}
                />
            </div>
            <form
                className={styles.desc}
                onSubmit={(e) => handleSubmitBuild(e)}
            >
                <div>
                    <label htmlFor="title">Title</label>
                    <input
                        id="title"
                        type="text"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        rows={4}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <button type="submit">Save</button>
            </form>
        </div>
    );
}
