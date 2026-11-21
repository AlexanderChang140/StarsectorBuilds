import type { SlotSize } from '@/types/ship';

export const SLOT_RADIUS_MAP: Record<SlotSize, number> = {
    small: 10,
    medium: 20,
    large: 30,
};

export const HIDDEN_MOUNT_TYPES = new Set(['decorative', 'hidden']);
