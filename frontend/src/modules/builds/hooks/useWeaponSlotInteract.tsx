import { useEffect, type RefObject } from 'react';

import type { SlotRef } from '@/types/ship';

import { getClosestSlot } from '../utils/slotSize';

interface UseWeaponSlotInteractProps {
    containerRef: RefObject<HTMLDivElement | null>;
    slotRefs: RefObject<Record<number, SlotRef>>;
    isActive?: boolean;
    onActiveSlotChange?: (slotId: number | null) => void;
    onRemoveWeapon?: (slotId: number) => void;
}

export default function useWeaponSlotInteract({
    containerRef,
    slotRefs,
    isActive = true,
    onActiveSlotChange,
    onRemoveWeapon,
}: UseWeaponSlotInteractProps) {
    // Set active slot on left mouse click, remove weapon from slot on right mouse click
    useEffect(() => {
        if (!isActive) return;
        const handleClick = (e: PointerEvent) => {
            const closest = getClosestSlot(e, slotRefs.current);
            if (e.button === 0) {
                if (closest) {
                    onActiveSlotChange?.(closest.slotId);
                } else {
                    onActiveSlotChange?.(null);
                }
            } else if (e.button === 2) {
                if (!closest) return;
                onRemoveWeapon?.(closest.slotId);
            }
        };
        const el = containerRef.current;
        el?.addEventListener('pointerdown', handleClick);
        return () => el?.removeEventListener('pointerdown', handleClick);
    }, [containerRef, isActive, onActiveSlotChange, onRemoveWeapon, slotRefs]);
}
