"use client";

import { HoverCard } from "@/components/animations/HoverCard";
import type { Project } from "@/hooks/useProjects";

export function ProjectCard({ project, footer }: { project: Project; footer?: React.ReactNode }) {
  return (
    <HoverCard className="overflow-hidden">
      {project.image_url && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted ring-1 ring-border/40 before:pointer-events-none before:absolute before:inset-0 before:rounded-lg before:opacity-0 before:transition-opacity hover:before:opacity-100 before:[background:radial-gradient(220px_circle_at_var(--x,50%)_var(--y,50%),hsl(var(--primary)/.18),transparent_42%)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.image_url} alt={project.title} className="h-full w-full object-cover" />
        </div>
      )}
      <div className="p-6">
        <h3 className="font-semibold">{project.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(project.tech_stack || []).map((tag: string) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-4">
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">Visit Project</a>
          )}
        </div>
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </HoverCard>
  );
}
