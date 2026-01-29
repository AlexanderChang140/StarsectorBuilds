import { Link } from 'react-router';

interface TableBodyProps<T> {
    columns: { label: string; accessor: keyof T }[];
    data: T[];
    links?: Partial<Record<keyof T, (row: T) => string>>;
}

export default function TableBody<T>({
    columns,
    data,
    links,
}: TableBodyProps<T>) {
    return (
        <tbody>
            {data.map((entry, i) => {
                return (
                    <tr key={i}>
                        {columns.map(({ accessor }) => {
                            const value = entry[accessor];
                            const tData = value != null ? String(value) : '---';
                            return (
                                <td key={String(accessor)}>
                                    {links?.[accessor] ? (
                                        <Link
                                            to={links[accessor](entry)}
                                        >
                                            {tData}
                                        </Link>
                                    ) : (
                                        tData
                                    )}
                                </td>
                            );
                        })}
                    </tr>
                );
            })}
        </tbody>
    );
}
