import type { HullmodVersionFull } from '@starsector-builds/shared/hullmods/types';
import type { Projection } from '@starsector-builds/shared/types';
import { clsx } from 'clsx';
import { Focusable, TooltipTrigger } from 'react-aria-components';

import { ListBox, ListBoxItem } from '@/components/ListBox/ListBox';
import { Tooltip } from '@/components/Tooltip/Tooltip';
import type { ShipSize } from '@/types/ship';
import { imageUrl } from '@/utils/assets';

import styles from './DisplayHullmods.module.css';
import { OPEN_DELAY_MS, CLOSE_DELAY_MS } from '../../constants/tooltip';
import { getHullmodOpCost, type HullmodOpCostKeys } from '../../utils/op';
import HullmodInfo from '../info/HullmodInfo';

type HullmodKeys = [
    'hullmod_version_id',
    'display_name',
    'hullmod_desc',
    'hullmod_desc_s_mod',
    'hullmod_image_file_path',
    'cost_frigate',
    'cost_destroyer',
    'cost_cruiser',
    'cost_capital',
];

interface DisplayHullmodsProps {
    shipBuiltIn: Projection<HullmodVersionFull, HullmodKeys>[];
    playerBuiltIn: Projection<HullmodVersionFull, HullmodKeys>[];
    nonBuiltIn: Projection<HullmodVersionFull, HullmodKeys>[];
    shipSize: ShipSize;
    isInteractable?: boolean;
    onBuildIn?: (hullmodVersionId: number) => void;
    onRemove?: (hullmodVersionId: number) => void;
}

export function DisplayHullmods({
    shipBuiltIn,
    playerBuiltIn,
    nonBuiltIn,
    shipSize,
    isInteractable = true,
    onBuildIn,
    onRemove,
}: DisplayHullmodsProps) {
    return (
        <div>
            <h2 className={styles.header}>Hull features & mods</h2>
            <ListBox className={styles.listbox} aria-label="Displayed hullmods">
                {sortByOpCost(shipBuiltIn, shipSize).map((hullmod) => (
                    <HullmodItem
                        key={hullmod.hullmod_version_id}
                        hullmod={hullmod}
                        shipSize={shipSize}
                        nameStyle={styles.shipBuiltIn}
                        isInteractable={false}
                    />
                ))}
                {sortByOpCost(playerBuiltIn, shipSize).map((hullmod) => (
                    <HullmodItem
                        key={hullmod.hullmod_version_id}
                        hullmod={hullmod}
                        shipSize={shipSize}
                        nameStyle={styles.playerBuiltIn}
                        isInteractable={isInteractable}
                        onBuildIn={onBuildIn}
                        onRemove={onRemove}
                    />
                ))}
                {sortByOpCost(nonBuiltIn, shipSize).map((hullmod) => (
                    <HullmodItem
                        key={hullmod.hullmod_version_id}
                        hullmod={hullmod}
                        shipSize={shipSize}
                        isInteractable={isInteractable}
                        onBuildIn={onBuildIn}
                        onRemove={onRemove}
                    />
                ))}
            </ListBox>
        </div>
    );
}

function sortByOpCost<
    TData extends Projection<HullmodVersionFull, HullmodOpCostKeys>[],
>(data: TData, shipSize: ShipSize): TData {
    return [...data].sort(
        (a, b) =>
            (getHullmodOpCost(shipSize, b) ?? 0) -
            (getHullmodOpCost(shipSize, a) ?? 0),
    ) as TData;
}

type HullmodItemProps = {
    hullmod: Projection<HullmodVersionFull, HullmodKeys>;
    shipSize: ShipSize;
    isInteractable: boolean;
    nameStyle?: string;
    onBuildIn?: (hullmodVersionId: number) => void;
    onRemove?: (hullmodVersionId: number) => void;
};

function HullmodItem({
    hullmod,
    shipSize,
    isInteractable,
    nameStyle,
    onBuildIn,
    onRemove,
}: HullmodItemProps) {
    return (
        <ListBoxItem
            key={hullmod.hullmod_version_id}
            className={styles.item}
            textValue={hullmod.display_name ?? ''}
        >
            <div className={styles.card}>
                <div className={clsx(styles.name, nameStyle)}>
                    {hullmod.display_name ?? ''}
                </div>
                <div className={styles.opCost}>
                    {getHullmodOpCost(shipSize, hullmod)}
                </div>
                {isInteractable && (
                    <>
                        <button
                            className={styles.buildIn}
                            onClick={() =>
                                onBuildIn?.(hullmod.hullmod_version_id)
                            }
                        >
                            B
                        </button>
                        <button
                            className={styles.remove}
                            onClick={() =>
                                onRemove?.(hullmod.hullmod_version_id)
                            }
                        >
                            X
                        </button>
                    </>
                )}

                <TooltipTrigger
                    delay={OPEN_DELAY_MS}
                    closeDelay={CLOSE_DELAY_MS}
                >
                    <Focusable>
                        <div className={styles.imageWrapper} role="button">
                            <img
                                className={styles.img}
                                src={imageUrl(hullmod.hullmod_image_file_path)}
                                alt={hullmod.display_name ?? ''}
                            />
                        </div>
                    </Focusable>
                    <Tooltip placement="left">
                        <HullmodInfo hullmod={hullmod} />
                    </Tooltip>
                </TooltipTrigger>
            </div>
        </ListBoxItem>
    );
}
