'use client';

import TankTableItemMasteryMoe from "@/app/components/TankTableItemMasteryMoe";
import LoadingComponent from "@/app/components/ui/LoadingComponent";
import { Tank, TankMoe } from "@/types/types";
import { useEffect, useState } from "react";

export default function Moe({ params }: { params: { region: string } }) {
    const [error, setError] = useState<string | null>(null);
    const [moeData, setMoeData] = useState<TankMoe[] | null>(null);
    const [tankList, setTankList] = useState<Tank[]>([]);
    const [loadingMoeData, setLoadingMoeData] = useState(true);
    const [loadingTankList, setLoadingTankList] = useState(true);

    useEffect(() => {
        const fetchMoeData = async () => {
            try {
                const response = await fetch("../api/tanks/getMoe", {
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

    const combinedData = moeData.map((tankMoe) => {
        const matchingTank = tankList.find((tank) => tank.tank_id === tankMoe.tank_id);
        return {
            ...tankMoe,
            ...matchingTank,
        };
    });

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6 text-center text-white">MOE Page</h1>
            <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md">
                <table className="min-w-full border-collapse border border-gray-700">
                    <thead className="bg-gray-800 text-white text-xl">
                        <tr>
                            <th className="px-4 py-2 text-left">Nation</th>
                            <th className="px-4 py-2 text-left">Type</th>
                            <th className="px-4 py-2 text-left">Tier</th>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">65%</th>
                            <th className="px-4 py-2 text-left">85%</th>
                            <th className="px-4 py-2 text-left">95%</th>
                            <th className="px-4 py-2 text-left">100%</th>
                        </tr>
                    </thead>
                    <tbody>
                        {combinedData
                            .filter((tank) => tank.tier! >= 5)
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
