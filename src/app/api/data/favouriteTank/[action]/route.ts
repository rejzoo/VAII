import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/server'

export async function POST(req: NextRequest, { params }: { params: { action: string } }) {

    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        console.log("NEPRIHLASENY");
        return;
    }

    const { action } = params;
    const { tankId } = await req.json();
    const userId = data.user.id;

    if (!userId || !tankId) {
        return NextResponse.json({ error: 'Missing userId or tankId' }, { status: 400 });
    }

    try {
        if (action === 'add') {
            const { error } = await supabase
                .from('FavouriteTanks')
                .insert({ user_id: userId, tank_id: tankId });
        if (error) throw error;
            return NextResponse.json({ message: 'Tank added to favorites' }, { status: 200 });
        } else if (action === 'remove') {
            const { error } = await supabase
                .from('FavouriteTanks')
                .delete()
                .eq('user_id', userId)
                .eq('tank_id', tankId);
        if (error) throw error;
            return NextResponse.json({ message: 'Tank removed from favorites' }, { status: 200 });
        } else if (action === 'check') {
            const { data, error } = await supabase
                .from('FavouriteTanks')
                .select('*')
                .eq('user_id', userId)
                .eq('tank_id', tankId)
                .single();
        if (error) console.log("NENI FAVORITE");
            return NextResponse.json({ isFavorite: !!data }, { status: 200 });
        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
}