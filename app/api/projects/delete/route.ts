import { NextRequest, NextResponse } from "next/server";
import { verifyOwner } from "@/lib/supabase/auth";
import { createClient as createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const { isOwner, error: authError } = await verifyOwner();
    if (!isOwner) {
      return NextResponse.json({ error: authError || "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { id } = body || {};

    if (!id) {
      return NextResponse.json({ error: "Project id is required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      console.error("Project delete error:", error);
      return NextResponse.json({ error: "Failed to delete project", details: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error("Project delete exception:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
