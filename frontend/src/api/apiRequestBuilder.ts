import { typedEntries } from '@/utils/object';

import type { ApiEndpoint, ApiRequest, ControlParams } from './types';

export function buildApiRequest<TApiEndpoint extends ApiEndpoint>(
    request: ApiRequest<TApiEndpoint>,
): `${TApiEndpoint}${string}` {
    const queryParams = buildQueryParams(request.params);
    const queryString = queryParams ? `?${queryParams}` : '';

    return `${request.endpoint}${queryString}`;
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

    if (controlParams.order !== undefined) {
        queryParams.append('order', String(controlParams.order));
    }

    if (controlParams.sort !== undefined) {
        queryParams.append('sort', String(controlParams.sort));
    }

    return queryParams.toString();
}

export function buildFields<TData>(keys: readonly (keyof TData)[]) {
    return keys.join(',');
}
