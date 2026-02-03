import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase Browser Client for Client Components
 * 
 * SAFE FOR CLIENT-SIDE USE
 * - Uses NEXT_PUBLIC_* environment variables
 * - Only has anon key (read-only by default via RLS)
 * - Respects Supabase Row Level Security policies
 * 
 * @example
 * ```tsx
 * "use client";
 * import { createClient } from "@/lib/supabase/browser";
 * 
 * const supabase = createClient();
 * const { data } = await supabase.from("projects").select("*");
 * ```
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
