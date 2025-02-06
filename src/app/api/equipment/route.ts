import { createClient } from "@/app/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();
  
    try {
      const { data, error } = await supabase
        .from("EquipmentList")
        .select("*")
        .eq("type", "optionalDevice");
  
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
  
      return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ success: false, error: "Unexpected error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    
    try {
      const { tankID, selectedEquipment } = await req.json();
      if (!tankID || !selectedEquipment) {
        return NextResponse.json({ success: false, error: "Missing data" }, { status: 400 });
      }
  
      await supabase
        .from("UserTankEquipment")
        .delete()
        .eq("tank_id", tankID)
        .eq("user_id", user.data.user?.id);
  
      const { error } = await supabase
        .from("UserTankEquipment")
        .upsert([
        { user_id: user.data.user?.id, tank_id: tankID, slot: 1, equipment_id: selectedEquipment[0] },
        { user_id: user.data.user?.id, tank_id: tankID, slot: 2, equipment_id: selectedEquipment[1] },
        { user_id: user.data.user?.id, tank_id: tankID, slot: 3, equipment_id: selectedEquipment[2] },
      ]);
  
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
  
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ success: false, error: "Unexpected error" }, { status: 500 });
    }
}