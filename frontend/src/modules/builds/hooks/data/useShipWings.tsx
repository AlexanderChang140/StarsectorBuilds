import type { Projection } from '@starsector-builds/shared/types';
import type { WingVersionFull } from '@starsector-builds/shared/wings/schema';

import type { WING_KEYS } from '../../constants/keys';
import useInstalledWingsQuery from '../queries/useInstalledWingsQuery';
import useWingsQuery from '../queries/useWingsQuery';

interface UseShipWingsProps {
    modVersions: number[];
    wings: Record<number, number>;
    builtInWings: number[][];
    pageIndex: number;
}

export function useShipWings({
    modVersions,
    wings,
    builtInWings,
    pageIndex,
}: UseShipWingsProps) {
    const query = useWingsQuery(modVersions, pageIndex);
    const data = query.data?.data ?? [];
    const total = query.data?.meta.total ?? 0;
    const record = Object.fromEntries(data.map((w) => [w.wing_version_id, w]));

    const builtInVids = builtInWings.map(([vid]) => vid);
    const installedVids = Object.values(wings).map(Number);

    const installedQuery = useInstalledWingsQuery([
        ...installedVids,
        ...builtInVids,
    ]);
    const installedData = installedQuery.data?.data ?? [];
    const installedRecord = Object.fromEntries(
        installedData.map((w) => [w.wing_version_id, w]),
    );

    const builtIn = builtInWings
        .map(([vid, numWings]) => ({
            wing: installedRecord[vid],
            numWings,
        }))
        .sort((a, b) => a.wing.wing_version_id - b.wing.wing_version_id);

    const installedBySlot: Record<
        number,
        Projection<WingVersionFull, typeof WING_KEYS>
    > = Object.fromEntries(
        Object.entries(wings)
            .map(([slotId, vid]) => [
                slotId,
                installedRecord[vid] ?? record[vid],
            ])
            .filter(([, w]) => w != null),
    );

    return {
        data,
        total,
        record,
        builtIn,
        installedBySlot,
    };
}
