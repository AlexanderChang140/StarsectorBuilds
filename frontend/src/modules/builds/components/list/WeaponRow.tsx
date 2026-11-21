import type { Projection } from '@starsector-builds/shared/types';
import type { WeaponVersionFull } from '@starsector-builds/shared/weapons/schema';
import { Focusable } from 'react-aria-components';

import { ListBoxItem } from '@/components/ListBox/ListBox';
import { Tooltip, TooltipTrigger } from '@/components/Tooltip/Tooltip';
import { imageUrl } from '@/utils/assets';

import styles from './GenericRow.module.css';
import type { WEAPON_KEYS } from '../../constants/keys';
import { OPEN_DELAY_MS, CLOSE_DELAY_MS } from '../../constants/tooltip';
import WeaponInfo from '../info/WeaponInfo';

interface WeaponRowProps {
    weapon: Projection<WeaponVersionFull, typeof WEAPON_KEYS>;
    activeWeapon: Projection<WeaponVersionFull, typeof WEAPON_KEYS> | null;
    isCtrlPressed: boolean;
    onSetWeapon: (weaponVersionId: number) => void;
}

export default function WeaponRow({
    weapon,
    activeWeapon,
    isCtrlPressed,
    onSetWeapon,
}: WeaponRowProps) {
    const shouldShowActive = isCtrlPressed && activeWeapon != null;

    return (
        <ListBoxItem
            className={styles.listboxItem}
            textValue={weapon.display_name ?? ''}
            onAction={() => {
                onSetWeapon(weapon.weapon_version_id);
            }}
        >
            <TooltipTrigger delay={OPEN_DELAY_MS} closeDelay={CLOSE_DELAY_MS}>
                <Focusable>
                    <div className={styles.card} role="button">
                        <div className={styles.imageWrapper}>
                            {weapon.turret_image_file_path ? (
                                <img
                                    className={styles.img}
                                    src={imageUrl(
                                        weapon.turret_image_file_path,
                                    )}
                                    alt={weapon.display_name ?? ''}
                                />
                            ) : (
                                <div className={styles.imageFallback}>
                                    No image found
                                </div>
                            )}
                            {weapon.turret_gun_image_file_path && (
                                <img
                                    className={styles.img}
                                    src={imageUrl(
                                        weapon.turret_gun_image_file_path,
                                    )}
                                    alt={weapon.display_name ?? ''}
                                />
                            )}
                        </div>
                        <div className={styles.text1}>
                            {weapon.display_name}
                        </div>
                        <div className={styles.text2}>
                            {weapon.primary_role_str}
                        </div>
                        <div className={styles.opCost}>
                            {weapon.op_cost ?? '-'}
                        </div>
                        <div className={styles.opText}>OP</div>
                    </div>
                </Focusable>
                <Tooltip className={styles.infoContainer} placement="left">
                    {shouldShowActive && <WeaponInfo weapon={activeWeapon} />}
                    <WeaponInfo weapon={weapon} />
                </Tooltip>
            </TooltipTrigger>
        </ListBoxItem>
    );
}
