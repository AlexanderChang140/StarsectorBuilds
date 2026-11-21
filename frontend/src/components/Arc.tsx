import { PathBuilder } from '@/utils/pathBuilder';

interface ArcProps {
    radius: number;
    startAngle: number;
    endAngle: number;
    cx?: number;
    cy?: number;
    stroke?: string;
    strokeWidth?: number;
}

export default function Arc({
    radius,
    startAngle,
    endAngle,
    cx = radius,
    cy = radius,
    stroke = 'red',
    strokeWidth = 4,
}: ArcProps) {
    const padding = strokeWidth / 2;
    const size = radius * 2;
    const attributes = describeArc(
        radius,
        radius,
        radius,
        startAngle,
        endAngle,
    );

    const viewBoxX = cx - radius - padding;
    const viewBoxY = cy - radius - padding;
    const viewBoxSize = size + padding * 2;

    return (
        <svg
            width={viewBoxSize}
            height={viewBoxSize}
            viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxSize} ${viewBoxSize}`}
        >
            <path
                d={attributes}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
            />
        </svg>
    );
}

function describeArc(
    cx: number,
    cy: number,
    r: number,
    startAngle: number,
    endAngle: number,
) {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    if (endAngle - startAngle >= 360) {
        return new PathBuilder()
            .moveTo(cx + r, cy)
            .arcTo(r, 1, 0, cx - r, cy)
            .arcTo(r, 1, 0, cx + r, cy)
            .lineTo(cx, cy)
            .closePath()
            .build();
    }

    return new PathBuilder()
        .moveTo(start.x, start.y)
        .arcTo(r, largeArcFlag, 0, end.x, end.y)
        .lineTo(cx, cy)
        .closePath()
        .build();
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    return {
        x: cx + r * Math.cos(angleRad),
        y: cy + r * Math.sin(angleRad),
    };
}
