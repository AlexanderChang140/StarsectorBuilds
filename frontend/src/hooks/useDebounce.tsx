import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay = 300): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timeout);
        };
    }, [value, delay]);

    return debouncedValue;
}

export function debounce<T extends []>(
    cb: (...args: T) => void,
    delay: number,
) {
    let timeout: NodeJS.Timeout;
    return (...args: T) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            cb(...args);
        }, delay);
    };
}
