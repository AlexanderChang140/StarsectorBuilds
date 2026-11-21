import { useEffect, useRef, useState } from 'react';

import usePreventContextMenu from '@/hooks/usePreventContextMenu';
import WeaponSlots, {
    type ShipBuilderSlotsProps,
} from '@/modules/builds/components/canvas/WeaponSlots';
import { imageUrl } from '@/utils/assets';
import { clamp } from '@/utils/math';

import styles from './ShipCanvas.module.css';
import { useImageSize } from '../../hooks/useImageSize';

interface ShipBuilderProps {
    src: string;
    slotsProps: ShipBuilderSlotsProps;
}

export const DEFAULT_SHIP_SCALE = 1.5;

export function ShipCanvas({ src, slotsProps }: ShipBuilderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(DEFAULT_SHIP_SCALE);

    const { imgRef, imgSize } = useImageSize();

    useEffect(() => {
        const element = containerRef.current;
        const minZoom = 1;
        const maxZoom = 1.5;
        const speed = 0.001;

        if (!element) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const delta = -e.deltaY * speed;
            setScale((prev) => {
                const newScale = prev + delta;
                return clamp(newScale, minZoom, maxZoom);
            });
        };

        element.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            element.removeEventListener('wheel', handleWheel);
        };
    }, [containerRef]);

    usePreventContextMenu(containerRef);

    return (
        <div
            className={styles.wrapper}
            style={{
                width: imgSize.displayWidth,
                height: imgSize.displayHeight,
                scale,
            }}
            ref={containerRef}
        >
            <img
                className={styles.img}
                ref={imgRef}
                src={imageUrl(src)}
                alt="Ship"
                draggable="false"
            />
            <WeaponSlots
                imgSize={imgSize}
                containerRef={containerRef}
                props={slotsProps}
            ></WeaponSlots>
        </div>
    );
}
