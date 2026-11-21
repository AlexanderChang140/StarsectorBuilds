import type { SlotSize, SlotType } from '@/types/ship';
import { circle, diamond, PathBuilder, rect } from '@/utils/pathBuilder';

interface SlotIconProps {
    type: SlotType;
    size: SlotSize;
    color: string;
}

const RING_SIZES = {
    small: 10,
    medium: 17,
    large: 24,
};

export function SlotIcon({ type, size, color }: SlotIconProps) {
    const stroke = color;
    const strokeWidth = 1.5;
    const padding = strokeWidth / 2 + 1;
    const viewBoxX = -padding;
    const viewBoxY = -padding;
    const viewBoxSize = RING_SIZES[size] * 2 + padding * 2;
    const physicalSize = (RING_SIZES[size] * 2) + padding * 2;

    return (
        <svg
            width={physicalSize}
            height={physicalSize}
            viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxSize} ${viewBoxSize}`}
        >
            <path
                d={drawShape(type, size).build()}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
            />
        </svg>
    );
}

const SHAPE_FUNCTIONS: Partial<
    Record<
        SlotType,
        (r: number, pb: PathBuilder, cx?: number, cy?: number) => PathBuilder
    >
> = {
    ballistic: rect,
    energy: circle,
    missile: diamond,
    hybrid: rect,
    synergy: diamond,
};

const SHAPE1 = new Set<SlotType>(['ballistic', 'energy', 'missile']);
const SHAPE2 = new Set<SlotType>(['hybrid', 'synergy']);

const RING_NUMS = {
    small: 1,
    medium: 2,
    large: 3,
};

function drawShape(
    type: SlotType,
    size: SlotSize,
    pathBuilder: PathBuilder = new PathBuilder(),
) {
    const center = RING_SIZES[size];

    if (SHAPE1.has(type)) {
        const rings = Object.values(RING_SIZES).sort((a, b) => a - b);
        for (let i = 0; i < RING_NUMS[size]; i++) {
            SHAPE_FUNCTIONS[type]!(rings[i], pathBuilder, center);
        }
    } else if (SHAPE2.has(type)) {
        circle(RING_SIZES[size], pathBuilder);
        SHAPE_FUNCTIONS[type]!(RING_SIZES[size] - 2, pathBuilder, center);
    } else {
        Object.values(SHAPE_FUNCTIONS).forEach((fn) =>
            fn(RING_SIZES[size], pathBuilder, center),
        );
    }
    return pathBuilder;
}
