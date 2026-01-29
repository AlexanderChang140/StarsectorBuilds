export default async function fetchSafe<T>(
    url: string,
    msg?: string,
): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) {
        const err = msg ?? `Failed to fetch item: ${res.status}`;
        throw new Error(err);
    }
    return res.json();
}
