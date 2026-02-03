import type { Item } from '@/types/component';

import type { ChipState } from './hooks/useChipStates';

export default function createChipState(
    categoryLabel: string,
    input?: string,
    selected?: Item,
): ChipState {
    return {
        categoryLabel,
        input: input ?? '',
        selected,
    };
}
