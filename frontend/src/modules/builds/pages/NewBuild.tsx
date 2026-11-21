import type { ShipVersionFull } from '@starsector-builds/shared/ships/schema';
import { useParams } from 'react-router';

import useEntityVersionListQuery from '@/hooks/useEntityVersionListQuery';
import NotFound from '@/pages/NotFound';
import { parseIntOrNaN } from '@/utils/parse';
import toVersionString from '@/utils/toVersionString';

import { ShipBuilder } from '../components/ShipBuilder';
import { useSelectedShipVersionQuery } from '../hooks/queries/useSelectedShipVersionQuery';

export function NewBuild() {
    const { shipId, shipVersionId } = useParams();

    const parsedShipId = parseIntOrNaN(shipId);
    const parsedVersionId = parseIntOrNaN(shipVersionId);

    const selectedVersionQuery = useSelectedShipVersionQuery(
        parsedShipId,
        parsedVersionId,
    );
    const shipData = selectedVersionQuery.data;

    const shipVersionListQuery = useShipVersionListQuery(parsedShipId);
    const shipVersionListData = shipVersionListQuery.data?.data;

    const shipVersionItems =
        shipVersionListData?.map((version) => ({
            value: String(version.ship_version_id),
            label: toVersionString(version),
        })) ?? [];

    if (!shipData) {
        return <NotFound />;
    }

    return (
        <ShipBuilder
            shipData={shipData}
            shipVersionId={parsedVersionId}
            shipVersionItems={shipVersionItems}
        />
    );
}

const SHIP_VERSION_KEYS = [
    'ship_version_id',
    'major',
    'minor',
    'patch',
] as const satisfies (keyof ShipVersionFull)[];

function useShipVersionListQuery(shipId: number) {
    return useEntityVersionListQuery<ShipVersionFull, typeof SHIP_VERSION_KEYS>(
        {
            queryKey: 'shipVersions',
            entityId: shipId,
            versionKeys: SHIP_VERSION_KEYS,
            versionEndpoint: `/api/ships/${shipId}/versions`,
        },
    );
}
