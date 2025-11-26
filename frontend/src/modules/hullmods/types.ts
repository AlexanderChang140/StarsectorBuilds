import type { StrictOmit } from '../../types/generic';

export type HullmodData = {
    display_name: string;
    manufacturer: string;
    hullmod_desc: string;
    base_value: number;
    cost_frigate: number;
    cost_destroyer: number;
    cost_cruiser: number;
    cost_capital: number;
    hide: boolean;
    hide_everywhere: boolean;
};

export type TableHullmod = StrictOmit<
    HullmodData,
    'hide' | 'hide_everywhere'
> & { hullmod_id: number };
