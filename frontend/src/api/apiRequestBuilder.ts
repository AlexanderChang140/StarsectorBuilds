import { typedEntries } from '@/utils/object';

import type { ApiEndpoint, ApiRequest, ControlParams } from './types';

export function buildApiRequest<TApiEndpoint extends ApiEndpoint>(
    request: ApiRequest<TApiEndpoint>,
): null extends TApiEndpoint
    ? `${NonNullable<TApiEndpoint>}${string}` | null
    : `${NonNullable<TApiEndpoint>}${string}` {
    if (!request.endpoint) {
        return null as null extends TApiEndpoint ? null : never;
    }

    const queryParams = buildQueryParams(request.params);
    const queryString = queryParams ? `?${queryParams}` : '';

    return `${request.endpoint}${queryString}` as `${NonNullable<TApiEndpoint>}${string}`;
}

export function buildQueryParams(
    controlParams: Partial<ControlParams> | undefined,
) {
    if (!controlParams) return '';
    const queryParams = new URLSearchParams();

    if (controlParams.fields !== undefined) {
        queryParams.append('fields', controlParams.fields);
    }

    if (controlParams.filter !== undefined) {
        typedEntries(controlParams.filter).forEach(([key, filter]) => {
            filter.values.forEach((v) =>
                queryParams.append(`${key}[values]`, String(v)),
            );
            if (filter.match) {
                queryParams.append(`${key}[match]`, filter.match);
            }
            if (filter.not) {
                queryParams.append(`${key}[not]`, String(filter.not));
            }
        });
    }

    if (controlParams.limit !== undefined) {
        queryParams.append('limit', String(controlParams.limit));
    }

    if (controlParams.offset !== undefined) {
        queryParams.append('offset', String(controlParams.offset));
    }

    if (controlParams.sort !== undefined) {
        controlParams.sort.forEach(([field, order]) =>
            queryParams.append('sort', `${field}:${order}`),
        );
    }

    return queryParams.toString();
}

export function buildFields<TData>(keys: readonly (keyof TData)[]) {
    return keys.join(',');
}

export function normalizeQueryParams(
    params: Partial<ControlParams> | undefined,
) {
    if (!params) return undefined;

    const filter = params.filter
        ? Object.fromEntries(
              Object.entries(params.filter)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([key, cond]) => [
                      key,
                      {
                          ...cond,
                          values: [...new Set(cond.values)].sort((a, b) =>
                              String(a).localeCompare(String(b)),
                          ),
                      },
                  ]),
          )
        : undefined;

    const sort = params.sort ? [...params.sort] : undefined;

    return {
        ...(filter !== undefined ? { filter } : {}),
        ...(sort !== undefined ? { sort } : {}),
        ...(params.limit !== undefined ? { limit: params.limit } : {}),
        ...(params.offset !== undefined ? { offset: params.offset } : {}),
    };
}
