"use client";

import { Container } from "@/components/layout";
import { FadeIn } from "@/components/animations";
import { Reveal } from "@/components/animations/Reveal";
import { HoverCard } from "@/components/animations/HoverCard";
import { AnimatedHeading } from "@/components/visual/AnimatedHeading";
import type { Project } from "@/hooks/useProjects";
import { useOwner } from "@/context/OwnerContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ProjectCard } from "@/components/projects/ProjectCard";

interface FeaturedProjectsProps {
  className?: string;
  initialProjects?: Project[];
}

export function FeaturedProjects({ className, initialProjects = [] }: FeaturedProjectsProps) {
  const projects = initialProjects;
  const { isOwner } = useOwner();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [edit, setEdit] = useState<Project | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    url: "",
    image_url: "",
    tech_stack: "",
    featured: true,
    slug: "",
  });

  const uploadImage = async (file: File | null) => {
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "projects");
    const res = await fetch("/api/storage/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    setForm((f) => ({ ...f, image_url: data.url as string }));
  };

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

  const openEdit = (p: Project) => {
    setEdit(p);
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!edit) return;
    const res = await fetch("/api/projects/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: edit.id,
        title: edit.title,
        description: edit.description,
        url: edit.url,
        image_url: edit.image_url,
        tech_stack: edit.tech_stack,
        featured: edit.featured,
        slug: edit.slug,
      }),
    });
    if (res.ok) setEditOpen(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete project?")) return;
    const res = await fetch("/api/projects/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= projects.length) return;
    const a = projects[index];
    const b = projects[target];
    const aOrder = (a.sort_order ?? index) as number;
    const bOrder = (b.sort_order ?? target) as number;
    await Promise.all([
      fetch("/api/projects/update", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: a.id, sort_order: bOrder }) }),
      fetch("/api/projects/update", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: b.id, sort_order: aOrder }) }),
    ]);
  };
  return (
    <section id="projects" className={className}>
      <Container>
        <div className="py-20">
          <FadeIn>
            <div className="flex items-center justify-between">
              <AnimatedHeading as="h2" className="text-4xl font-bold tracking-tight">
                Featured Projects
              </AnimatedHeading>
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
                      <div className="flex items-center gap-2">
                        <Input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
                        <label className="inline-flex cursor-pointer items-center rounded-md border px-3 py-2 text-sm hover:bg-accent">
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(e.target.files?.[0] || null)} />
                          Upload
                        </label>
                      </div>
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

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project: Project, i: number) => (
              <Reveal key={project.title} delay={i * 0.08}>
                <ProjectCard
                  project={project}
                  footer={isOwner ? (
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(project)}>Edit</Button>
                      <Button size="sm" variant="outline" onClick={() => remove(project.id)}>Delete</Button>
                      <Button size="sm" variant="outline" onClick={() => move(i, -1)}>Move Up</Button>
                      <Button size="sm" variant="outline" onClick={() => move(i, 1)}>Move Down</Button>
                    </div>
                  ) : undefined}
                />
              </Reveal>
            ))}
          </div>

          {isOwner && edit && (
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Project</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <Input placeholder="Title" value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} />
                  <Textarea placeholder="Description" rows={4} value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} />
                  <Input placeholder="Project URL" value={edit.url} onChange={(e) => setEdit({ ...edit, url: e.target.value })} />
                  <div className="flex items-center gap-2">
                    <Input placeholder="Image URL" value={edit.image_url || ""} onChange={(e) => setEdit({ ...edit, image_url: e.target.value })} />
                    <label className="inline-flex cursor-pointer items-center rounded-md border px-3 py-2 text-sm hover:bg-accent">
                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const fd = new FormData();
                        fd.append("file", f);
                        fd.append("folder", "projects");
                        const res = await fetch("/api/storage/upload", { method: "POST", body: fd });
                        const data = await res.json();
                        if (res.ok) setEdit({ ...edit, image_url: data.url as string });
                      }} />
                      Upload
                    </label>
                  </div>
                  <Input placeholder="Tech stack (comma-separated)" value={(edit.tech_stack || []).join(", ")} onChange={(e) => setEdit({ ...edit, tech_stack: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} />
                  <Input placeholder="Slug (optional)" value={edit.slug || ""} onChange={(e) => setEdit({ ...edit, slug: e.target.value })} />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button onClick={saveEdit}>Save</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </Container>
    </section>
  );
}
