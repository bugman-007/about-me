import { createClient } from "@/lib/supabase/server";
import { verifyOwner } from "@/lib/supabase/auth";
import { DEFAULT_SETTINGS } from "@/lib/content/keys";

/**
 * Ensures that all required settings exist in the database when the owner is authenticated.
 * Upserts missing keys with default values once.
 */
export async function ensureSettings() {
  const { isOwner } = await verifyOwner();
  if (!isOwner) return { ensured: 0 };

  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("key");
  if (error) return { ensured: 0 };

  const existingKeys = new Set((data || []).map((r: any) => r.key as string));
  const missing = Object.entries(DEFAULT_SETTINGS).filter(
    ([key]) => !existingKeys.has(key)
  );

  if (missing.length === 0) return { ensured: 0 };

  const upserts = missing.map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }));

  const { error: upsertError } = await supabase
    .from("site_settings")
    .upsert(upserts, { onConflict: "key" });

  if (upsertError) return { ensured: 0 };
  return { ensured: upserts.length };
}
