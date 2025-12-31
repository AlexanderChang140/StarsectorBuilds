import type { ShipVersionDTO } from '@shared/ships/types.ts';
import { useParams } from 'react-router';

import UseVersionsQuery from '@/hooks/useVersionsQuery.tsx';
import { sortVersions } from '@/modules/display/versionSorter';
import { imageUrl } from '@/utils/assets';
import { parseIntOrNaN } from '@/utils/parse.ts';

import '@/components/Display.css';

export default function ShipDisplay() {
    const { shipId, versionId } = useParams();
    const parsedShipId = parseIntOrNaN(shipId);
    const parsedVersionId = parseIntOrNaN(versionId);

    const versionsKeys = [
        'ship_version_id',
        'major',
        'minor',
        'patch',
    ] as const satisfies readonly (keyof ShipVersionDTO)[];

    const versionKeys = [
        'display_name',
        'text1',
        'text2',
        'ship_image_file_path',
    ] satisfies readonly (keyof ShipVersionDTO)[];

    const { versionQuery, versionsQuery } = UseVersionsQuery<
        ShipVersionDTO,
        typeof versionsKeys,
        typeof versionKeys
    >({
        entityId: parsedShipId,
        entityQueryKey: 'shipVersions',
        versionsKeys,
        versionsEndpoint: `/api/ships/${parsedShipId}/versions`,
        versionId: parsedVersionId,
        versionQueryKey: 'shipVersion',
        versionKeys,
        versionEndpoint: `/api/ship-versions/${parsedVersionId}`,
        latestVersionEndpoint: `/api/ships/${parsedShipId}/versions/latest`,
    });

    if (versionQuery.isError)
        return <div>Error: {versionQuery.error.message}</div>;
    if (versionQuery.isPending) return <div>Loading...</div>;
    if (!versionQuery.data) return <div>No data found</div>;
    const versions = sortVersions(versionsQuery.data, 'ship_version_id');

    const data = versionQuery.data;

    return (
        <div>
            <div className="display">
                <select name="versions">{versions}</select>
                <div className="title">
                    <h1>{data.display_name}</h1>
                    <hr></hr>
                </div>
                <div className="body">
                    <p>{data.text1}</p>
                    <p>{data.text2}</p>
                </div>
                <div className="profile">
                    <div className="name">
                        <h3>{data.display_name}</h3>
                    </div>
                    <div className="image-container">
                        <img
                            className="base"
                            src={imageUrl(data.ship_image_file_path)}
                        ></img>
                    </div>
                    <div className="stats">Stats</div>
                </div>
            </div>
        </div>
    );
}
