export default async function fetchSafe<T>(
    url: string,
    options?: RequestInit,
    defaultMessage?: string,
): Promise<T> {
    const res = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!res.ok) {
        let message = defaultMessage;
        try {
            const error = await res.json();
            message = error.message || defaultMessage;
        } catch {
            message =
                (defaultMessage ?? res.statusText) || 'Response was not JSON';
        }

        throw new Error(`${res.status}: ${message}`);
    }

    if (res.status === 204 || res.headers.get('content-length') === '0') {
        return undefined as unknown as T;
    }

    return res.json();
}
