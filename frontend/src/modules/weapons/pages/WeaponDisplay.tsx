import { useParams } from 'react-router';

import type { DisplayWeapon } from '../types';
import useFetch from '../../../hooks/useFetch';
import '../../../components/Display.css';

export default function WeaponDisplay() {
    const { id } = useParams<{ id: string }>();
    const { data, loading, error } = useFetch<DisplayWeapon[]>(
        `/api/weapons/${id}`,
    );
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!data || data.length === 0) return <div>No data found</div>;

    console.log(
        `${import.meta.env.VITE_API_URL}/api/images/${
            data[0].turret_image_file_path
        }`,
    );

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
                            src={`${import.meta.env.VITE_API_URL}/api/images/${
                                data[0].turret_image_file_path
                            }`}
                        ></img>
                        <img
                            className="overlay"
                            src={`${import.meta.env.VITE_API_URL}/api/images/${
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
