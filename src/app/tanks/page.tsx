'use client'

import { useEffect, useState } from 'react';
import TankTableItem from "../components/TankTableItem";
import { Tank } from '@/types/tank';
import { SearchBarTanks } from '../components/ui/SearchBar';


export default function TankList() {
    const [tanks, setTanks] = useState<Tank[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        const fetchTanks = async () => {
            try {
                console.log("PAGE FETCH");
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

        fetchTanks();
    }, []);

    // found on the internet
    // case-insensitive filtering that also supports special characters
    const filteredTanks = tanks.filter((tank) =>
            tank.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(
            searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        )
    );

    if (loading) {
        return <p className="text-center">Loading data...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">Error: {error}</p>;
    }
    //console.log(tanks);
    return (
        <>
            <div className="m-5 bg-gray-700 rounded-lg p-5 mx-auto">
                <SearchBarTanks value={ searchQuery } onChange={ (e) => setSearchQuery(e.target.value) } />
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