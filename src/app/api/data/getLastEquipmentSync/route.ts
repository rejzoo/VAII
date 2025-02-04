import { createClient } from "@/app/utils/supabase/server";

export async function GET() {
    const supabase = await createClient();
    
    try {
        const { data, error } = await supabase
            .from('UpdateDates')
            .select('date, time')
            .eq('update_type', 'equipmentlist')
            .order('id', { ascending: false })
            .limit(1);

        if (error) {
            return new Response(
                JSON.stringify({ success: false, error: error.message }),
                { status: 500 }
            );
        }

        if (data.length === 0) {
            return new Response(JSON.stringify({ success: true, lastUpdate: null }), {
                status: 200,
            });
        }

        const lastUpdate = `${data[0].date} ${data[0].time}`;
        return new Response(JSON.stringify({ success: true, lastUpdate }), {
            status: 200,
        });
    } catch (err) {
        return new Response(
            JSON.stringify({ success: false, error: (err as Error).message }),
            { status: 500 }
        );
    }
}