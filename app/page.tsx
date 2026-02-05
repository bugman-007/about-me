import {
  HeroSection,
  SystemCapabilities,
  FeaturedProjects,
  ExperienceSection,
  ContactSection,
  AboutSection,
} from "@/components/sections";
import { getSettings } from "@/lib/data/settings";
import { getFeaturedProjects } from "@/lib/data/projects";
import { ensureSettings } from "@/lib/data/ensureSettings";
import { SectionDivider } from "@/components/layout/SectionDivider";

export default async function HomePage() {
  // Ensure default settings exist for owner sessions
  await ensureSettings();
  // Fetch settings from Supabase
  const settings = await getSettings();
  const featuredRaw = await getFeaturedProjects();
  const featured = featuredRaw.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description ?? "",
    tech_stack: p.tech_stack || [],
    url: p.url ?? "",
    image_url: p.image_url ?? undefined,
    slug: p.slug ?? undefined,
    sort_order: p.sort_order ?? undefined,
    featured: p.featured,
    created_at: p.created_at,
    updated_at: p.updated_at,
  }));

  return (
    <>
      <HeroSection settings={settings} />
      <SectionDivider />
      <AboutSection settings={settings} />
      <SectionDivider />
      <SystemCapabilities settings={settings} />
      <SectionDivider />
      <FeaturedProjects initialProjects={featured} />
      <SectionDivider />
      <ExperienceSection settings={settings} />
      <SectionDivider />
      <ContactSection initialSettings={settings} />
    </>
  );
}
