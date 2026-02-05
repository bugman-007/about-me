"use client";

import { useState } from "react";
import { HoverCard } from "@/components/animations/HoverCard";
import type { Project } from "@/hooks/useProjects";

export function ProjectCard({ project, footer }: { project: Project; footer?: React.ReactNode }) {
  const [imgOk, setImgOk] = useState(true);
  return (
    <HoverCard className="flex h-full min-h-[420px] flex-col overflow-hidden">
      {project.image_url && imgOk ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted ring-1 ring-border/40 before:pointer-events-none before:absolute before:inset-0 before:rounded-lg before:opacity-0 before:transition-opacity hover:before:opacity-100 before:[background:radial-gradient(220px_circle_at_var(--x,50%)_var(--y,50%),hsl(var(--primary)/.18),transparent_42%)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image_url}
            alt={project.title}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setImgOk(false)}
          />
        </div>
      ) : (
        <div className="aspect-video w-full rounded-lg bg-gradient-to-br from-muted to-muted/60" />
      )}
      <div className="flex flex-1 flex-col p-6">
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
        <div className="mt-auto pt-4">
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">Visit Project</a>
          )}
        </div>
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </HoverCard>
  );
}
