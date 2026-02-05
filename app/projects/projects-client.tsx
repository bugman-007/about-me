"use client";

import { useState } from "react";
import { useOwner } from "@/context/OwnerContext";
import type { Project } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HoverCard } from "@/components/animations/HoverCard";
import { Reveal } from "@/components/animations/Reveal";

export default function ProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
  const { isOwner } = useOwner();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    id: "",
    title: "",
    description: "",
    url: "",
    image_url: "",
    tech_stack: "",
    featured: false,
    slug: "",
  });

  const resetForm = () => setForm({ id: "", title: "", description: "", url: "", image_url: "", tech_stack: "", featured: false, slug: "" });

  const openEdit = (project: Project) => {
    setForm({
      id: project.id,
      title: project.title || "",
      description: project.description || "",
      url: project.url || "",
      image_url: project.image_url || "",
      tech_stack: (project.tech_stack || []).join(", "),
      featured: project.featured || false,
      slug: project.slug || "",
    });
    setEditOpen(true);
  };

  const create = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          url: form.url,
          image_url: form.image_url,
          tech_stack: form.tech_stack.split(",").map((t) => t.trim()).filter(Boolean),
          featured: form.featured,
          slug: form.slug,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create project");
      toast.success("Project created");
      setProjects([data.data, ...projects]);
      setOpen(false);
      resetForm();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Create failed");
    } finally {
      setSaving(false);
    }
  };

  const update = async () => {
    if (!form.id) return;
    setSaving(true);
    try {
      const res = await fetch("/api/projects/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id,
          title: form.title,
          description: form.description,
          url: form.url,
          image_url: form.image_url,
          tech_stack: form.tech_stack.split(",").map((t) => t.trim()).filter(Boolean),
          featured: form.featured,
          slug: form.slug,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update project");
      toast.success("Project updated");
      setProjects(projects.map((p) => (p.id === form.id ? data.data : p)));
      setEditOpen(false);
      resetForm();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete project?")) return;
    try {
      const res = await fetch("/api/projects/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setProjects(projects.filter((p) => p.id !== id));
      toast.success("Project deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <div className="mt-6">
      {isOwner && (
        <>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>New Project</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <Textarea placeholder="Description" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <Input placeholder="URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
                <div className="flex items-center gap-2">
                  <Input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
                  <label className="inline-flex cursor-pointer items-center rounded-md border px-3 py-2 text-sm hover:bg-accent">
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      const fd = new FormData();
                      fd.append("file", f);
                      fd.append("folder", "projects");
                      const res = await fetch("/api/storage/upload", { method: "POST", body: fd });
                      const data = await res.json();
                      if (res.ok) setForm((s) => ({ ...s, image_url: data.url as string }));
                    }} />
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

          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <Textarea placeholder="Description" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <Input placeholder="URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
                <div className="flex items-center gap-2">
                  <Input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
                  <label className="inline-flex cursor-pointer items-center rounded-md border px-3 py-2 text-sm hover:bg-accent">
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      const fd = new FormData();
                      fd.append("file", f);
                      fd.append("folder", "projects");
                      const res = await fetch("/api/storage/upload", { method: "POST", body: fd });
                      const data = await res.json();
                      if (res.ok) setForm((s) => ({ ...s, image_url: data.url as string }));
                    }} />
                    Upload
                  </label>
                </div>
                <Input placeholder="Tech stack (comma-separated)" value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} />
                <Input placeholder="Slug (optional)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                  <Button onClick={update} disabled={saving}>{saving ? "Saving..." : "Update"}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.06}>
          <HoverCard className="p-6">
            {p.image_url && (
              <div className="relative mb-3 overflow-hidden rounded-lg ring-1 ring-border/40 before:pointer-events-none before:absolute before:inset-0 before:rounded-lg before:opacity-0 before:transition-opacity hover:before:opacity-100 before:[background:radial-gradient(220px_circle_at_var(--x,50%)_var(--y,50%),hsl(var(--primary)/.18),transparent_42%)]">
                <img src={p.image_url} alt={p.title} className="h-80 w-full object-cover" />
              </div>
            )}
            <h3 className="font-semibold">{p.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(p.tech_stack || []).map((t) => (
                <span key={t} className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground">{t}</span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              {p.url && (
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">Visit</a>
              )}
              {isOwner && (
                <>
                  <Button size="sm" variant="outline" onClick={() => openEdit(p)}>Edit</Button>
                  <Button size="sm" variant="outline" onClick={() => remove(p.id)}>Delete</Button>
                </>
              )}
            </div>
          </HoverCard>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
