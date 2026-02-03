"use client";

import { Container } from "@/components/layout";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/animations";

interface Project {
  title: string;
  description: string;
  tags: string[];
}

// Placeholder projects - will be replaced with MDX content
const projects: Project[] = [
  {
    title: "Project One",
    description: "Placeholder for featured project description",
    tags: ["React", "TypeScript", "Node.js"],
  },
  {
    title: "Project Two",
    description: "Placeholder for featured project description",
    tags: ["Next.js", "PostgreSQL", "AWS"],
  },
  {
    title: "Project Three",
    description: "Placeholder for featured project description",
    tags: ["Python", "FastAPI", "Docker"],
  },
];

interface FeaturedProjectsProps {
  className?: string;
}

export function FeaturedProjects({ className }: FeaturedProjectsProps) {
  return (
    <section className={className}>
      <Container>
        <div className="py-20">
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight">
              Featured Projects
            </h2>
            <p className="mt-4 text-muted-foreground">
              Selected work and case studies
            </p>
          </FadeIn>

          <StaggerChildren className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <StaggerItem key={project.title}>
                <article className="group rounded-lg border border-border p-6 transition-colors hover:border-foreground/20">
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </Container>
    </section>
  );
}
