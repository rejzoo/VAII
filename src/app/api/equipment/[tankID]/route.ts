import { createClient } from "@/app/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { tankID: string } }) {
  const supabase = await createClient();
  const { tankID } = await params;

  try {
    const { data, error } = await supabase
      .from("UserTankEquipment")
      .select("equipment_id")
      .eq("tank_id", tankID)
      .order("slot", { ascending: true });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const selectedEquipment = data.map(entry => entry.equipment_id);

    return NextResponse.json({ success: true, data: selectedEquipment });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Unexpected error occurred" }, { status: 500 });
  }
}
