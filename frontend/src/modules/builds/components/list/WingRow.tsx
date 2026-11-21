import type { Projection } from '@starsector-builds/shared/types';
import type { WingVersionFull } from '@starsector-builds/shared/wings/schema';
import { Focusable } from 'react-aria-components';

import { ListBoxItem } from '@/components/ListBox/ListBox';
import { Tooltip, TooltipTrigger } from '@/components/Tooltip/Tooltip';
import { imageUrl } from '@/utils/assets';

import styles from './GenericRow.module.css';
import type { WING_KEYS } from '../../constants/keys';
import { CLOSE_DELAY_MS, OPEN_DELAY_MS } from '../../constants/tooltip';
import WingInfo from '../info/WingInfo';

interface WingRowProps {
    wing: Projection<WingVersionFull, typeof WING_KEYS>;
    activeWing: Projection<WingVersionFull, typeof WING_KEYS> | null;
    isCtrlPressed: boolean;
    onSetWing: (wingVid: number) => void;
}

export default function WingRow({
    wing,
    activeWing,
    isCtrlPressed,
    onSetWing,
}: WingRowProps) {
    const shouldShowActive = isCtrlPressed && activeWing != null;
    const name = wing.display_name ?? wing.fighter_ship_code;
    return (
        <ListBoxItem
            className={styles.listboxItem}
            textValue={name}
            onAction={() => {
                onSetWing(wing.wing_version_id);
            }}
        >
            <TooltipTrigger delay={OPEN_DELAY_MS} closeDelay={CLOSE_DELAY_MS}>
                <Focusable>
                    <div className={styles.card} role="button">
                        <div className={styles.imageWrapper}>
                            {wing.ship_image_file_path ? (
                                <img
                                    className={styles.img}
                                    src={imageUrl(wing.ship_image_file_path)}
                                    alt={name}
                                />
                            ) : (
                                <div className={styles.imageFallback}>
                                    No image found
                                </div>
                            )}
                        </div>
                        <div className={styles.text1}>{name}</div>
                        <div className={styles.text2}>{wing.role_desc}</div>
                        <div className={styles.opCost}>
                            {wing.op_cost ?? '-'}
                        </div>
                        <div className={styles.opText}>OP</div>
                    </div>
                </Focusable>
                <Tooltip className={styles.infoContainer} placement="left">
                    {shouldShowActive && <WingInfo wing={wing} />}
                    <WingInfo wing={wing} />
                </Tooltip>
            </TooltipTrigger>
        </ListBoxItem>
    );
}
