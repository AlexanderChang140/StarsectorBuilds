import type { SlotRef, SlotSize } from '@/types/ship';

import type { ImageSize } from '../types';

export function increaseSize(size: SlotSize): SlotSize {
    if (size === 'small') {
        return 'medium';
    }
    return 'large';
}

export function decreaseSize(size: SlotSize): SlotSize {
    if (size === 'large') {
        return 'medium';
    }
    return 'small';
}

export function getClosestSlot(
    e: MouseEvent,
    slotRefs: Record<number, SlotRef>,
) {
    const slots = Object.entries(slotRefs)
        .filter(([, { outline }]) =>
            isInBounds(e, outline.getBoundingClientRect()),
        )
        .map(([id, { outline }]) => ({
            distance: getMouseDistance(e, outline.getBoundingClientRect()),
            slotId: Number(id),
        }));

    if (slots.length === 0) {
        return null;
    }

    const closest = slots.reduce((min, curr) =>
        curr.distance < min.distance ? curr : min,
    );
    return closest;
}

function isInBounds(e: MouseEvent, rect: DOMRect) {
    return (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
    );
}

function getMouseDistance(e: MouseEvent, rect: DOMRect) {
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distance = dx * dx + dy * dy;

    return distance;
}

export function calculateSlotPositions(
    imgSize: ImageSize,
    slot: { x: number; y: number },
    shipCenter: { x: number; y: number },
) {
    const scale = Math.min(
        imgSize.displayHeight / imgSize.naturalHeight,
        imgSize.displayWidth / imgSize.naturalWidth,
    );

    const realImageWidth = imgSize.naturalWidth * scale;
    const realImageHeight = imgSize.naturalHeight * scale;
    const paddingX = (imgSize.displayWidth - realImageWidth) / 2;
    const paddingY = (imgSize.displayHeight - realImageHeight) / 2;

    const dX = -slot.y;
    const dY = slot.x;

    const left = (shipCenter.x + dX) * scale + paddingX;
    const top = imgSize.displayHeight - (shipCenter.y + dY) * scale + paddingY;

    return { left, top, scale };
}
