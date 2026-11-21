import type { ShipWeaponSlotFull } from '@starsector-builds/shared/ships/schema';
import type { Projection } from '@starsector-builds/shared/types';
import type { WeaponVersionFull } from '@starsector-builds/shared/weapons/schema';
import { useRef, type RefObject } from 'react';
import { Focusable } from 'react-aria-components';

import { Tooltip, TooltipTrigger } from '@/components/Tooltip/Tooltip';
import type { SlotRef, SlotSize, SlotType } from '@/types/ship';
import { capitalize } from '@/utils/string';

import WeaponImage from './WeaponImage';
import WeaponSlotOutline from './WeaponSlotOutline';
import styles from './WeaponSlots.module.css';
import type { SHIP_WEAPON_SLOT_KEYS, WEAPON_KEYS } from '../../constants/keys';
import { HIDDEN_MOUNT_TYPES, SLOT_RADIUS_MAP } from '../../constants/slots';
import useCtrlPressed from '../../hooks/useCtrlPressed';
import useWeaponSlotHover from '../../hooks/useWeaponSlotHover';
import useWeaponSlotInteract from '../../hooks/useWeaponSlotInteract';
import type { ActiveSlot, ImageSize } from '../../types';
import { isBuiltin } from '../../utils/slot';
import { calculateSlotPositions } from '../../utils/slotSize';
import WeaponInfo from '../info/WeaponInfo';

type WeaponKeys = typeof WEAPON_KEYS;

export interface ShipBuilderSlotsProps {
    shipCenter: { x: number; y: number };
    installedWeapons: Record<
        number,
        Projection<WeaponVersionFull, WeaponKeys> | null
    >;
    slotsData: Projection<ShipWeaponSlotFull, typeof SHIP_WEAPON_SLOT_KEYS>[];
    activeSlot?: ActiveSlot | null;
    isInteractable?: boolean;
    isHoverable?: boolean;
    onActiveSlotChange?: (slotId: number | null) => void;
    onRemoveWeapon?: (slotId: number) => void;
}

export interface WeaponSlotsProps {
    imgSize: ImageSize;
    containerRef: RefObject<HTMLDivElement | null>;
    props: ShipBuilderSlotsProps;
}

export default function WeaponSlots({
    imgSize,
    containerRef,
    props: {
        shipCenter,
        activeSlot,
        installedWeapons,
        slotsData,
        isInteractable = true,
        isHoverable = true,
        onActiveSlotChange,
        onRemoveWeapon,
    },
}: WeaponSlotsProps) {
    const slotRefs = useRef<Record<number, SlotRef>>({});

    const { hoveredSlot } = useWeaponSlotHover({
        containerRef,
        slotRefs,
        isActive: isHoverable,
    });

    const isCtrlPressed = useCtrlPressed();

    useWeaponSlotInteract({
        containerRef,
        slotRefs,
        onActiveSlotChange,
        onRemoveWeapon,
        isActive: isInteractable,
    });

    return (
        <>
            {imgSize.displayHeight > 0 &&
                imgSize.displayWidth > 0 &&
                slotsData
                    .filter((slot) => {
                        return !HIDDEN_MOUNT_TYPES.has(
                            slot.mount_type.toLowerCase(),
                        );
                    })
                    .map((slot) => {
                        const weaponSize = slot.weapon_size.toLowerCase();
                        const weaponType = slot.weapon_type.toLowerCase();

                        const { left, top, scale } = calculateSlotPositions(
                            imgSize,
                            slot,
                            shipCenter,
                        );

                        const slotRadius =
                            SLOT_RADIUS_MAP[weaponSize as SlotSize] * scale;
                        const arcRadius = 100 * scale;

                        const effectiveActiveSlot = isInteractable
                            ? activeSlot
                            : null;
                        const isActive =
                            slot.weapon_slot_id ===
                            effectiveActiveSlot?.weapon_slot_id;
                        const isHovered =
                            isHoverable && slot.weapon_slot_id === hoveredSlot;
                        const isOpen =
                            isActive ||
                            (effectiveActiveSlot == null && isHovered);

                        const weapon = installedWeapons[slot.weapon_slot_id] as
                            | Projection<WeaponVersionFull, WeaponKeys>
                            | undefined;

                        const slotType = (
                            weapon && isBuiltin(slot.weapon_type)
                                ? weapon.weapon_type
                                : weaponType
                        ) as SlotType;

                        return (
                            <TooltipTrigger
                                key={slot.weapon_slot_id}
                                delay={0}
                                isOpen={isOpen}
                                isDisabled={!isHoverable}
                            >
                                <Focusable>
                                    <div
                                        className={styles.slot}
                                        style={{
                                            left: `${left}px`,
                                            top: `${top}px`,
                                            width: `${slotRadius * 2}px`,
                                            height: `${slotRadius * 2}px`,
                                        }}
                                        role={
                                            isInteractable
                                                ? 'button'
                                                : undefined
                                        }
                                    >
                                        <WeaponSlotOutline
                                            refs={slotRefs.current}
                                            slot={slot}
                                            type={slotType}
                                            arcRadius={arcRadius}
                                            isVisible={
                                                isHoverable || isInteractable
                                            }
                                            isHovered={isHovered}
                                            isArcVisible={isOpen}
                                        />
                                        {weapon && (
                                            <WeaponImage
                                                styles={styles}
                                                turretImageFilePath={
                                                    weapon.turret_image_file_path
                                                }
                                                turretGunImageFilePath={
                                                    weapon.turret_gun_image_file_path
                                                }
                                                scale={scale}
                                                angle={slot.angle}
                                                alt={
                                                    weapon.display_name ??
                                                    'Weapon image'
                                                }
                                            />
                                        )}
                                    </div>
                                </Focusable>
                                <Tooltip
                                    className={styles.tooltip}
                                    placement="bottom"
                                >
                                    {weapon
                                        ? weapon.display_name
                                        : `${capitalize(slot.weapon_size)} ${capitalize(slot.weapon_type)} ${capitalize(slot.mount_type)}`}
                                </Tooltip>
                                {weapon && isCtrlPressed && (
                                    <Tooltip placement="left">
                                        <WeaponInfo weapon={weapon} />
                                    </Tooltip>
                                )}
                            </TooltipTrigger>
                        );
                    })}
        </>
    );
}
