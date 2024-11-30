import { supabase } from "../../../../../lib/initSupabase";

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('TankListUpdateDates')
            .select('date, time')
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