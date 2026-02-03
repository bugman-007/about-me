import { createClient } from "@/lib/supabase/server";

export interface Project {
  id: string;
  title: string;
  description: string | null;
  tech_stack: string[];
  url: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch all projects from Supabase
 * Uses server client - safe for SSR
 * 
 * @param featured - Optional filter for featured projects only
 */
export async function getProjects(
  featured?: boolean
): Promise<Project[]> {
  const supabase = await createClient();

  let query = supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (featured !== undefined) {
    query = query.eq("featured", featured);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return data || [];
}

/**
 * Fetch a single project by ID
 * 
 * @param id - Project ID
 */
export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching project:", error);
    return null;
  }

  return data;
}

/**
 * Fetch featured projects
 * Convenience wrapper for getProjects(true)
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  return getProjects(true);
}
