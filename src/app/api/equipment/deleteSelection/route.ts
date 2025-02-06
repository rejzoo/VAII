import { createClient } from "@/app/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const supabase = await createClient();
    
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { tankID } = await req.json();

        if (!tankID) {
            return NextResponse.json({ success: false, error: "Missing tankID" }, { status: 400 });
        }

        const { error } = await supabase
            .from("UserTankEquipment")
            .delete()
            .eq("user_id", user.id)
            .eq("tank_id", tankID);

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Equipment selection deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Unexpected error occurred" }, { status: 500 });
    }
}
