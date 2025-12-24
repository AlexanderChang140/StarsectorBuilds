import type { WeaponVersionDTO } from '@shared/weapons/types';
import { useParams } from 'react-router';

import useFetch from '../../../hooks/useFetch';
import '../../../components/Display.css';
import { parseIntOrNaN } from '../../../utils/parse';

export default function WeaponDisplay() {
    const { id } = useParams<{ id: string }>();
    const parsedId = parseIntOrNaN(id);
    const { data, loading, error } = useFetch<WeaponVersionDTO[]>(
        `/api/weapons/${parsedId}/versions`,
    );
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (data === undefined || data === null || data.length === 0)
        return <div>No data found</div>;

    return (
        <div>
            <div className="display">
                <div className="title">
                    <h1>{data[0].display_name}</h1>
                    <hr></hr>
                </div>
                <div className="body">
                    <p>{data[0].text1}</p>
                    <p>{data[0].text2}</p>
                </div>
                <div className="profile">
                    <div className="name">
                        <h3>{data[0].display_name}</h3>
                    </div>
                    <div className="image-container">
                        <img
                            className="base"
                            src={`${import.meta.env.VITE_API_URL}/images/${
                                data[0].turret_image_file_path
                            }`}
                        ></img>
                        <img
                            className="overlay"
                            src={`${import.meta.env.VITE_API_URL}/images/${
                                data[0].turret_gun_image_file_path
                            }`}
                        ></img>
                    </div>
                    <div className="stats">Stats</div>
                </div>
            </div>
        </div>
    );
}
