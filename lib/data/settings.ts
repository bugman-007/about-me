import { createClient } from "@/lib/supabase/server";
import { DEFAULT_SETTINGS } from "@/lib/content/keys";

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

/**
 * Required site settings and their default values.
 * These centralize all non-project content.
 */
// Settings defaults are defined in lib/content/keys.ts

/**
 * Fetch all site settings from Supabase
 * Returns as key-value object for easy access
 * Uses server client - safe for SSR
 */
export async function getSettings(): Promise<Record<string, string>> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("site_settings").select("*");

  if (error) {
    console.error("Error fetching settings:", error);
    return {};
  }

  // Convert array to key-value object
  const settings = (data || []).reduce(
    (acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    },
    {} as Record<string, string>
  );

  // Merge defaults for any missing keys (read-only; ensure happens elsewhere)
  for (const [k, v] of Object.entries(DEFAULT_SETTINGS)) {
    if (settings[k] === undefined) settings[k] = v as string;
  }
  return settings;
}

/**
 * Fetch a single setting by key
 * 
 * @param key - Setting key (e.g., "contact_email")
 */
export async function getSetting(key: string): Promise<string | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .single();

  if (error) {
    console.error(`Error fetching setting '${key}':`, error);
    return null;
  }

  return data?.value || null;
}

/**
 * Common setting keys for type safety
 */
export const SETTING_KEYS = {
  CONTACT_EMAIL: "contact_email",
  GITHUB_URL: "github_url",
  LINKEDIN_URL: "linkedin_url",
} as const;
