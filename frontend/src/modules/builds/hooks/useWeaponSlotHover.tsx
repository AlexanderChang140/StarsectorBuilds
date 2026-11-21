import { useEffect, useState, type RefObject } from 'react';

import type { SlotRef } from '@/types/ship';

import { getClosestSlot } from '../utils/slotSize';

interface UseWeaponSlotHoverProps {
    containerRef: RefObject<HTMLDivElement | null>;
    slotRefs: RefObject<Record<number, SlotRef>>;
    isActive?: boolean;
}

export default function useWeaponSlotHover({
    containerRef,
    slotRefs,
    isActive = true,
}: UseWeaponSlotHoverProps) {
    const [hoveredSlot, setHoveredSlot] = useState<number>();

    // Show outline on mouse hover
    useEffect(() => {
        if (!isActive) return;
        let raf: number | null = null;
        const handlePointerMove = (e: PointerEvent) => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                const closest = getClosestSlot(e, slotRefs.current);
                setHoveredSlot(closest?.slotId);
                raf = null;
            });
        };
        const el = containerRef.current;
        el?.addEventListener('pointermove', handlePointerMove);
        return () => el?.removeEventListener('pointermove', handlePointerMove);
    }, [containerRef, isActive, slotRefs]);

    return { hoveredSlot };
}
