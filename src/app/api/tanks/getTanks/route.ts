import { supabase } from './../../../../../lib/initSupabase';

import { NextResponse } from 'next/server';

export async function GET() {
    console.log("API GET");

    try {
        const { data, error } = await supabase
            .from('TankList')
            .select('*')
            .order('nation', { ascending: false })

        if (error) {
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }
        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (err) {
        return NextResponse.json(
            {
                success: false,
                error: (err as Error).message || 'Unexpected error occurred',
            },
            { status: 500 }
        );
    }
}
