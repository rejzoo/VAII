import { createClient } from "@/app/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { tankID: number } }) {
  const supabase = await createClient();
  const tankID = await params;

  try {
    const { data, error } = await supabase
      .from("UserTankEquipment")
      .select("*")
      .eq("tank_id", tankID.tankID);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const frequency: Record<number, number> = {};
    data.forEach((item) => {
      frequency[item.equipment_id] = (frequency[item.equipment_id] || 0) + 1;
    });

    // Convert frequency object to array, sort descending by count, and take top 3
    const sortedEquipmentIDs = Object.entries(frequency)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 3)
      .map(([equipment_id]) => Number(equipment_id));

    const { data: equipmentDetails, error: equipmentError } = await supabase
      .from("EquipmentList")
      .select("provision_id, name, image")
      .in("provision_id", sortedEquipmentIDs);

    if (equipmentError) {
      return NextResponse.json({ success: false, error: equipmentError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: equipmentDetails });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Unexpected error occurred" }, { status: 500 });
  }
}