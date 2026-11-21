import {
    BuildFullSchema,
    type BuildComment,
    type PreparedBuild,
} from '@starsector-builds/shared/builds/types';

import {
    createFilterCondition,
    createFilterOption,
} from '../../db/helpers/filter.ts';
import { insert } from '../../db/helpers/insert.ts';
import { selectOne, selectWithCount } from '../../db/helpers/select.ts';
import { startTransaction } from '../../db/helpers/transaction.ts';
import type { BuildsFullRow } from '../../db/tables.ts';
import type { Options, Selection } from '../../db/types.ts';
import { BadRequestError, NotFoundError } from '../../server/error.ts';
import { parseProjection, parseProjectionArray } from '../../utils/zod.ts';
import { fetchHullmodVersions } from '../hullmods/service.ts';
import { fetchModVersions } from '../mods/service.ts';
import { fetchShipVersionFull } from '../ships/service.ts';
import { fetchWeaponVersionById } from '../weapons/service.ts';
import {
    fetchWingVersionFull,
} from '../wings/service.ts';

export async function fetchBuildById<
    TSelection extends Selection<BuildsFullRow>,
>(selection: TSelection, buildId: number) {
    const filter = { build_id: createFilterCondition(buildId) };
    const result = await selectOne('builds_full', selection, { filter });

    if (!result) {
        throw new NotFoundError(`Failed to find build: build_id = ${buildId}`);
    }

    const data = parseProjection(result, selection, BuildFullSchema);

    return data;
}

export async function fetchBuilds<TSelection extends Selection<BuildsFullRow>>(
    selection: TSelection,
    options?: Options<BuildsFullRow>,
) {
    const result = await selectWithCount('builds_full', selection, options);
    const data = parseProjectionArray(result.rows, selection, BuildFullSchema);
    return { data, total: result.total };
}

export async function createBuild(userId: number, build: PreparedBuild) {
    const buildId = await startTransaction(async (client) => {
        const ship = await fetchShipVersionFull(
            ['ship_id', 'ship_instance_id'],
            createFilterOption('ship_version_id', build.ship_version_id),
        );

        if (!ship) {
            throw new Error(
                `Failed to find ship: ship_version_id = ${build.ship_version_id}`,
            );
        }

        const buildId = (
            await insert('builds', {
                record: {
                    content: build.content ?? null,
                    ship_id: ship.ship_id,
                    ship_instance_id: ship.ship_instance_id,
                    ship_version_id: build.ship_version_id,
                    title: build.title,
                    user_id: userId,
                },
                returnKeys: ['id'],
                client,
            })
        ).id;

        await insert('build_stats', {
            record: {
                build_id: buildId,
                ...build.stats,
            },
            client,
        });

        await Promise.all(
            [...build.modVersions].map(async (modVid) => {
                const mod = (
                    await fetchModVersions(['mod_id'], {
                        filter: { mod_version_id: { values: [modVid] } },
                    })
                ).rows[0];

                if (!mod) {
                    throw new BadRequestError(
                        `Failed to find mod: mod_version_id = ${modVid}`,
                    );
                }

                await insert('build_mod_versions', {
                    record: {
                        build_id: buildId,
                        mod_id: mod.mod_id,
                        mod_version_id: modVid,
                    },
                    client,
                });
            }),
        );

        await Promise.all(
            Object.entries(build.weapons).map(async ([slotId, weaponVid]) => {
                const weapon = await fetchWeaponVersionById(weaponVid, [
                    'mod_version_id',
                ]);

                if (!weapon) {
                    throw new BadRequestError(
                        `Failed to find weapon: weapon_version_id = ${weaponVid}`,
                    );
                }

                await insert('build_weapons', {
                    record: {
                        build_id: buildId,
                        mod_version_id: weapon.mod_version_id,
                        ship_instance_id: ship.ship_instance_id,
                        ship_weapon_slot_id: Number(slotId),
                        weapon_version_id: weaponVid,
                    },
                    client,
                });
            }),
        );

        await Promise.all(
            Object.entries(build.hullmods).map(
                async ([hullmodVid, isBuiltIn]) => {
                    const hullmod = (
                        await fetchHullmodVersions(['mod_version_id'], {
                            filter: {
                                hullmod_version_id: {
                                    values: [Number(hullmodVid)],
                                },
                            },
                        })
                    ).rows[0];

                    if (!hullmod) {
                        throw new BadRequestError(
                            `Failed to find hullmod: hullmod_version_id = ${hullmodVid}`,
                        );
                    }

                    await insert('build_hullmods', {
                        record: {
                            build_id: buildId,
                            mod_version_id: hullmod.mod_version_id,
                            hullmod_version_id: Number(hullmodVid),
                            built_in: isBuiltIn,
                        },
                        client,
                    });
                },
            ),
        );

        await Promise.all(
            Object.entries(build.wings).map(async ([slotId, wingVid]) => {
                const wing = await fetchWingVersionFull(
                    ['mod_version_id'],
                    createFilterOption('wing_version_id', wingVid),
                );

                if (!wing) {
                    throw new BadRequestError(
                        `Failed to find wing: wing_version_id = ${wingVid}`,
                    );
                }

                await insert('build_wings', {
                    record: {
                        build_id: buildId,
                        mod_version_id: wing.mod_version_id,
                        ship_instance_id: ship.ship_instance_id,
                        ship_weapon_slot_id: Number(slotId),
                        wing_version_id: wingVid,
                    },
                    client,
                });
            }),
        );
        return buildId;
    }, 'Failed to create build');
    return buildId;
}

export async function createBuildComment(comment: BuildComment) {
    insert('build_comments', { record: comment });
}
