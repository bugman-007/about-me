"use client";

import { useState } from "react";
import { useOwner } from "@/context/OwnerContext";
import type { Project } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
  const { isOwner } = useOwner();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    id: "",
    title: "",
    description: "",
    url: "",
    tech_stack: "",
    featured: false,
    slug: "",
  });

  const resetForm = () => setForm({ id: "", title: "", description: "", url: "", tech_stack: "", featured: false, slug: "" });

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

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <article key={p.id} className="rounded-lg border border-border p-6">
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
                  <Button size="sm" variant="outline" onClick={() => remove(p.id)}>Delete</Button>
                </>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
