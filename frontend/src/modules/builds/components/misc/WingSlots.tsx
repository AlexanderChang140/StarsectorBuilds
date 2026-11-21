import type { ShipWeaponSlotFull } from '@starsector-builds/shared/ships/schema';
import type { Projection } from '@starsector-builds/shared/types';
import type { WingVersionFull } from '@starsector-builds/shared/wings/schema';
import clsx from 'clsx';
import { useRef } from 'react';

import usePreventContextMenu from '@/hooks/usePreventContextMenu';
import { imageUrl } from '@/utils/assets';

import styles from './WingSlots.module.css';
import type { SHIP_WEAPON_SLOT_KEYS, WING_KEYS } from '../../constants/keys';
import type { ActiveSlot } from '../../types';

type WingSlotsProps = {
    builtInWings: {
        wing: Projection<WingVersionFull, typeof WING_KEYS>;
        numWings: number;
    }[];
    installedWings: Record<
        string,
        Projection<WingVersionFull, typeof WING_KEYS>
    >;
    slotsData: Projection<ShipWeaponSlotFull, typeof SHIP_WEAPON_SLOT_KEYS>[];
} & (
    | {
          isInteractable?: true;
          activeSlot?: ActiveSlot | null;

          onActiveSlotChange: (slotId: number | null) => void;
          onRemoveWing: (slotId: number) => void;
      }
    | {
          isInteractable: false;
          activeSlot?: never;
          onActiveSlotChange?: never;
          onRemoveWing?: never;
      }
);

export function WingSlots({
    builtInWings,
    installedWings,
    slotsData,
    activeSlot,
    isInteractable = true,
    onActiveSlotChange,
    onRemoveWing,
}: WingSlotsProps) {
    return (
        <div className={styles.wings}>
            <h2 id="wing-list-label" className={styles.header}>
                Fighter bays
            </h2>
            <div className={styles.listbox} aria-labelledby="wing-list-label">
                {builtInWings.flatMap(({ wing, numWings }, wingIndex) =>
                    Array.from({ length: numWings }, (_, i) => (
                        <WingSlot
                            key={`builtin-${wingIndex}-${i}`}
                            wing={wing}
                            isActive={false}
                        />
                    )),
                )}
                {slotsData
                    .filter((v) => v.weapon_type.toLowerCase() === 'launch_bay')
                    .sort((a, b) => a.weapon_slot_id - b.weapon_slot_id)
                    .map((slot) => (
                        <WingSlot
                            key={slot.weapon_slot_id}
                            wing={installedWings[slot.weapon_slot_id]}
                            isActive={
                                slot.weapon_slot_id ===
                                activeSlot?.weapon_slot_id
                            }
                            onLeftClick={() => {
                                if (isInteractable) {
                                    onActiveSlotChange?.(slot.weapon_slot_id);
                                }
                            }}
                            onRightClick={() => {
                                if (isInteractable) {
                                    onRemoveWing?.(slot.weapon_slot_id);
                                }
                            }}
                        />
                    ))}
            </div>
        </div>
    );
}

interface WingSlotProps {
    wing: Projection<WingVersionFull, typeof WING_KEYS> | null;
    isActive: boolean;
    onLeftClick?: () => void;
    onRightClick?: () => void;
}

const WingSlot = ({
    wing,
    isActive,
    onLeftClick,
    onRightClick,
}: WingSlotProps) => {
    const ref = useRef(null);
    usePreventContextMenu(ref);
    return (
        <div
            className={clsx(styles.slot, isActive && styles.active)}
            ref={ref}
            onClick={() => onLeftClick?.()}
            onContextMenu={() => onRightClick?.()}
        >
            <div className={styles.imageWrapper}>
                {wing ? (
                    wing.ship_image_file_path ? (
                        <img
                            className={styles.img}
                            src={imageUrl(wing.ship_image_file_path)}
                            alt={wing.display_name ?? wing.fighter_ship_code}
                        />
                    ) : (
                        <div className={styles.imageFallback}>
                            No image found
                        </div>
                    )
                ) : null}
            </div>
        </div>
    );
};
