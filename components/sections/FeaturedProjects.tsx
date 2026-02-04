"use client";

import { Container } from "@/components/layout";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/animations";
import { useProjects } from "@/hooks/useProjects";
import { useOwner } from "@/context/OwnerContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

import type { Project } from "@/hooks/useProjects";

interface FeaturedProjectsProps {
  className?: string;
}

export function FeaturedProjects({ className }: FeaturedProjectsProps) {
  const { projects } = useProjects(true);
  const { isOwner } = useOwner();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    url: "",
    image_url: "",
    tech_stack: "",
    featured: true,
    slug: "",
  });

  const create = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tech_stack: form.tech_stack.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create project");
      setOpen(false);
      setForm({ title: "", description: "", url: "", image_url: "", tech_stack: "", featured: true, slug: "" });
    } catch (e) {
      // Optionally surface a toast
      console.error(e);
    } finally {
      setSaving(false);
    }
  };
  return (
    <section className={className}>
      <Container>
        <div className="py-20">
          <FadeIn>
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">
                Featured Projects
              </h2>
              {isOwner && (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">New Project</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>New Featured Project</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                      <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                      <Textarea placeholder="Description" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                      <Input placeholder="Project URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
                      <Input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
                      <Input placeholder="Tech stack (comma-separated)" value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} />
                      <Input placeholder="Slug (optional)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={create} disabled={saving}>{saving ? "Saving..." : "Create"}</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <p className="mt-4 text-muted-foreground">
              Selected work and case studies
            </p>
          </FadeIn>

          <StaggerChildren className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project: Project) => (
              <StaggerItem key={project.title}>
                <article className="group overflow-hidden rounded-lg border border-border transition-colors hover:border-foreground/20">
                  {project.image_url && (
                    <div className="aspect-video w-full overflow-hidden bg-muted">
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
