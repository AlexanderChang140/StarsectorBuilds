import type { Item } from '@/types/component';

import type { ChipState } from '../filter/hooks/useChipFilterState';

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
