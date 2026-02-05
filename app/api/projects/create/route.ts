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
    const {
      title,
      description = "",
      url = "",
      tech_stack = [],
      featured = false,
      slug = "",
      image_url = "",
    } = body || {};

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const slugValue = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const supabase = createAdminClient();

    let sort_order: number | null = null;
    if (featured) {
      const { data: maxData } = await supabase
        .from("projects")
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1)
        .single();
      sort_order = (maxData?.sort_order ?? 0) + 1;
    }

    const { data, error } = await supabase
      .from("projects")
      .insert({ title, description, url, tech_stack, featured, slug: slugValue, image_url, sort_order })
      .select()
      .single();

    if (error) {
      console.error("Project create error:", error);
      return NextResponse.json({ error: "Failed to create project", details: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (e) {
    console.error("Project create exception:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
