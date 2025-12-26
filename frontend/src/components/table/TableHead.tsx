interface TableHeadProps<T> {
    columns: { label: string; accessor: keyof T }[];
}

export default function TableHead<T>({ columns }: TableHeadProps<T>) {
    return (
        <thead>
            <tr>
                {columns.map(({ label, accessor }) => {
                    return <th key={String(accessor)}>{label}</th>;
                })}
            </tr>
        </thead>
    );
}
