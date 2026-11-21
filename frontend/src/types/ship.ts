export type ShipSize = 'frigate' | 'destroyer' | 'cruiser' | 'capital_ship';

export type SlotSize = 'small' | 'medium' | 'large';

export type SlotType =
    | 'ballistic'
    | 'energy'
    | 'missile'
    | 'hybrid'
    | 'composite'
    | 'synergy'
    | 'universal'
    | 'built_in';

export type SlotRef = {
    outline: HTMLElement;
};
