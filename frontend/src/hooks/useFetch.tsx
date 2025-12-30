import { useState, useEffect } from 'react';

export default function useFetch<T>(url: string | null, options?: RequestInit) {
    const [data, setData] = useState<T | null | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!url) {
            setData(undefined);
            setLoading(false);
            setError(null);
            return;
        }

        const controller = new AbortController();

        setLoading(true);
        setError(null);

        fetch(url, { ...options, signal: controller.signal })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
                return res.json();
            })
            .then(setData)
            .catch((err) => {
                if (err.name !== 'AbortError') {
                    setError(err);
                    console.error(err);
                }
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [url, options]);

    return { data, loading, error };
}
