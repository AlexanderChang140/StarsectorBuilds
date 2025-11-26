import useFetch from '../../../hooks/useFetch';
import Table from '../../../components/table/Table';

export default function ShipList() {
    const { data, loading, error } = useFetch<Record<string, unknown>[]>(
        '/api/database/ships',
    );
    // TODO: no error message in production
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!data || data.length === 0) return <div>No data found</div>;

    const headers = Object.keys(data[0]);
    const columns = headers.map((key) => {
        return { label: key, accessor: key };
    });

    return (
        <div>
            <h1>Ships</h1>
            {data.length} ships found
            <Table columns={columns} initialData={data} />
        </div>
    );
}
