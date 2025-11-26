import { useState } from 'react';

import type { SortOrder } from '../../types/generic';

interface TableHeadProps<T> {
    columns: { label: string; accessor: keyof T }[];
    handleSorting: (sortField: keyof T, sortOrder: SortOrder) => void;
    initalSort?: { sortField: keyof T; sortOrder: SortOrder };
}

export default function TableHead<T>({
    columns,
    handleSorting,
    initalSort,
}: TableHeadProps<T>) {
    const [sortField, setSortField] = useState<keyof T | null>(
        initalSort?.sortField ?? null,
    );
    const [order, setOrder] = useState(initalSort?.sortOrder);

    const handleSortingChange = (accessor: keyof T) => {
        const sortOrder =
            accessor === sortField && order === 'ASC' ? 'DESC' : 'ASC';
        setSortField(accessor);
        setOrder(sortOrder);
        handleSorting(accessor, sortOrder);
    };

    return (
        <thead>
            <tr>
                {columns.map(({ label, accessor }) => {
                    return (
                        <th
                            key={String(accessor)}
                            onClick={() => handleSortingChange(accessor)}
                        >
                            {label}
                            {sortField === accessor
                                ? order === 'ASC'
                                    ? ' ↑'
                                    : ' ↓'
                                : null}
                        </th>
                    );
                })}
            </tr>
        </thead>
    );
}
