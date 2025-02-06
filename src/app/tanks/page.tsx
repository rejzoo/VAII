'use client'

import { useEffect, useState } from 'react';
import TankTableItem from "../components/TankTableItem";
import { Tank } from '@/types/types';
import { useAuth } from '../../context/AuthContext';
import LoadingComponent from '../components/ui/LoadingComponent';
import TankFilterMenu from '../components/ui/TankFilterMenu';

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

    // Function to toggle selection
    const toggleSelection = (setSelectedList: any, value: any) => {
        setSelectedList((prev: any[]) => 
            prev.includes(value) ? prev.filter((item: any) => item !== value) : [...prev, value]
        );
    };

    const resetFilters = () => {
        setSelectedTiers([]);
        setSelectedNations([]);
        setSelectedTypes([]);
    };

    const toggleFavourite = () => {
        setShowFavorites(!showFavorites);
    }

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

    return (
        <>
            <TankFilterMenu
                selectedTiers={selectedTiers}
                setSelectedTiers={setSelectedTiers}
                selectedNations={selectedNations}
                setSelectedNations={setSelectedNations}
                selectedTypes={selectedTypes}
                setSelectedTypes={setSelectedTypes}
                uniqueNations={uniqueNations}
                uniqueTypes={uniqueTypes}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                toggleSelection={toggleSelection}
                resetFilters={resetFilters}
                numberOfTanks={filteredTanks.length}
                toggleFavourite={toggleFavourite}
                tankList={true}
            />

            <div className="flex justify-center">
                <div className="p-4 bg-gradient-to-b to-indigo-700 from-purple-800 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 gap-x-15">
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
            </div>
        </>
    );
}