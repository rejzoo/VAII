import { createClient } from '@/app/utils/supabase/server';
//import { FavouriteTank } from '@/types/tank';
import { NextResponse } from 'next/server';

export async function GET() {
    const supabase = await createClient();
    const user_id = (await supabase.auth.getUser()).data.user?.id;

    if (!user_id) return NextResponse.json({ success: false});

    try {
        const { data, error } = await supabase
            .from('FavouriteTanks')
            .select('TankList(*)')
            .eq('user_id', user_id);

        if (error) {
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        //const tanks = data.flatMap((item: FavouriteTank) => item.TankList);

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
