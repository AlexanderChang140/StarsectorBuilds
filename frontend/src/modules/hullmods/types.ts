import type { HullmodVersionDTO } from '@shared/hullmods/types';
import type { Projection } from '@shared/types';

export const HULLMOD_TABLE_ROW_KEYS = [
    'base_value',
    'cost_capital',
    'cost_cruiser',
    'cost_destroyer',
    'cost_frigate',
    'display_name',
    'hullmod_code',
    'hullmod_desc',
    'hullmod_id',
    'hullmod_image_file_path',
    'hullmod_version_id',
    'manufacturer',
    'mod_id',
    'mod_name',
    'mod_version_id',
] as const satisfies readonly (keyof HullmodVersionDTO)[];

export type HullmodTableRows = Projection<
    HullmodVersionDTO,
    typeof HULLMOD_TABLE_ROW_KEYS
>;
