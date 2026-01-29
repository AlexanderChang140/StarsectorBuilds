import { useRef, useState, useEffect } from 'react';

export type Size = {
    width: number;
    height: number;
};

export function useElementSize<T extends HTMLElement>() {
    const ref = useRef<T>(null);
    const [size, setSize] = useState<Size>({ width: 0, height: 0 });

    useEffect(() => {
        if (!ref.current) return;
        const observer = new ResizeObserver(([entry]) =>
            setSize(entry.contentRect),
        );
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return [ref, size] as const;
}
