import { NextRequest, NextResponse } from 'next/server';
import { supabase } from "../../../../../../lib/initSupabase";

export async function POST(req: NextRequest, { params }: { params: { action: string } }) {
    const { action } = params;
    const { tankId } = await req.json();
    //const { userID } = ; 

    console.log("FAVOURITE TANK API");
    console.log(userId);
    console.log(tankId);

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
        if (error) throw error;
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
