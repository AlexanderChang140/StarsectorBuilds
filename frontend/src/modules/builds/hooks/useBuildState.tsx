import { useState } from 'react';

import { clamp } from '@/utils/math';

import { getMaxFluxItems } from '../utils/flux';

const createInitialBuildState = (init: {
    modVid: number;
    shipVid: number;
}): BuildState => ({
    ship_version_id: init.shipVid,
    modVersions: new Set([init.modVid]),
    title: '',
    content: '',
    stats: { vents: 0, capacitors: 0 },
    weapons: {},
    wings: {},
    hullmods: {},
});

interface UseBuildStateProps {
    modVid: number;
    shipVid: number;
    shipSize: string;
}

export type BuildState = {
    ship_version_id: number;
    title: string;
    stats: {
        vents: number;
        capacitors: number;
    };
    modVersions: Set<number>;
    weapons: Record<number, number>;
    wings: Record<number, number>;
    hullmods: Record<number, boolean>;
    content?: string | undefined;
};

export function useBuildState({
    modVid,
    shipVid,
    shipSize = '',
}: UseBuildStateProps) {
    const [build, setBuild] = useState<BuildState>(
        createInitialBuildState({ modVid, shipVid }),
    );

    const updateField = <K extends keyof BuildState>(
        field: K,
        value: BuildState[K],
    ) => {
        setBuild((prev) => ({ ...prev, [field]: value }));
    };

    const addModVersion = (modVid: number) => {
        setBuild((prev) => ({
            ...prev,
            modVersions: new Set([...prev.modVersions, modVid]),
        }));
    };

    const removeModVersion = (modVid: number) => {
        setBuild((prev) => {
            const modVersions = new Set(prev.modVersions);
            modVersions.delete(modVid);
            return { ...prev, modVersions };
        });
    };

    const setTitle = (title: string) => {
        setBuild((prev) => ({ ...prev, title }));
    };

    const setContent = (content: string) => {
        setBuild((prev) => ({ ...prev, content }));
    };

    const setVents = (f: (prevVents: number) => number) => {
        const maxVents = getMaxFluxItems(shipSize);
        setBuild((prev) => ({
            ...prev,
            stats: {
                ...prev.stats,
                vents: clamp(f(prev.stats.vents), 0, maxVents),
            },
        }));
    };

    const setCapacitors = (f: (prevCapacitors: number) => number) => {
        const maxCapacitors = getMaxFluxItems(shipSize);
        setBuild((prev) => ({
            ...prev,
            stats: {
                ...prev.stats,
                capacitors: clamp(f(prev.stats.capacitors), 0, maxCapacitors),
            },
        }));
    };

    const addWeapon = (slotId: number, weaponVid: number) => {
        setBuild((prev) => ({
            ...prev,
            weapons: { ...prev.weapons, [slotId]: weaponVid },
        }));
    };

    const removeWeapon = (slotId: number) => {
        setBuild((prev) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [slotId]: _, ...weapons } = prev.weapons;
            return { ...prev, weapons };
        });
    };

    const addWing = (slotId: number, wingVid: number) => {
        setBuild((prev) => ({
            ...prev,
            wings: { ...prev.wings, [slotId]: wingVid },
        }));
    };

    const removeWing = (shipWeaponSlotId: number) => {
        setBuild((prev) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [shipWeaponSlotId]: _, ...wings } = prev.wings;
            return { ...prev, wings };
        });
    };

    const addHullmod = (hullmodVid: number) => {
        setBuild((prev) => ({
            ...prev,
            hullmods: { ...prev.hullmods, [hullmodVid]: false },
        }));
    };

    const removeHullmod = (hullmodVid: number) => {
        setBuild((prev) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [hullmodVid]: _, ...hullmods } = prev.hullmods;
            return { ...prev, hullmods: hullmods };
        });
    };

    const toggleBuiltInHullmod = (hullmodVid: number) => {
        setBuild((prev) => {
            if (!(hullmodVid in prev.hullmods)) {
                return prev;
            }

            return {
                ...prev,
                hullmods: {
                    ...prev.hullmods,
                    [hullmodVid]: !prev.hullmods[hullmodVid],
                },
            };
        });
    };

    return {
        build,
        updateField,
        addModVersion,
        removeModVersion,
        setTitle,
        setContent,
        setVents,
        setCapacitors,
        addWeapon,
        removeWeapon,
        addWing,
        removeWing,
        addHullmod,
        removeHullmod,
        toggleBuiltInHullmod,
    };
}
