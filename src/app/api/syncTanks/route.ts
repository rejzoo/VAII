import { supabase } from "../../../../lib/initSupabase";
import { Tank } from "@/types/tank";

export async function POST() {
    try {
        const apiUrl = `https://api.worldoftanks.eu/wot/encyclopedia/vehicles/?application_id=${process.env.WARGAMING_API_KEY}`;
        const apiResponse = await fetch(apiUrl);
    
        if (!apiResponse.ok) {
            throw new Error(`Failed to fetch data from API: ${apiResponse.statusText}`);
        }
    
        const jsonResponse = await apiResponse.json();
    
        if (!jsonResponse.data) {
            throw new Error('No tank data found in API response.');
        }
    
        const tanks = Object.values(jsonResponse.data) as Tank[];
    
        const tanksData = tanks.map((tank: Tank) => ({
            tank_id: tank.tank_id,
            name: tank.name,
            type: tank.type,
            nation: tank.nation,
            tier: tank.tier,
            description: tank.description,
            is_premium: tank.is_premium,
            price_credit: tank.price_credit,
            price_gold: tank.price_gold
        }));
    
        const { data, error } = await supabase
            .from('TankList')
            .upsert(tanksData, { onConflict: 'tank_id' });
    
        if (error) {
            return new Response(
                JSON.stringify({ success: false, error: error.message }),
                { status: 500 }
            );
        }

        const currentDate = new Date();
        const date = currentDate.toISOString().split('T')[0];
        const time = currentDate.toTimeString().split(' ')[0];

        const { error: insertError } = await supabase
            .from('TankListUpdateDates')
            .insert([{ date, time }]);

        if (insertError) {
            return new Response(
                JSON.stringify({ success: false, error: insertError.message }),
                { status: 500 }
            );
        }
    
        return new Response(JSON.stringify({ success: true, data }), { status: 200 });
    } catch (err) {
        return new Response(
            JSON.stringify({
                success: false,
                error: (err as Error).message || 'Unexpected error occurred'
            }),
            { status: 500 }
        );
    }
};