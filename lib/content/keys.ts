export const REQUIRED_SETTING_KEYS = {
  // Hero
  hero_headline: true,
  hero_subheadline: true,
  hero_cta1_label: true,
  hero_cta1_href: true,
  hero_cta2_label: true,
  hero_cta2_href: true,

  // About
  about_title: true,
  about_body: true,

  // Capabilities
  capabilities_title: true,
  capabilities_subtitle: true,
  capabilities_json: true,

  // Contact
  contact_title: true,
  contact_subtitle: true,
  contact_email: true,
  github_url: true,
  linkedin_url: true,
  x_url: true,

  // Navbar
  navbar_avatar_url: true,

  // Experience
  experience_title: true,
  experience_subtitle: true,
  experience_json: true,

  // Footer
  footer_text: true,
  footer_links_json: true,

  // SEO
  seo_title: true,
  seo_description: true,
} as const;

export type SettingKey = keyof typeof REQUIRED_SETTING_KEYS;

export const DEFAULT_SETTINGS: Record<SettingKey, string> = {
  // Hero
  hero_headline: "I design AI-powered, data-intensive systems that scale.",
  hero_subheadline:
    "Senior engineer focused on distributed systems, AI integration, and platform architecture. I build resilient backends, optimized data pipelines, and interfaces that enable actionable intelligence.",
  hero_cta1_label: "View Projects",
  hero_cta1_href: "/projects",
  hero_cta2_label: "System Capabilities",
  hero_cta2_href: "#capabilities",

  // About
  about_title: "About",
  about_body:
    "I specialize in building reliable, scalable platforms and bringing AI into production. This portfolio showcases selected work and areas of focus.",

  // Capabilities
  capabilities_title: "System Capabilities",
  capabilities_subtitle: "Technical expertise and capabilities",
  capabilities_json: JSON.stringify(
    [
      { title: "Frontend Architecture", description: "Design systems, performance, DX" },
      { title: "Backend Systems", description: "APIs, microservices, data pipelines" },
      { title: "DevOps & Infrastructure", description: "CI/CD, observability, cloud" },
      { title: "System Design", description: "Scalability, reliability, tradeoffs" },
    ],
    null,
    2
  ),

  // Contact
  contact_title: "Get in Touch",
  contact_subtitle: "Interested in working together? Let's connect.",
  contact_email: "",
  github_url: "",
  linkedin_url: "",
  x_url: "",

  // Navbar
  navbar_avatar_url: "",

  // Experience
  experience_title: "Experience",
  experience_subtitle: "Professional journey and career highlights",
  experience_json: JSON.stringify(
    [
      { company: "Company Name", role: "Senior Developer", period: "2022 - Present", description: "Placeholder for experience description" },
      { company: "Previous Company", role: "Full Stack Developer", period: "2020 - 2022", description: "Placeholder for experience description" }
    ],
    null,
    2
  ),

  // Footer
  footer_text: "© {year} Portfolio. All rights reserved.",
  footer_links_json: JSON.stringify(
    [
      { label: "GitHub", href: "https://github.com" },
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "X", href: "https://x.com" },
    ],
    null,
    2
  ),

  // SEO
  seo_title: "Senior Engineer Portfolio",
  seo_description: "AI-powered systems, distributed platforms, and resilient backends.",
};
