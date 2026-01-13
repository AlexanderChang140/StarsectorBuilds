export default function toVersionString<
    T extends { major: number; minor: number; patch: string },
>({ major, minor, patch }: T): string {
    return `${major}.${minor}.${patch}`;
}
