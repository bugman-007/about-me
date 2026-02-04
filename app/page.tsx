import {
  HeroSection,
  SystemCapabilities,
  FeaturedProjects,
  ExperienceSection,
  ContactSection,
  AboutSection,
} from "@/components/sections";
import { getSettings } from "@/lib/data/settings";
import { ensureSettings } from "@/lib/data/ensureSettings";

export default async function HomePage() {
  // Ensure default settings exist for owner sessions
  await ensureSettings();
  // Fetch settings from Supabase
  const settings = await getSettings();

  return (
    <>
      <HeroSection settings={settings} />
      <AboutSection settings={settings} />
      <SystemCapabilities settings={settings} />
      <FeaturedProjects />
      <ExperienceSection settings={settings} />
      <ContactSection initialSettings={settings} />
    </>
  );
}
