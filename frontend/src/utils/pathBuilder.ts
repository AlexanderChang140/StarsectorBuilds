export class PathBuilder {
    parts: string[] = [];

    moveTo(x: number, y: number) {
        this.parts.push(`M ${x} ${y}`);
        return this;
    }

    lineTo(x: number, y: number) {
        this.parts.push(`L ${x} ${y}`);
        return this;
    }

    arcTo(r: number, large: 0 | 1, sweep: 0 | 1, x: number, y: number) {
        this.parts.push(`A ${r} ${r} 0 ${large} ${sweep} ${x} ${y}`);
        return this;
    }

    closePath() {
        this.parts.push('Z');
        return this;
    }

    build() {
        return this.parts.join(' ');
    }
}

export function rect(
    r: number,
    pb: PathBuilder,
    cx: number = r,
    cy: number = cx,
) {
    return pb
        .moveTo(cx - r, cy - r)
        .lineTo(cx + r, cy - r)
        .lineTo(cx + r, cy + r)
        .lineTo(cx - r, cy + r)
        .closePath();
}

export function diamond(
    r: number,
    pb: PathBuilder,
    cx: number = r,
    cy: number = cx,
) {
    return pb
        .moveTo(cx, cy - r)
        .lineTo(cx + r, cy)
        .lineTo(cx, cy + r)
        .lineTo(cx - r, cy)
        .closePath();
}

export function circle(
    r: number,
    pb: PathBuilder,
    cx: number = r,
    cy: number = cx,
) {
    return pb
        .moveTo(cx, cy - r)
        .arcTo(r, 0, 1, cx + r, cy)
        .arcTo(r, 0, 1, cx, cy + r)
        .arcTo(r, 0, 1, cx - r, cy)
        .arcTo(r, 0, 1, cx, cy - r)
        .closePath();
}
