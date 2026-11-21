import type { ShipWeaponSlotFull } from '@starsector-builds/shared/ships/schema';
import type { Projection } from '@starsector-builds/shared/types';
import clsx from 'clsx';

import Arc from '@/components/Arc';
import type { SlotRef, SlotType, SlotSize } from '@/types/ship';

import { SlotIcon } from './WeaponSlotIcon';
import styles from './WeaponSlotOutline.module.css';
import { getSlotColor } from '../../constants/colors';
import type { SHIP_WEAPON_SLOT_KEYS } from '../../constants/keys';

interface WeaponSlotOutlineProps {
    refs: Record<number, SlotRef>;
    slot: Projection<ShipWeaponSlotFull, typeof SHIP_WEAPON_SLOT_KEYS>;
    type: SlotType;
    arcRadius: number;
    isVisible: boolean;
    isHovered: boolean;
    isArcVisible: boolean;
}

export default function WeaponSlotOutline({
    refs,
    slot,
    type,
    arcRadius,
    isVisible,
    isHovered,
    isArcVisible,
}: WeaponSlotOutlineProps) {
    const angleOffset = slot.arc / 2;
    const color = getSlotColor(slot.weapon_type.toLowerCase());

    return (
        <>
            <div
                className={clsx(styles.outline, isHovered && styles.visible, !isVisible && styles.invisible)}
                ref={(el) => {
                    if (el) {
                        refs[slot.weapon_slot_id] = { outline: el };
                    } else {
                        delete refs[slot.weapon_slot_id];
                    }
                }}
            >
                <SlotIcon
                    type={type}
                    size={slot.weapon_size.toLowerCase() as SlotSize}
                    color={color}
                />
            </div>
            <div className={clsx(styles.arc, isArcVisible && styles.visible)}>
                <Arc
                    radius={arcRadius}
                    startAngle={-(slot.angle + angleOffset)}
                    endAngle={-(slot.angle - angleOffset)}
                    strokeWidth={1}
                    stroke={color}
                />
            </div>
        </>
    );
}
