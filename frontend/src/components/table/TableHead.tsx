import type { SortOrder } from '@/types/generic';

interface TableHeadProps<T> {
    columns: { label: string; accessor: keyof T }[];
    sort?: { field: keyof T; order: SortOrder };
    onSortChange: (field: keyof T, order: SortOrder) => void;
}

export default function TableHead<T>({
    columns,
    sort,
    onSortChange,
}: TableHeadProps<T>) {
    const handleSortingChange = (accessor: keyof T) => {
        const sortOrder =
            accessor === sort?.field && sort?.order === 'ASC' ? 'DESC' : 'ASC';
        onSortChange(accessor, sortOrder);
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
                            {sort?.field === accessor
                                ? sort?.order === 'ASC'
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
