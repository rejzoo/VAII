import { Tank, TankImages } from "@/types/types";
import { createClient } from "@/app/utils/supabase/server";

export async function POST() {
    const supabase = await createClient();

    try {
        const apiUrl = `https://api.worldoftanks.eu/wot/encyclopedia/provisions/?application_id=${process.env.WARGAMING_API_KEY}`;
        const apiResponse = await fetch(apiUrl);
    
        if (!apiResponse.ok) {
            throw new Error(`Failed to fetch data from API: ${apiResponse.statusText}`);
        }
    
        const jsonResponse = await apiResponse.json();
    
        if (!jsonResponse.data) {
            throw new Error('No equipment data found in API response.');
        }
    
        const equipmentData = Object.values(jsonResponse.data).map((equipment: any) => ({
            provision_id: equipment.provision_id,
            name: equipment.name,
            type: equipment.type,
            description: equipment.description,
            price_credit: equipment.price_credit || 0,
            price_gold: equipment.price_gold || 0,
            image: equipment.image,
            tag: equipment.tag
        }));
    
        const { error: equipmentError } = await supabase
            .from('EquipmentList')
            .upsert(equipmentData, { onConflict: 'provision_id' });
    
        if (equipmentError) {
            return new Response(
                JSON.stringify({ success: false, error: equipmentError.message }),
                { status: 500 }
            );
        }

        const currentDate = new Date();
        const date = currentDate.toISOString().split('T')[0];
        const time = currentDate.toTimeString().split(' ')[0];
        const update_type = 'equipmentlist';

        const { error: insertError } = await supabase
            .from('UpdateDates')
            .insert([{ date, time, update_type}]);

        if (insertError) {
            return new Response(
                JSON.stringify({ success: false, error: insertError.message }),
                { status: 500 }
            );
        }
    
        return new Response(JSON.stringify({ success: true, equipmentData }), { status: 200 });
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