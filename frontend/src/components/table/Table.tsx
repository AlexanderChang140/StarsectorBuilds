import TableBody from '@/components/table/TableBody';
import TableHead from '@/components/table/TableHead';
import type { SortOrder } from '@/types/generic';

import '@/components/table/Table.css';

type TableProps<T> = {
    columns: {
        label: string;
        accessor: keyof T;
    }[];
    initialData: T[];
    links?: Partial<Record<keyof T, (row: T) => string>>;
    sort?: { field: keyof T; order: SortOrder };
    onSortChange: (accessor: keyof T, sortOrder: SortOrder) => void;
};

export default function Table<T>({
    columns,
    initialData,
    links,
    sort,
    onSortChange,
}: TableProps<T>) {
    const data = initialData;

    return (
        <div className="table-container">
            <table>
                <TableHead
                    columns={columns}
                    sort={sort}
                    onSortChange={onSortChange}
                />
                <TableBody columns={columns} data={data} links={links} />
            </table>
        </div>
    );
}
