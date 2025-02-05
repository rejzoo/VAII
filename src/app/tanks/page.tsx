'use client'

import { useEffect, useState } from 'react';
import TankTableItem from "../components/TankTableItem";
import { Tank } from '@/types/types';
import { SearchBarTanks } from '../components/ui/SearchBar';
import { useAuth } from '../../context/AuthContext';
import LoadingComponent from '../components/ui/LoadingComponent';
import Image from 'next/image';

export default function TankList() {
    const [tanks, setTanks] = useState<Tank[]>([]);
    const [favoriteTanks, setFavoriteTanks] = useState<Tank[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loadingState, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showFavorites, setShowFavorites] = useState<boolean>(false);
    const { isLoggedIn, loading } = useAuth();

    const [selectedNations, setSelectedNations] = useState<string[]>([]);
    const [selectedTiers, setSelectedTiers] = useState<number[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

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

    const uniqueNations = Array.from(new Set(tanks.map((tank) => tank.nation)));
    const uniqueTypes = Array.from(new Set(tanks.map((tank) => tank.type)));

    // Function to toggle tier selection
    const toggleSelection = (setSelectedList: any, value: any) => {
        setSelectedList((prev: any[]) => 
            prev.includes(value) ? prev.filter((item: any) => item !== value) : [...prev, value]
        );
    };

    // found on the internet
    // case-insensitive filtering that also supports special characters
    const filteredTanks = (showFavorites ? favoriteTanks : tanks).filter((tank) =>
        tank.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(
            searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        ) &&
        (selectedNations.length > 0 ? selectedNations.includes(tank.nation) : true) &&
        (selectedTiers.length > 0 ? selectedTiers.includes(tank.tier) : true) &&
        (selectedTypes.length > 0 ? selectedTypes.includes(tank.type) : true)
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
                <div className="flex flex-wrap gap-2 mt-4">
                    <h3 className="text-white font-bold w-full">Tier</h3>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((tier) => (
                        <button
                        key={tier}
                        className={`px-3 py-2 rounded-lg w-10 h-10 ${
                            selectedTiers.includes(tier) ? 'bg-blue-500 text-white' : 'bg-gray-500 text-gray-200'
                        }`}
                        onClick={() => toggleSelection(setSelectedTiers, tier)}
                        >
                            {tier}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                    <h3 className="text-white font-bold w-full">Nation</h3>
                    {uniqueNations.map((nation) => (
                        <button
                        key={nation}
                        className={`px-3 py-2 rounded-lg ${
                            selectedNations.includes(nation) ? 'bg-blue-500 text-white' : 'bg-gray-500 text-gray-200'
                        }`}
                        onClick={() => toggleSelection(setSelectedNations, nation)}
                        >
                            <Image
                                src={`/nation/icon-${nation}.png`}
                                alt={nation}
                                width={30}
                                height={30}
                                className="object-contain"
                            />
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                    <h3 className="text-white font-bold w-full">Type</h3>
                    {uniqueTypes.map((type) => (
                        <button
                        key={type}
                        className={`px-3 py-2 rounded-lg ${
                            selectedTypes.includes(type) ? 'bg-blue-500 text-white' : 'bg-gray-500 text-gray-200'
                        }`}
                        onClick={() => toggleSelection(setSelectedTypes, type)}
                        >
                            <Image
                                src={`/type/${type}.png`}
                                alt={type}
                                width={18}
                                height={18}
                                className="object-contain"
                            />
                        </button>
                    ))}
                </div>
                
                <div className='mt-6 flex flex-row justify-between'>
                    <SearchBarTanks value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

                    <button
                        className="w-40 h-10 flex items-center justify-center rounded-lg text-lg font-bold bg-red-600 text-white hover:bg-red-800"
                        onClick={() => {
                            setSelectedTiers([]);
                            setSelectedNations([]);
                            setSelectedTypes([]);
                        }}
                    >
                        Reset Filters
                    </button>
                </div>

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