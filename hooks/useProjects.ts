"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  url: string;
  image_url?: string;
  slug?: string;
  sort_order?: number | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Hook to fetch projects from Supabase
 * Automatically subscribes to real-time updates
 */
export function useProjects(featured?: boolean) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProjects() {
      try {
        let query = supabase
          .from("projects")
          .select("*")
          .order(featured ? "sort_order" : "featured", { ascending: featured ? true : false });

        if (!featured) {
          query = query.order("sort_order", { ascending: true }).order("created_at", { ascending: false });
        } else {
          query = query.order("created_at", { ascending: false });
        }

        if (featured !== undefined) {
          query = query.eq("featured", featured);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setProjects(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();

    // Subscribe to real-time changes
    const channel = supabase
      .channel("projects-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        () => {
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [featured, supabase]);

  return { projects, isLoading, error };
}

/**
 * Hook to update a project
 */
export function useUpdateProject() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateProject = async (project: Partial<Project> & { id: string }) => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch("/api/projects/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update project");
      }

      const result = await response.json();
      return result.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateProject, isUpdating, error };
}
