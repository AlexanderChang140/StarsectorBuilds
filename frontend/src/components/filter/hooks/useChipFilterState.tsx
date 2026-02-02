import { useState } from 'react';

import type { Item } from '@/types/component';

export type ChipState = {
    categoryLabel: string;
    input: string;
    selected?: Item;
};
export type ChipFilterState = {
    input: string;
    chips: Record<string, ChipState>;
};

export default function useChipFilterState() {
    const [chipFilterState, setChipFilterState] = useState<ChipFilterState>({
        input: '',
        chips: {},
    });

    const getNextCategoryInput = (prev: ChipFilterState, input: string) => {
        return { ...prev, input };
    };

    const getNextCategorySelected = (
        prev: ChipFilterState,
        categoryLabel: string,
        value: string,
    ) => {
        const exists = prev.chips[value];

        const newChip: ChipState = {
            categoryLabel,
            input: '',
            selected: exists?.selected,
        };

        return {
            ...prev,
            chips: {
                ...prev.chips,
                [value]: newChip,
            },
        };
    };

    const getNextChipInput = (
        prev: ChipFilterState,
        value: string,
        input: string,
    ) => {
        return {
            ...prev,
            chips: {
                ...prev.chips,
                [value]: {
                    ...prev.chips[value],
                    input,
                },
            },
        };
    };

    const addSelectedCategory = (
        prev: ChipFilterState,
        categoryValue: string,
        selected: Item | undefined,
    ) => {
        const nextChips: Record<string, ChipState> = {
            ...prev.chips,
            [categoryValue]: {
                ...prev.chips[categoryValue],
                selected,
            },
        };

        return { ...prev, chips: nextChips };
    };

    const removeSelectedCategory = (
        prev: ChipFilterState,
        categoryValue: string,
    ) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [categoryValue]: _, ...nextChips } = prev.chips;

        return { ...prev, chips: nextChips };
    };

    return {
        chipFilterState: chipFilterState,
        setChipFilterState,
        getNextCategoryInput,
        getNextCategorySelected,
        getNextChipInput,
        addSelectedCategory,
        removeSelectedCategory,
    };
}
