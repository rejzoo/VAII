import { NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import { useAuth } from '../../../../../context/AuthContext';

export async function GET(req: Request, { params }: { params: { tank_id: string } }) {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    try {
        const { tank_id } = await params;
        const { data: avgData, error: avgError } = await supabase
            .from('Ratings')
            .select('rating')
            .eq('tank_id', tank_id);

        if (avgError) {
            return NextResponse.json(
                { success: false, error: avgError.message },
                { status: 500 }
            );        }

        const avgRating =
            avgData.length > 0 ? avgData.reduce((sum: any, { rating }: any) => sum + rating, 0) / avgData.length : 0;

        let userRating = null;
        if (user) {
            const { data: userData, error: userError } = await supabase
                .from('Ratings')
                .select('rating')
                .eq('tank_id', tank_id)
                .eq('user_id', user.data.user?.id)
                .single();

            if (!userError) {
                userRating = userData?.rating || null;
            }
        }

        return NextResponse.json({ success: true, avgRating, userRating });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ success: false, error: 'Unexpected error occurred' }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params:  Promise<{ tank_id: string }> }) {
    const supabase = await createClient();
    
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }
        const { rating } = await req.json();
        const tank_id = (await params).tank_id;

        console.log(rating);

        if (!tank_id || !rating || rating < 1 || rating > 5) {
            return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
        }

        const { error } = await supabase
            .from('ratings')
            .upsert([{ tank_id, user_id: user.id, rating }], { onConflict: 'user_id' });

    

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Unexpected error occurred' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { tank_id: string } }) {
    const supabase = await createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { tank_id } = await params;

        const { error } = await supabase
            .from('ratings')
            .delete()
            .eq('tank_id', tank_id)
            .eq('user_id', user.id);

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Unexpected error occurred' }, { status: 500 });
    }
}
