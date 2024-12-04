import { Tank, TankImages } from "@/types/tank";
import { createClient } from "@/app/utils/supabase/server";

export async function POST() {
    const supabase = await createClient();

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
        const images = Object.values(jsonResponse.data) as TankImages[];
    
        const tanksData = tanks.map((tank: Tank) => ({
            tank_id: tank.tank_id,
            name: tank.name,
            type: tank.type,
            nation: tank.nation,
            tier: tank.tier,
            description: tank.description,
            is_premium: tank.is_premium,
            price_credit: tank.price_credit,
            price_gold: tank.price_gold,
        }));

        const tanksImagesData = images.map((image: TankImages) => ({
            tank_id: image.tank_id,
            big_icon: image.images.big_icon,
            small_icon: image.images.small_icon,
            contour_icon: image.images.contour_icon,
        }));
    
        const { data: tankListData, error: tankListError } = await supabase
            .from('TankList')
            .upsert(tanksData, { onConflict: 'tank_id' });
    
        if (tankListError) {
            return new Response(
                JSON.stringify({ success: false, error: tankListError.message }),
                { status: 500 }
            );
        }

        const { data: tankImagesData, error: tankImagesError } = await supabase
            .from('TankImages')
            .upsert(tanksImagesData, { onConflict: 'tank_id' });

        if (tankImagesError) {
            return new Response(
                JSON.stringify({ success: false, error: tankImagesError.message }),
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
    
        return new Response(JSON.stringify({ success: true, tankListData, tankImagesData }), { status: 200 });
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