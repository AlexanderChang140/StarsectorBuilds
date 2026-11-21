import useHullmodsQuery from '../queries/useHullmodsQuery';
import useInstalledHullmodsQuery from '../queries/useInstalledHullmodsQuery';

interface UseShipHullmodsProps {
    modVersions: number[];
    hullmods: Record<number, boolean>;
    builtInHullmods: number[][];
    pageIndex: number;
}

export function useShipHullmods({
    modVersions,
    hullmods,
    builtInHullmods,
    pageIndex,
}: UseShipHullmodsProps) {
    const hullmodsQuery = useHullmodsQuery(modVersions, pageIndex);
    const data = hullmodsQuery.data?.data ?? [];
    const total = hullmodsQuery.data?.meta.total ?? 0;
    const record = Object.fromEntries(
        data.map((hullmod) => [hullmod.hullmod_version_id, hullmod]),
    );

    const shipBuiltInVids = builtInHullmods.map(([, vid]) => vid);
    const installedVids = Object.keys(hullmods).map(Number);

    const installedQuery = useInstalledHullmodsQuery([
        ...installedVids,
        ...shipBuiltInVids,
    ]);
    const installedData = installedQuery.data?.data ?? [];
    const installedRecord = Object.fromEntries(
        installedData.map((hullmod) => [hullmod.hullmod_version_id, hullmod]),
    );

    const combinedRecord = { ...record, ...installedRecord };

    const shipBuiltIn = shipBuiltInVids
        .map((vid) => combinedRecord[vid])
        .filter((hullmod) => hullmod != null);

    const playerBuiltIn = Object.entries(hullmods)
        .filter(([, isBuiltIn]) => isBuiltIn === true)
        .map(([vid]) => combinedRecord[Number(vid)])
        .filter((hullmod) => hullmod != null);

    const nonBuiltIn = Object.entries(hullmods)
        .filter(([, isBuiltIn]) => !isBuiltIn)
        .map(([vid]) => combinedRecord[vid])
        .filter((hullmod) => hullmod != null);

    return {
        data,
        total,
        shipBuiltIn,
        playerBuiltIn,
        nonBuiltIn,
    };
}
