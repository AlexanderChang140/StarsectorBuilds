import { useEffect, useRef, useState } from 'react';

import type { ImageSize } from '../types';

export function useImageSize() {
    const imgRef = useRef<HTMLImageElement>(null);
    const [imgSize, setImgSize] = useState<ImageSize>({
        naturalWidth: 0,
        naturalHeight: 0,
        displayWidth: 0,
        displayHeight: 0,
    });

    useEffect(() => {
        if (!imgRef.current) return;

        const observer = new ResizeObserver(() => {
            setImgSize({
                naturalWidth: imgRef.current?.naturalWidth ?? 0,
                naturalHeight: imgRef.current?.naturalHeight ?? 0,
                displayWidth: imgRef.current?.clientWidth ?? 0,
                displayHeight: imgRef.current?.clientHeight ?? 0,
            });
        });

        observer.observe(imgRef.current);

        return () => observer.disconnect();
    }, [imgRef]);

    return { imgRef, imgSize };
}
