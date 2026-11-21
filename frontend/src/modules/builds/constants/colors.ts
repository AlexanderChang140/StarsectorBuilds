import type { SlotType } from '@/types/ship';

export const COLOR_MAP: Record<SlotType, string> = {
    ballistic: 'ballistic-color',
    energy: 'energy-color',
    missile: 'missile-color',
    hybrid: 'hybrid-color',
    composite: 'composite-color',
    synergy: 'synergy-color',
    universal: 'universal-color',
    built_in: 'universal-color',
} as const;

export function getSlotColor(weaponType: string) {
    const colorVar = COLOR_MAP[weaponType as keyof typeof COLOR_MAP];
    const cssColor = colorVar ? `var(--${colorVar})` : 'red';
    return cssColor;
}
