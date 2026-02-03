import { createClient } from "./server";
import type { User } from "@supabase/supabase-js";

/**
 * Get the currently authenticated user from server-side session
 * 
 * Use in Server Components, Server Actions, or Route Handlers
 * Returns null if no authenticated session exists
 */
export async function getServerUser(): Promise<User | null> {
  const supabase = await createClient();
  
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return null;
  }

  return session.user;
}

/**
 * Verify that the current user is the site owner
 * 
 * Use in API routes to protect write operations
 * Checks both authentication AND owner ID match
 * 
 * @returns Object with verification result
 */
export async function verifyOwner(): Promise<{
  isOwner: boolean;
  userId: string | null;
  user: User | null;
  error?: string;
}> {
  const user = await getServerUser();

  if (!user) {
    return {
      isOwner: false,
      userId: null,
      user: null,
      error: "Unauthorized - no valid session",
    };
  }

  const ownerId = process.env.OWNER_ID;

  if (!ownerId) {
    console.error("OWNER_ID environment variable is not set");
    return {
      isOwner: false,
      userId: user.id,
      user,
      error: "Server configuration error",
    };
  }

  // Verify user is the owner
  if (user.id !== ownerId) {
    return {
      isOwner: false,
      userId: user.id,
      user,
      error: "Forbidden - not the site owner",
    };
  }

  return {
    isOwner: true,
    userId: user.id,
    user,
  };
}

/**
 * Require owner authentication - throws if not owner
 * 
 * Use at the start of protected API routes
 * Will throw an error if user is not authenticated or not the owner
 * 
 * @throws Error if not authenticated or not owner
 */
export async function requireOwner(): Promise<User> {
  const { isOwner, user, error } = await verifyOwner();

  if (!isOwner || !user) {
    throw new Error(error || "Unauthorized");
  }

  return user;
}
