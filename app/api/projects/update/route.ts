import { NextRequest, NextResponse } from "next/server";
import { verifyOwner } from "@/lib/supabase/auth";
import { createClient as createServerClient } from "@/lib/supabase/server";

/**
 * Update project data
 * 
 * Protected endpoint - requires owner authentication
 * Uses server client (with authenticated session context) instead of admin client
 * This is safer as it still respects RLS policies
 */
export async function POST(request: NextRequest) {
  try {
    // Verify owner authentication and get user
    const { isOwner, error: authError } = await verifyOwner();

    if (!isOwner) {
      return NextResponse.json(
        { error: authError || "Unauthorized" },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { id, title, description, tech_stack, url, featured } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Use server client (authenticated, respects RLS)
    const supabase = await createServerClient();
    
    const { data, error } = await supabase
      .from("projects")
      .update({
        title,
        description,
        tech_stack,
        url,
        featured,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Database update error:", error);
      return NextResponse.json(
        { error: "Failed to update project", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Project update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
