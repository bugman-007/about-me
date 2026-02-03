import {
  HeroSection,
  SystemCapabilities,
  FeaturedProjects,
  ExperienceSection,
  ContactSection,
} from "@/components/sections";
import { getSettings } from "@/lib/data/settings";

export default async function HomePage() {
  // Fetch contact settings from Supabase
  const settings = await getSettings();

  return (
    <>
      <HeroSection />
      <SystemCapabilities />
      <FeaturedProjects />
      <ExperienceSection />
      <ContactSection initialSettings={settings} />
    </>
  );
}
