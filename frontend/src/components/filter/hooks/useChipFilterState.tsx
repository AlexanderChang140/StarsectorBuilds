import { useState } from 'react';

import type { Item } from '@/types/component';

export type ChipState<TCategory> = {
    category: TCategory;
    input: string;
    selected?: Item;
};
export type ChipFilterState<TCategory> = {
    input: string;
    chips: Record<string, ChipState<TCategory>>;
};

export default function useChipFilterState<TCategory>() {
    const [chipFilterState, setChipFilterState] = useState<
        ChipFilterState<TCategory>
    >({
        input: '',
        chips: {},
    });

    const getNextCategoryInput = (
        prev: ChipFilterState<TCategory>,
        input: string,
    ) => {
        return { ...prev, input };
    };

    const getNextCategorySelected = (
        prev: ChipFilterState<TCategory>,
        category: TCategory,
        value: string,
    ) => {
        const exists = prev.chips[value];

        const newChip: ChipState<TCategory> = {
            category,
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
        prev: ChipFilterState<TCategory>,
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
        prev: ChipFilterState<TCategory>,
        categoryValue: string,
        selected: Item | undefined,
    ) => {
        const nextChips: Record<string, ChipState<TCategory>> = {
            ...prev.chips,
            [categoryValue]: {
                ...prev.chips[categoryValue],
                selected,
            },
        };

        return { ...prev, chips: nextChips };
    };

    const removeSelectedCategory = (
        prev: ChipFilterState<TCategory>,
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
