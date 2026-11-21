import type { HullmodVersionFull } from '@starsector-builds/shared/hullmods/types';
import type { Projection } from '@starsector-builds/shared/types';
import { Focusable } from 'react-aria-components';

import { ListBoxItem } from '@/components/ListBox/ListBox';
import { Tooltip, TooltipTrigger } from '@/components/Tooltip/Tooltip';
import type { ShipSize } from '@/types/ship';
import { imageUrl } from '@/utils/assets';

import styles from './GenericRow.module.css';
import type { HULLMOD_KEYS } from '../../constants/keys';
import { OPEN_DELAY_MS, CLOSE_DELAY_MS } from '../../constants/tooltip';
import { getHullmodOpCost } from '../../utils/op';
import HullmodInfo from '../info/HullmodInfo';

interface HullmodRowProps {
    hullmod: Projection<HullmodVersionFull, typeof HULLMOD_KEYS>;
    shipSize: ShipSize;
    onSetHullmod: (hullmodVersionId: number) => void;
}

export default function HullmodRow({
    hullmod,
    shipSize,
    onSetHullmod,
}: HullmodRowProps) {
    return (
        <ListBoxItem
            className={styles.listboxItem}
            textValue={hullmod.display_name ?? ''}
            onAction={() => onSetHullmod(hullmod.hullmod_version_id)}
        >
            <TooltipTrigger delay={OPEN_DELAY_MS} closeDelay={CLOSE_DELAY_MS}>
                <Focusable>
                    <div className={styles.card} role="button">
                        <div className={styles.imageWrapper}>
                            {hullmod.hullmod_image_file_path ? (
                                <img
                                    className={styles.img}
                                    src={imageUrl(
                                        hullmod.hullmod_image_file_path,
                                    )}
                                    alt={hullmod.display_name ?? ''}
                                />
                            ) : (
                                <div className={styles.imageFallback}>
                                    No image found
                                </div>
                            )}
                        </div>
                        <div className={styles.text1}>
                            {hullmod.display_name}
                        </div>
                        <div className={styles.text2}>
                            {hullmod.manufacturer ?? 'Common'}
                        </div>
                        <div className={styles.text3}></div>
                        <div className={styles.opCost}>
                            {getHullmodOpCost(shipSize, hullmod)}
                        </div>
                        <div className={styles.opText}>OP</div>
                    </div>
                </Focusable>

                <Tooltip className={styles.infoContainer} placement="left">
                    <HullmodInfo hullmod={hullmod} />
                </Tooltip>
            </TooltipTrigger>
        </ListBoxItem>
    );
}
