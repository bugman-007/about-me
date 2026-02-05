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
import { SectionDivider } from "@/components/layout/SectionDivider";

export default async function HomePage() {
  // Ensure default settings exist for owner sessions
  await ensureSettings();
  // Fetch settings from Supabase
  const settings = await getSettings();

  return (
    <>
      <HeroSection settings={settings} />
      <SectionDivider />
      <AboutSection settings={settings} />
      <SectionDivider />
      <SystemCapabilities settings={settings} />
      <SectionDivider />
      <FeaturedProjects />
      <SectionDivider />
      <ExperienceSection settings={settings} />
      <SectionDivider />
      <ContactSection initialSettings={settings} />
    </>
  );
}
