import type { Item } from '@/types/component';

import type { ChipState } from './hooks/useChipFilterState';

export default function createChipState<TCategory>(
    category: TCategory,
    input?: string,
    selected?: Item,
): ChipState<TCategory> {
    return {
        category,
        input: input ?? '',
        selected,
    };
}
