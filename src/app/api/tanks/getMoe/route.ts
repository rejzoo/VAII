import { TankMoe } from "@/types/types";
import { createClient } from '@/app/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    const apiUrls = {
        65: "https://api.worldoftanks.eu/wot/tanks/mastery/?application_id=67ea591cc3a72e6e7aa43d66b852a3cd&distribution=damage&percentile=65",
        85: "https://api.worldoftanks.eu/wot/tanks/mastery/?application_id=67ea591cc3a72e6e7aa43d66b852a3cd&distribution=damage&percentile=85",
        95: "https://api.worldoftanks.eu/wot/tanks/mastery/?application_id=67ea591cc3a72e6e7aa43d66b852a3cd&distribution=damage&percentile=95"
    };

    const supabase = await createClient();

    try {
        const responses = await Promise.all(
            Object.entries(apiUrls).map(async ([percentile, url]) => {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch data for percentile ${percentile}: ${response.statusText}`);
                }
                const jsonResponse = await response.json();
                if (!jsonResponse.data || !jsonResponse.data.distribution) {
                    throw new Error(`No data found for percentile ${percentile}`);
                }
                return { percentile: Number(percentile), data: jsonResponse.data.distribution };
            })
        );

        const tankDataMap: { [tankId: number]: Partial<TankMoe> } = {};

        //console.log(responses);

        responses.forEach(({ percentile, data }) => {
            Object.entries(data).forEach(([tankId, dataValues]) => {
                const value = Object.values(dataValues as { [percentile: string]: number })[0];
                const tankIdNum = Number(tankId);

                if (!tankDataMap[tankIdNum]) {
                    tankDataMap[tankIdNum] = { tank_id: tankIdNum } as Partial<TankMoe>;
                }

                if (percentile === 65) {
                    tankDataMap[tankIdNum].percentile1 = percentile;
                    tankDataMap[tankIdNum].value1 = value;
                } else if (percentile === 85) {
                    tankDataMap[tankIdNum].percentile2 = percentile;
                    tankDataMap[tankIdNum].value2 = value;
                } else if (percentile === 95) {
                    tankDataMap[tankIdNum].percentile3 = percentile;
                    tankDataMap[tankIdNum].value3 = value;
                }
            });
        });

        const combinedData: TankMoe[] = Object.values(tankDataMap) as TankMoe[];

        return new Response(JSON.stringify(combinedData), { status: 200 });
    } catch (err) {
        return new Response(
            JSON.stringify({
                success: false,
                error: (err as Error).message || "Unexpected error occurred",
            }),
            { status: 500 }
        );
    }
}