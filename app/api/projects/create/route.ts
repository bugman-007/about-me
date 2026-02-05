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

    let baseSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const supabase = createAdminClient();

    // Determine next sort order for featured items; tolerate empty table
    let sort_order: number | null = null;
    if (featured) {
      const { data: maxData } = await supabase
        .from("projects")
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1)
        .maybeSingle();
      sort_order = ((maxData as any)?.sort_order ?? 0) + 1;
    }

    // Ensure unique slug by checking existing slugs with same prefix
    let finalSlug = baseSlug || undefined;
    if (finalSlug) {
      const { data: existing } = await supabase
        .from("projects")
        .select("slug")
        .ilike("slug", `${baseSlug}%`);
      const taken = new Set((existing || []).map((r: any) => r.slug));
      if (taken.has(baseSlug)) {
        let suffix = 2;
        while (taken.has(`${baseSlug}-${suffix}`)) suffix++;
        finalSlug = `${baseSlug}-${suffix}`;
      }
    }

    // Normalize tech_stack to string[]
    const stack: string[] = Array.isArray(tech_stack)
      ? tech_stack.map((t) => String(t).trim()).filter(Boolean)
      : String(tech_stack || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

    const { data, error } = await supabase
      .from("projects")
      .insert({ title, description, url, tech_stack: stack, featured, slug: finalSlug, image_url, sort_order })
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
