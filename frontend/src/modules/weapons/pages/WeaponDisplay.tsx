import type { WeaponVersionDTO } from '@shared/weapons/types';
import { useParams } from 'react-router';

import styles from '@/components/Display.module.css';
import UseVersionsQuery from '@/hooks/useVersionsQuery.tsx';
import { sortVersions } from '@/modules/display/versionSorter.tsx';
import { imageUrl } from '@/utils/assets';
import { parseIntOrNaN } from '@/utils/parse';


export default function WeaponDisplay() {
    const { weaponId, versionId } = useParams();
    const parsedWeaponId = parseIntOrNaN(weaponId);
    const parsedVersionId = parseIntOrNaN(versionId);

    const versionsKeys = [
        'weapon_version_id',
        'major',
        'minor',
        'patch',
    ] as const satisfies readonly (keyof WeaponVersionDTO)[];

    const versionKeys = [
        'display_name',
        'text1',
        'text2',
        'turret_image_file_path',
        'turret_gun_image_file_path',
    ] satisfies readonly (keyof WeaponVersionDTO)[];

    const { versionsQuery, versionQuery } = UseVersionsQuery<
        WeaponVersionDTO,
        typeof versionsKeys,
        typeof versionKeys
    >({
        entityId: parsedWeaponId,
        entityQueryKey: 'weaponVersions',
        versionsKeys,
        versionsEndpoint: `/api/weapons/${parsedWeaponId}/versions`,
        versionId: parsedVersionId,
        versionQueryKey: 'weaponVersion',
        versionKeys,
        versionEndpoint: `/api/weapon-versions/${parsedVersionId}`,
        latestVersionEndpoint: `/api/weapons/${parsedWeaponId}/versions/latest`,
    });

    if (versionQuery.isError)
        return <div>Error: {versionQuery.error.message}</div>;
    if (versionQuery.isPending) return <div>Loading...</div>;
    if (!versionQuery.data) return <div>No data found</div>;
    const versions = sortVersions(versionsQuery.data?.data, 'weapon_version_id');

    const data = versionQuery.data;

    return (
        <div className={styles.display}>
            <select name={styles.versions}>{versions}</select>
            <div className={styles.title}>
                <h1>{data.display_name}</h1>
                <hr></hr>
            </div>
            <div className={styles.body}>
                <p>{data.text1}</p>
                <p>{data.text2}</p>
            </div>
            <div className={styles.profile}>
                <div className={styles.name}>
                    <h3>{data.display_name}</h3>
                </div>
                <div className={styles.imageContainer}>
                    <img
                        className={styles.base}
                        src={imageUrl(data.turret_image_file_path)}
                    ></img>
                    {data.turret_gun_image_file_path && (
                        <img
                            className={styles.overlay}
                            src={imageUrl(data.turret_gun_image_file_path)}
                        ></img>
                    )}
                </div>
                <div className={styles.stats}>Stats</div>
            </div>
        </div>
    );
}
