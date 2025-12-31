import TableBody from '@/components/table/TableBody';
import TableHead from '@/components/table/TableHead';
import type { SortOrder } from '@/types/generic';

import '@/components/table/Table.css';

type TableProps<T> = {
    columns: {
        label: string;
        accessor: keyof T;
        sortable: boolean;
        sortByOrder: SortOrder | undefined;
    }[];
    initialData: T[];
    links?: Partial<Record<keyof T, (row: T) => string>>;
};

export default function Table<T>({
    columns,
    initialData,
    links,
}: TableProps<T>) {
    const data = initialData;

    return (
        <div className="table-container">
            <table>
                <TableHead columns={columns} />
                <TableBody columns={columns} data={data} links={links} />
            </table>
        </div>
    );
}
