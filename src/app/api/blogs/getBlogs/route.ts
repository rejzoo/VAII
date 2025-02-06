import { NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";

export async function GET(req: Request) {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from("UpdateBlog")
            .select("*");

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data: data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Unexpected error occurred." }, { status:500 });
    }
}
