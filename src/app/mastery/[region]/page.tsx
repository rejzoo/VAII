
'use client';

import TankTableItemMasteryMoe from "@/app/components/TankTableItemMasteryMoe";
import LoadingComponent from "@/app/components/ui/LoadingComponent";
import TankFilterMenu from "@/app/components/ui/TankFilterMenu";
import { Tank, TankMoe } from "@/types/types";
import { useEffect, useState } from "react";

export default function Mastery( {params}: {params : {region: string}} ) {
    const [error, setError] = useState<string | null>(null);
    const [moeData, setMoeData] = useState<TankMoe[] | null>(null);
    const [tankList, setTankList] = useState<Tank[]>([]);
    const [loadingMoeData, setLoadingMoeData] = useState(true);
    const [loadingTankList, setLoadingTankList] = useState(true);

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedNations, setSelectedNations] = useState<string[]>([]);
    const [selectedTiers, setSelectedTiers] = useState<number[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

    useEffect(() => {
        const fetchMoeData = async () => {
            try {
                const response = await fetch("../api/tanks/getMastery", {
                    method: "GET",
                });

                const result = await response.json();
                console.log("MOE Data:", result);
                setMoeData(result);
                setLoadingMoeData(false);

                if (!response.ok || !result.success) {
                    throw new Error("Invalid MOE data response");
                }
            } catch (err) {
                setError((err as Error).message || "Unexpected error occurred");
            }
        };

        const fetchTankList = async () => {
            try {
                const response = await fetch("../api/tanks/getTanks", {
                    method: "GET",
                });

                const result = await response.json();
                console.log("Tank List Data:", result);

                if (response.ok && result.success && Array.isArray(result.data)) {
                    setTankList(result.data);
                    setLoadingTankList(false);
                } else {
                    throw new Error("Invalid tank list data response");
                }
            } catch (err) {
                setError((err as Error).message || "Unexpected error occurred");
            }
        };

        fetchMoeData();
        fetchTankList();
    }, []);
    
    if (loadingMoeData || loadingTankList) {
        return <LoadingComponent message="Loading data..." />;
    }

    if (!moeData || moeData.length === 0) {
        return;
    }

    if (!tankList || tankList.length === 0) {
        return;
    }

    const combinedData = moeData
        .filter(tankMoe => tankList.some(tank => tank.tank_id === tankMoe.tank_id))
        .map((tankMoe) => {
        const matchingTank = tankList.find((tank) => tank.tank_id === tankMoe.tank_id);
        return {
            ...tankMoe,
            ...matchingTank,
        };
    });

    const filteredTanks = combinedData.filter((tank) =>
        tank.name!.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(
            searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        ) &&
        (selectedNations.length > 0 ? selectedNations.includes(tank.nation!) : true) &&
        (selectedTiers.length > 0 ? selectedTiers.includes(tank.tier!) : true) &&
        (selectedTypes.length > 0 ? selectedTypes.includes(tank.type!) : true)
    );

    const uniqueNations = Array.from(new Set(tankList.map((tank) => tank.nation)));
    const uniqueTypes = Array.from(new Set(tankList.map((tank) => tank.type)));

    // Function to toggle tier selection
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

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6 text-center text-white">Mastery Page</h1>

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
            />
                        
            <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md">
                <table className="min-w-full border-collapse border border-gray-700">
                    <thead className="bg-gray-800 text-white text-xl">
                        <tr>
                            <th className="px-4 py-2 text-left">Nation</th>
                            <th className="px-4 py-2 text-left">Type</th>
                            <th className="px-4 py-2 text-left">Tier</th>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">3</th>
                            <th className="px-4 py-2 text-left">2</th>
                            <th className="px-4 py-2 text-left">1</th>
                            <th className="px-4 py-2 text-left">M</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTanks
                            .map((tank, index) => (
                                <TankTableItemMasteryMoe
                                    key={index}
                                    index={index}
                                    nation={tank.nation!}
                                    type={tank.type!}
                                    tier={tank.tier!}
                                    name={tank.name!}
                                    value1={tank.value1}
                                    value2={tank.value2}
                                    value3={tank.value3}
                                    value4={tank.value4}
                                />
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}