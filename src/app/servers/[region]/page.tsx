'use client';

import { useEffect, useState } from "react";
import PieChart from "../../components/PieChart";
import LoadingComponent from "@/app/components/ui/LoadingComponent";

export default function Server() {
    const [error, setError] = useState<string | null>(null);
    const [serverData, setServerData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTanks = async () => {
            try {
                const response = await fetch('../api/server', {
                    method: 'GET',
                });

                const result = await response.json();
                setServerData(result);

                if (!response.ok || !result.success) {
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

    if (loading) {
        return <LoadingComponent message="Loading data..." />;
    }


    const euData = serverData.filter((item: any) => item && item.region === 'EU');
    const naData = serverData.filter((item: any) => item && item.region === 'NA');
    const asiaData = serverData.filter((item: any) => item && item.region === 'ASIA');

    return (
        <div className="p-4 sm:p-6 md:p-4 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            <PieChart region="EU" data={euData} />
            <PieChart region="NA" data={naData} />
            <PieChart region="ASIA" data={asiaData} />
        </div>
    );
}
