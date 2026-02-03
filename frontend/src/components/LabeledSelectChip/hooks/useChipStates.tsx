import { useState } from 'react';

import createChipState from '@/components/LabeledSelectChip/createChipState';
import type { Item } from '@/types/component';
import { updateKey, addKey, removeKey } from '@/utils/object';

export type ChipState = {
    categoryLabel: string;
    input: string;
    selected?: Item;
};
export type ChipStates = Record<string, ChipState>;
export default function useChipStates() {
    const [chipStates, setChipStates] = useState<ChipStates>({});

    const addChipState = (categoryItem: Item) => {
        setChipStates((prev) =>
            addKey(
                prev,
                categoryItem.value,
                createChipState(categoryItem.label),
            ),
        );
    };

    const removeChipState = (categoryValue: string) => {
        setChipStates((prev) => removeKey(prev, categoryValue));
    };

    const updateChipState = (
        categoryValue: string,
        selected: Item | undefined,
    ) => {
        setChipStates((prev) => {
            const prevState = prev[categoryValue] as ChipState | undefined;

            if (prevState === undefined) {
                return prev;
            }

            const newState = updateKey(
                prev[categoryValue],
                'selected',
                selected,
            );
            return addKey(prev, categoryValue, newState);
        });
    };

    const hydrateChipStates = (next: ChipStates) => {
        setChipStates((prev) => ({
            ...prev,
            ...next,
        }));
    };

    return {
        chipStates,
        addChipState,
        updateChipState,
        removeChipState,
        hydrateChipStates,
    };
}
