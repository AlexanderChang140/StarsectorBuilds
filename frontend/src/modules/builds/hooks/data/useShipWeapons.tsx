import type { Projection } from '@starsector-builds/shared/types';
import type { WeaponVersionFull } from '@starsector-builds/shared/weapons/schema';

import type { WEAPON_KEYS } from '../../constants/keys';
import type { ActiveSlot } from '../../types';
import useInstalledWeaponsQuery from '../queries/useInstalledWeaponsQuery';
import useWeaponsQuery from '../queries/useWeaponsQuery';

interface UseShipWeaponsProps {
    modVersions: number[];
    weapons: Record<number, number>;
    builtInWeapons: number[][];
    activeSlot: ActiveSlot | null;
    pageIndex: number;
}

export function useShipWeapons({
    modVersions,
    weapons,
    builtInWeapons,
    activeSlot,
    pageIndex,
}: UseShipWeaponsProps) {
    const query = useWeaponsQuery(modVersions, activeSlot, pageIndex);
    const data = query.data?.data ?? [];
    const total = query.data?.meta.total ?? 0;
    const record = Object.fromEntries(
        data.map((w) => [w.weapon_version_id, w]),
    );

    const builtInVids = builtInWeapons.map(([, vid]) => vid);
    const installedVids = Object.values(weapons).map(Number);

    const installedQuery = useInstalledWeaponsQuery([
        ...installedVids,
        ...builtInVids,
    ]);
    const installedData = installedQuery.data?.data ?? [];
    const installedRecord = Object.fromEntries(
        installedData.map((w) => [w.weapon_version_id, w]),
    );

    const installedBySlot: Record<
        number,
        Projection<WeaponVersionFull, typeof WEAPON_KEYS>
    > = Object.fromEntries(
        Object.entries(weapons)
            .map(([slotId, vid]) => [
                slotId,
                installedRecord[vid] ?? record[vid],
            ])
            .filter(([, w]) => w != null),
    );

    const builtInBySlot: Record<
        number,
        Projection<WeaponVersionFull, typeof WEAPON_KEYS>
    > = Object.fromEntries(
        builtInWeapons.map(([slotId, vid]) => [slotId, installedRecord[vid]]),
    );

    const active = activeSlot
        ? installedBySlot[activeSlot.weapon_slot_id]
        : null;

    return {
        data,
        total,
        installedBySlot,
        combinedBySlot: { ...installedBySlot, ...builtInBySlot },
        active,
    };
}
