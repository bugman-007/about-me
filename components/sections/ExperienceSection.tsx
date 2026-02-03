"use client";

import { Container } from "@/components/layout";
import { FadeIn, SlideUp } from "@/components/animations";

interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
}

// Placeholder experiences
const experiences: Experience[] = [
  {
    company: "Company Name",
    role: "Senior Developer",
    period: "2022 - Present",
    description: "Placeholder for experience description",
  },
  {
    company: "Previous Company",
    role: "Full Stack Developer",
    period: "2020 - 2022",
    description: "Placeholder for experience description",
  },
];

interface ExperienceSectionProps {
  className?: string;
}

export function ExperienceSection({ className }: ExperienceSectionProps) {
  return (
    <section className={className}>
      <Container>
        <div className="py-20">
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight">Experience</h2>
            <p className="mt-4 text-muted-foreground">
              Professional journey and career highlights
            </p>
          </FadeIn>

          <div className="mt-12 space-y-8">
            {experiences.map((experience, index) => (
              <SlideUp key={experience.company} delay={index * 0.1}>
                <div className="rounded-lg border border-border p-6">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="font-semibold">{experience.role}</h3>
                      <p className="text-sm text-muted-foreground">
                        {experience.company}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {experience.period}
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {experience.description}
                  </p>
                </div>
              </SlideUp>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
