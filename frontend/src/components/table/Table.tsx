import { useState } from 'react';
import TableBody from './TableBody';
import TableHead from './TableHead';
import type { SortOrder } from '../../types/generic';
import './Table.css';

type TableProps<T> = {
    columns: {
        label: string;
        accessor: keyof T;
        sortable: boolean;
        sortByOrder: SortOrder;
    }[];
    initialData: T[];
    initialSort?: { sortField: keyof T; sortOrder: SortOrder };
    links?: Partial<Record<keyof T, (row: T) => string>>;
};

export default function Table<T>({
    columns,
    initialData,
    initialSort,
    links,
}: TableProps<T>) {
    const [data, setData] = useState<T[]>(() => {
        if (initialSort?.sortField) {
            const { sortField, sortOrder } = initialSort;
            return sort(initialData, sortField, sortOrder);
        }
        return initialData;
    });

    const handleSorting = makeHandleSort(data, setData);

    return (
        <div className="table-container">
            <table>
                <TableHead
                    columns={columns}
                    handleSorting={handleSorting}
                    initalSort={initialSort}
                />
                <TableBody columns={columns} data={data} links={links} />
            </table>
        </div>
    );
}

function makeHandleSort<T>(
    data: T[],
    setData: React.Dispatch<React.SetStateAction<T[]>>,
) {
    return (sortField: keyof T | null, sortOrder: string) => {
        if (sortField == null) return;
        const sorted = sort(data, sortField, sortOrder);
        setData(sorted);
    };
}

function sort<T>(data: T[], sortField: keyof T, sortOrder: string): T[] {
    const dir = sortOrder === 'DESC' ? -1 : 1;
    return [...data].sort((a, b) => {
        return comp(a[sortField], b[sortField], dir);
    });
}

function comp(x: unknown, y: unknown, dir: number): number {
    if (x == null && y == null) return 0;
    if (x == null) return 1;
    if (y == null) return -1;

    return helper(x, y) * dir;
}

function helper(x: unknown, y: unknown): number {
    if (typeof x === 'number' && typeof y === 'number') return x - y;

    if (typeof x === 'string' && typeof y === 'string')
        return x.localeCompare(y);

    if (typeof x === 'boolean' && typeof y === 'boolean') {
        return x === y ? 0 : x ? 1 : -1;
    }

    return String(x).localeCompare(String(y));
}
