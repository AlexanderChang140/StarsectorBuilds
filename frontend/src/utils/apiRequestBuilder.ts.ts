import type { ApiEndpoint, ApiRequest } from '../types/api';

export function buildApiRequest<TApiEndpoint extends ApiEndpoint>(
    request: ApiRequest<TApiEndpoint>,
): `${TApiEndpoint}${string}` {
    const queryParams = buildQueryParams(request.params);
    const queryString = queryParams ? `?${queryParams}` : '';

    return `${request.endpoint}${queryString}`;
}

export function buildQueryParams<T extends object | undefined>(query?: T) {
    if (!query) return '';
    const params = new URLSearchParams();

    function appendParam(key: string, value: unknown) {
        if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, String(v)));
        } else if (typeof value === 'object' && value !== null) {
            Object.entries(value).forEach(([k, v]) => appendParam(k, v));
        } else if (value != null) {
            params.set(key, String(value));
        }
    }

    Object.entries(query).forEach(([key, value]) => {
        appendParam(key, value);
    });
    return params.toString();
}
