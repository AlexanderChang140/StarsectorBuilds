import {
    BUILD_FULL_KEYS,
    type BuildFull,
} from '@starsector-builds/shared/builds/types';
import {
    SHIP_VERSION_FULL_KEYS,
    type ShipWeaponSlotFull,
    type ShipVersionFull,
} from '@starsector-builds/shared/ships/schema';
import {
    WEAPON_VERSION_FULL_KEYS,
    type WeaponVersionFull,
} from '@starsector-builds/shared/weapons/schema';

import { buildFields } from '@/api/apiRequestBuilder';
import { usePaginatedQuery } from '@/api/hooks/usePaginatedQuery';

import { ShipCanvas } from '../components/canvas/ShipCanvas';
import { QUERY_LIMIT } from '../constants/query';

interface BuildProps {}

export function Builds({}: BuildProps) {
    const limit = QUERY_LIMIT;
    const pageIndex = 0;

    const { data: buildsData, total: buildsTotal } =
        usePaginatedQuery<BuildFull>({
            endpoint: '/api/builds',
            resourceKey: 'builds',
            params: {
                fields: buildFields(BUILD_FULL_KEYS),
                limit,
                offset: pageIndex * limit,
            },
        });
    const buildByShipVid = Object.entries(
        buildsData.map((build) => [build.ship_version_id, build]),
    );

    const shipVids = buildsData.map((build) => build.ship_version_id);
    const { data: shipsData, total: shipsTotal } =
        usePaginatedQuery<ShipVersionFull>({
            endpoint: '/api/ship-versions',
            resourceKey: 'ship-versions',
            params: {
                fields: buildFields(SHIP_VERSION_FULL_KEYS),
                filter: {
                    ship_version_id: {
                        values: shipVids,
                    },
                },
                limit,
                offset: pageIndex * limit,
            },
            isEnabled: shipVids.length > 0,
        });
    const shipByVid = Object.fromEntries(
        shipsData.map((ship) => [ship.ship_version_id, ship]),
    );

    const shipWeaponSlotIds = shipsData.map((ship) => ship);
    const { data, total } = usePaginatedQuery<ShipWeaponSlotFull>({
        endpoint: '',
    });

    const combined = buildsData
        .map((build) => ({
            build,
            ship: shipByVid[build.ship_version_id],
        }))
        .filter((data) => data.ship != null);

    const installedWeaponsVids = combined.flatMap(({ build, ship }) => [
        ...build.installed_weapons.map(([, vid]) => vid),
        ...ship.built_in_weapons.map(([, vid]) => vid),
    ]);
    const { data: installedWeaponsData, total: installedWeaponsTotal } =
        usePaginatedQuery<WeaponVersionFull>({
            endpoint: '/api/weapon-versions',
            resourceKey: 'weapon-versions',
            params: {
                fields: buildFields(WEAPON_VERSION_FULL_KEYS),
                filter: { weapon_version_id: { values: installedWeaponsVids } },
            },
            isEnabled: installedWeaponsVids.length > 0,
        });
    const installedWeaponByVid = Object.entries(
        installedWeaponsData.map((weapon) => [
            weapon.weapon_version_id,
            weapon,
        ]),
    );

    const combined2 = combined.map({});

    return (
        <div>
            {combined.map(({ build, ship }) => {
                return (
                    <div key={build.build_id}>
                        {build.ship_image_file_path && (
                            <ShipCanvas
                                src={build.ship_image_file_path}
                                slotsProps={{
                                    shipCenter: { x: ship.x, y: ship.y },
                                }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
