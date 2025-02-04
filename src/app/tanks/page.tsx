'use client'

import { useEffect, useState } from 'react';
import TankTableItem from "../components/TankTableItem";
import { Tank } from '@/types/types';
import { SearchBarTanks } from '../components/ui/SearchBar';
import { useAuth } from '../../context/AuthContext';
import LoadingComponent from '../components/ui/LoadingComponent';

export default function TankList() {
    const [tanks, setTanks] = useState<Tank[]>([]);
    const [favoriteTanks, setFavoriteTanks] = useState<Tank[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loadingState, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showFavorites, setShowFavorites] = useState<boolean>(false);
    const { isLoggedIn, loading } = useAuth();

    useEffect(() => {
        const fetchTanks = async () => {
            try {
                const response = await fetch('../api/tanks/getTanks', {
                    method: 'GET',
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    setTanks(result.data);
                } else {
                    setError(result.error || 'Failed to fetch tanks data');
                }
            } catch (err) {
                setError((err as Error).message || 'Unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        const fetchFavoriteTanks = async () => {
            try {
                const response = await fetch('../api/tanks/getFavTanks', {
                    method: 'GET',
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    const flatData = result.data.flatMap((item: { TankList: Tank[] }) => item.TankList);
                    setFavoriteTanks(flatData);
                }
            } catch (err) {
                setError((err as Error).message || 'Unexpected error occurred');
            }
        };

        fetchTanks();
        fetchFavoriteTanks();
    }, []);

    // found on the internet
    // case-insensitive filtering that also supports special characters
    const filteredTanks = ( showFavorites ? favoriteTanks : tanks ).filter((tank) =>
            tank.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(
            searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        )
    );

    if (loadingState) {
        return <LoadingComponent message="Loading data..." />;
    }

    if (error) {
        return <p className="text-center text-red-500">Error: {error}</p>;
    }
    console.log(isLoggedIn);
    return (
        <>
            <div className="m-5 bg-gray-700 rounded-lg p-5 mx-auto">
                <SearchBarTanks value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                {isLoggedIn && (
                <div className="flex justify-end mt-3">
                    <button
                        onClick={() => setShowFavorites(!showFavorites)}
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
                    >
                        {showFavorites ? "Show All Tanks" : "Show Favorite Tanks"}
                    </button>
                </div> )}
            </div>

            <div className="flex justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-7 gap-2">
                    {filteredTanks.map((tank, index) => (
                        <TankTableItem
                            key={index}
                            tankID={tank.tank_id}
                            nation={tank.nation}
                            typeIcon={tank.type}
                            name={tank.name}
                            link={tank.name}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}