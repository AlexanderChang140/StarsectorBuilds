import type { ShipVersionFull } from '@starsector-builds/shared/ships/schema';
import type { Projection } from '@starsector-builds/shared/types';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

import { buildApiRequest, buildFields } from '@/api/apiRequestBuilder';
import fetchSafe from '@/api/fetchSafe';
import NotFound from '@/pages/NotFound';
import type { ProjectionKeys } from '@/types/generic';
import { parseIntOrNull } from '@/utils/parse';

import { ShipViewer } from '../components/ShipViewer';
import { SELECTED_SHIP_VERSION_KEYS } from '../constants/keys';
import { useBuildQuery } from '../hooks/queries/useBuildQuery';

export function ViewBuild() {
    const { buildId } = useParams();
    const parsedBuildId = parseIntOrNull(buildId);

    const buildQuery = useBuildQuery(parsedBuildId);
    const buildData = buildQuery.data;

    const shipData = useShipData(buildData?.ship_version_id);

    if (!buildData || !shipData) {
        return <NotFound />;
    }

    return <ShipViewer buildData={buildData} shipData={shipData} />;
}

function useShipData(shipVersionId: number | undefined) {
    const shipRequest = buildApiRequest({
        endpoint: shipVersionId ? `/api/ship-versions/${shipVersionId}` : null,
        params: {
            fields: buildFields(SELECTED_SHIP_VERSION_KEYS),
        },
    });
    const shipQuery = useQuery({
        queryKey: ['shipVersion', shipVersionId],
        queryFn: async () => {
            const res =
                fetchSafe<
                    Projection<ShipVersionFull, ProjectionKeys<ShipVersionFull>>
                >(shipRequest);
            return res;
        },
        enabled: shipVersionId != null,
    });
    const shipData = shipQuery.data;
    return shipData;
}
