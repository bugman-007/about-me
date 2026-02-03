import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * ⚠️ DANGER: Supabase Admin Client with Service Role Key ⚠️
 * 
 * **DO NOT IMPORT THIS IN CLIENT COMPONENTS**
 * **ONLY USE IN API ROUTES OR SERVER ACTIONS**
 * 
 * This client bypasses ALL Row Level Security (RLS) policies.
 * It has full database access regardless of authentication.
 * 
 * Use cases:
 * - Administrative operations after verifying owner (prefer server client when possible)
 * - Bulk updates that need to bypass RLS
 * - Server-side operations requiring elevated permissions
 * 
 * @example
 * ```tsx
 * // ❌ WRONG - Never in client components
 * "use client";
 * import { createClient } from "@/lib/supabase/admin"; // DON'T DO THIS
 * 
 * // ✅ CORRECT - Only in API routes after auth check
 * import { createClient } from "@/lib/supabase/admin";
 * export async function POST(req: NextRequest) {
 *   const { isOwner } = await verifyOwner();
 *   if (!isOwner) return Response.json({ error: "Forbidden" }, { status: 403 });
 *   const supabase = createClient();
 *   // ... safe to use admin client here
 * }
 * ```
 */
export function createClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. This is required for admin operations."
    );
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
