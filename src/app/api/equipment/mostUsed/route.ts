import { createClient } from "@/app/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  try {
    // Query in the supabase - view top_equipment - group by does not fucntion in the code
    const { data, error } = await supabase
        .from("top_equipment")
        .select("*");
    console.log(error)
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const topEquipmentIds = data.map((item) => item.equipment_id);

    const { data: equipmentDetails, error: equipmentError } = await supabase
      .from("EquipmentList")
      .select("provision_id, name, image")
      .in("provision_id", topEquipmentIds);

    if (equipmentError) {
      return NextResponse.json({ success: false, error: equipmentError.message }, { status: 500 });
    }

    const topEquipment = data.map((item) => {
      const details = equipmentDetails.find((eq) => eq.provision_id === item.equipment_id);
      return {
        provision_id: item.equipment_id,
        name: details?.name || "Unknown",
        image: details?.image || "",
        count: item.count,
      };
    });

    return NextResponse.json({ success: true, data: topEquipment });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Unexpected error occurred" }, { status: 500 });
  }
}
