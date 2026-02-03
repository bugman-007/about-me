import { NextRequest, NextResponse } from "next/server";
import { verifyOwner } from "@/lib/supabase/auth";
import { createClient as createServerClient } from "@/lib/supabase/server";

/**
 * Update site settings
 * 
 * Protected endpoint - requires owner authentication
 * Supports both single and bulk updates
 */
export async function POST(request: NextRequest) {
  try {
    // Verify owner authentication
    const { isOwner, error: authError } = await verifyOwner();

    if (!isOwner) {
      return NextResponse.json(
        { error: authError || "Unauthorized" },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();

    // Support both single update and bulk updates
    if (body.updates && typeof body.updates === "object") {
      // Bulk update: { updates: { key1: value1, key2: value2 } }
      const updates = body.updates as Record<string, string>;
      const entries = Object.entries(updates);

      if (entries.length === 0) {
        return NextResponse.json(
          { error: "No updates provided" },
          { status: 400 }
        );
      }

      // Use server client (authenticated, respects RLS)
      const supabase = await createServerClient();
      
      // Prepare bulk upsert data
      const upsertData = entries.map(([key, value]) => ({
        key,
        value: String(value),
        updated_at: new Date().toISOString(),
      }));

      const { data, error } = await supabase
        .from("site_settings")
        .upsert(upsertData, { onConflict: "key" })
        .select();

      if (error) {
        console.error("Database bulk upsert error:", error);
        return NextResponse.json(
          { error: "Failed to update settings", details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ 
        success: true, 
        data,
        updated: entries.length 
      }, { status: 200 });
    } else {
      // Single update: { key: "...", value: "..." }
      const { key, value } = body;

      if (!key) {
        return NextResponse.json(
          { error: "Setting key is required" },
          { status: 400 }
        );
      }

      if (value === undefined || value === null) {
        return NextResponse.json(
          { error: "Setting value is required" },
          { status: 400 }
        );
      }

      // Use server client (authenticated, respects RLS)
      const supabase = await createServerClient();
      
      const { data, error } = await supabase
        .from("site_settings")
        .upsert(
          {
            key,
            value: String(value),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "key" }
        )
        .select()
        .single();

      if (error) {
        console.error("Database upsert error:", error);
        return NextResponse.json(
          { error: "Failed to update setting", details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, data }, { status: 200 });
    }
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
