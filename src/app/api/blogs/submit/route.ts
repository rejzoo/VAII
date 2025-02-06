import { NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { validateText } from "@/app/utils/validators/validators";

export async function POST(req: Request) {
    const supabase = await createClient();
    const { blogHeader, blogText } = await req.json();

    if (!validateText(blogHeader) || !validateText(blogText)) {
        return NextResponse.json({ success: false, error: "Invalid characters." }, { status: 500 });
    }

    try {
        const { error } = await supabase
            .from("UpdateBlog")
            .insert([{ header: blogHeader, text: blogText }]);

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Blog submitted successfully!" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Unexpected error occurred." }, { status:500 });
    }
}
