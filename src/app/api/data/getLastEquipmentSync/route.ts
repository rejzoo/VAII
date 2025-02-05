import { createClient } from "@/app/utils/supabase/server";

export async function GET() {
    const supabase = await createClient();
    
    try {
        const { data: updateData, error: updateError } = await supabase
            .from('UpdateDates')
            .select('date, time')
            .eq('update_type', 'equipmentlist')
            .order('id', { ascending: false })
            .limit(1);
        
        const { data: deleteData, error: deleteError } = await supabase
            .from('UpdateDates')
            .select('date, time')
            .eq('update_type', 'delete_equipmentlist')
            .order('id', { ascending: false })
            .limit(1);

        if (updateError || deleteError) {
            return new Response(
                JSON.stringify({ success: false, error: updateError?.message || deleteError?.message }),
                { status: 500 }
            );
        }

        const lastUpdate = updateData.length > 0 ? `${updateData[0].date} ${updateData[0].time}` : null;
        const lastDelete = deleteData.length > 0 ? `${deleteData[0].date} ${deleteData[0].time}` : null;

        return new Response(JSON.stringify({ success: true, lastUpdate, lastDelete }), {
            status: 200,
        });
    } catch (err) {
        return new Response(
            JSON.stringify({ success: false, error: (err as Error).message }),
            { status: 500 }
        );
    }
}