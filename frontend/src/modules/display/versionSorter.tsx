import { multiSort } from '@/utils/sort';

export function sortVersions<
    TValueKey extends keyof TRows,
    TRows extends {
        major: number;
        minor: number;
        patch: string;
    } & Record<TValueKey, number | null>,
>(rows: TRows[] | undefined, idKey: TValueKey) {
    return rows
        ?.sort(
            multiSort<TRows>(
                ['major', 'minor', 'patch'],
                ['DESC', 'DESC', 'DESC'],
            ),
        )
        .map((row) => (
            <option value={row[idKey] ?? undefined}>
                {row.major}.{row.minor}.{row.patch}
            </option>
        ));
}
