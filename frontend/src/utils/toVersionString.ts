export default function toVersionString(
    major: number,
    minor: number,
    patch: string,
) {
    return `${major}.${minor}.${patch}`;
}
