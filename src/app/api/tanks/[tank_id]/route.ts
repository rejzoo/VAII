import { NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

export async function GET(req: Request, { params }: { params:  Promise<{ tank_id: string }> }) {
    const supabase = await createClient();
    
    try {
        const { tank_id } = await params;
        const { data: tankData, error: tankError } = await supabase
            .from('TankList')
            .select('*')
            .eq('tank_id', tank_id)

        if (tankError) {
            return NextResponse.json(
                { success: false, error: tankError.message },
                { status: 500 }
            );
        }

        const { data: tankImagesData, error: imagesError } = await supabase
            .from('TankImages')
            .select('*')
            .eq('tank_id', tank_id);

        if (imagesError) {
            return NextResponse.json(
                { success: false, error: imagesError.message },
                { status: 500 }
            );
        }

        const tankDataToReturn = {
            tankData: tankData[0],
            tankImagesData: {
                tank_id: tankImagesData[0].tank_id,
                images: {
                    big_icon: tankImagesData[0].big_icon,
                    small_icon: tankImagesData[0].small_icon,
                    contour_icon: tankImagesData[0].contour_icon,
                }
            }
        }
    
        return NextResponse.json({ success: true, tankDataToReturn }, { status: 200 });
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
