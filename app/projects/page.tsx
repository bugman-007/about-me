import { getProjects } from "@/lib/data/projects";
import { Container } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import ProjectsClient from "./projects-client";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projectsData = await getProjects();
  // Normalize for client Project type
  const projects = projectsData.map((p) => ({
    ...p,
    description: p.description ?? "",
    url: p.url ?? "",
    tech_stack: Array.isArray(p.tech_stack) ? p.tech_stack : [],
    image_url: p.image_url ?? "",
    slug: p.slug ?? "",
  }));
  return (
    <section>
      <Container>
        <div className="py-16">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            {/* Owner-only controls are rendered client-side */}
            <Suspense>
              <ProjectsClient initialProjects={projects} />
            </Suspense>
          </div>
        </div>
      </Container>
    </section>
  );
}
