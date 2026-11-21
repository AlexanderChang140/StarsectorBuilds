import { clsx } from 'clsx';

import { imageUrl } from '@/utils/assets';

export default function WeaponImage({
    turretImageFilePath,
    turretGunImageFilePath,
    scale,
    angle,
    alt,
    styles,
}: {
    turretImageFilePath: string | null;
    turretGunImageFilePath: string | null;
    scale: number;
    angle: number;
    alt: string;
    styles?: Record<string, string>;
}) {
    return (
        <>
            {turretImageFilePath && (
                <img
                    className={clsx(styles?.img)}
                    style={{
                        scale: scale,
                        rotate: `${-angle}deg`,
                    }}
                    src={imageUrl(turretImageFilePath)}
                    alt={alt}
                />
            )}
            {turretGunImageFilePath && (
                <img
                    className={clsx(styles?.img)}
                    style={{
                        scale: scale,
                        rotate: `${-angle}deg`,
                    }}
                    src={imageUrl(turretGunImageFilePath)}
                    alt={alt}
                />
            )}
        </>
    );
}
