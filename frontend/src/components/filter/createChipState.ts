import type { ChipState } from './FilterChips';
import type { Item } from '../select/Select';

export default function createChipState(
    parentLabel: string,
    input: string,
    selected?: Item,
): ChipState {
    return {
        parentLabel,
        input,
        selected,
    };
}
