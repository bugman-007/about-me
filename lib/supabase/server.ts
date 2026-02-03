import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase Server Client for Server Components & Route Handlers
 * 
 * SESSION-AWARE - Reads authenticated user from cookies
 * - Use in Server Components, Server Actions, Route Handlers
 * - Manages cookies for session persistence
 * - Respects RLS policies with user context
 * - Automatically refreshes tokens
 * 
 * IMPORTANT: This uses anon key but with user session context
 * 
 * @example
 * ```tsx
 * import { createClient } from "@/lib/supabase/server";
 * 
 * export default async function Page() {
 *   const supabase = await createClient();
 *   const { data } = await supabase.from("projects").select("*");
 *   return <div>...</div>;
 * }
 * ```
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
