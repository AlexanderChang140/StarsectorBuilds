import type { Projection } from '@shared/types';
import { useQuery } from '@tanstack/react-query';

import type { ApiEndpoint } from '@/types/api';
import { buildApiRequest, buildFields } from '@/utils/apiRequestBuilder.ts';
import fetchSafe from '@/utils/fetchSafe';

type VersionsProps<
    TData extends object,
    TVersionsKeys extends readonly (keyof TData)[],
    TVersionKeys extends readonly (keyof TData)[],
> = {
    entityId: number;
    entityQueryKey: string;
    versionsKeys: TVersionsKeys;
    versionsEndpoint: ApiEndpoint;
    versionId: number;
    versionQueryKey: string;
    versionKeys: TVersionKeys;
    versionEndpoint: ApiEndpoint;
    latestVersionEndpoint: ApiEndpoint;
};

export default function UseVersionsQuery<
    TData extends object,
    TVersionsKeys extends readonly (keyof TData)[],
    TVersionKeys extends readonly (keyof TData)[],
>({
    entityId,
    entityQueryKey,
    versionsKeys,
    versionsEndpoint,
    versionId,
    versionQueryKey,
    versionKeys,
    versionEndpoint,
    latestVersionEndpoint,
}: VersionsProps<TData, TVersionsKeys, TVersionKeys>) {
    const hasValidEntityId = Number.isInteger(entityId);

    const versionsRequest = buildApiRequest({
        endpoint: versionsEndpoint,
        params: {
            fields: buildFields(versionsKeys),
        },
    });
    const versionsQuery = useQuery<Projection<TData, typeof versionsKeys>[]>({
        queryKey: [entityQueryKey, entityId],
        queryFn: () =>
            fetchSafe<Projection<TData, typeof versionsKeys>[]>(
                versionsRequest,
            ),
        enabled: hasValidEntityId,
    });

    const hasValidVersionId = Number.isInteger(versionId);

    const currVersionRequest = !Number.isNaN(versionId)
        ? buildApiRequest({
              endpoint: versionEndpoint,
              params: {
                  fields: buildFields(versionKeys),
              },
          })
        : latestVersionEndpoint;

    const versionKey = hasValidVersionId ? versionId : 'latest';
    const versionQuery = useQuery<Projection<TData, typeof versionKeys>>({
        queryKey: [versionQueryKey, entityId, versionKey],
        queryFn: () =>
            fetchSafe<Projection<TData, typeof versionKeys>>(
                currVersionRequest,
            ),
        enabled: hasValidEntityId,
    });

    return { versionsQuery, versionQuery };
}
