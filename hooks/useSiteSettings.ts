"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

/**
 * Hook to fetch site settings from Supabase
 */
export function useSiteSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error: fetchError } = await supabase
          .from("site_settings")
          .select("*");

        if (fetchError) throw fetchError;

        // Convert array to key-value object
        const settingsObj = (data || []).reduce(
          (acc, setting) => {
            acc[setting.key] = setting.value;
            return acc;
          },
          {} as Record<string, string>
        );

        setSettings(settingsObj);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSettings();

    // Subscribe to real-time changes
    const channel = supabase
      .channel("settings-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings" },
        () => {
          fetchSettings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return { settings, isLoading, error };
}

/**
 * Hook to update a site setting
 */
export function useUpdateSetting() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateSetting = async (key: string, value: string) => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch("/api/settings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update setting");
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

  return { updateSetting, isUpdating, error };
}
