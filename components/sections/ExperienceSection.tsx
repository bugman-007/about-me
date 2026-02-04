"use client";

import { Container } from "@/components/layout";
import { FadeIn, SlideUp } from "@/components/animations";
import { EditableText } from "@/components/owner/EditableText";
import { EditableJson } from "@/components/owner/EditableJson";
import { useOwner } from "@/context/OwnerContext";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
  settings?: Record<string, string>;
}

export function ExperienceSection({ className, settings = {} }: ExperienceSectionProps) {
  const { isOwner } = useOwner();
  const initialList = useMemo(() => {
    try {
      return settings.experience_json ? JSON.parse(settings.experience_json) : experiences;
    } catch {
      return experiences;
    }
  }, [settings.experience_json]);
  const [items, setItems] = useState<Experience[]>(initialList);
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<Experience>({ company: "", role: "", period: "", description: "" });

  const openNew = () => {
    setEditingIndex(null);
    setForm({ company: "", role: "", period: "", description: "" });
    setOpen(true);
  };

  const openEdit = (idx: number) => {
    setEditingIndex(idx);
    setForm(items[idx]);
    setOpen(true);
  };

  const save = async () => {
    const updated = [...items];
    if (editingIndex === null) updated.unshift(form);
    else updated[editingIndex] = form;
    setItems(updated);
    setOpen(false);
    // persist to settings
    await fetch("/api/settings/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updates: { experience_json: JSON.stringify(updated) } }),
    });
  };

  const remove = async (idx: number) => {
    const updated = items.filter((_, i) => i !== idx);
    setItems(updated);
    await fetch("/api/settings/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updates: { experience_json: JSON.stringify(updated) } }),
    });
  };
  return (
    <section className={className}>
      <Container>
        <div className="py-20">
          <FadeIn>
            <EditableText settingKey="experience_title" value={settings.experience_title ?? "Experience"} as="h2" className="text-3xl font-bold tracking-tight" />
            <EditableText settingKey="experience_subtitle" value={settings.experience_subtitle ?? "Professional journey and career highlights"} as="p" className="mt-4 text-muted-foreground" />
          </FadeIn>

          <div className="mt-12 space-y-8">
            {items.map((experience: Experience, index: number) => (
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
                  {isOwner && (
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(index)}>Edit</Button>
                      <Button size="sm" variant="outline" onClick={() => remove(index)}>Delete</Button>
                    </div>
                  )}
                </div>
              </SlideUp>
            ))}
          </div>

          {isOwner && (
            <div className="mt-8">
              <Button onClick={openNew}>Add Experience</Button>
              <p className="mb-2 text-xs text-muted-foreground">Edit experiences (JSON)</p>
              <EditableJson settingKey="experience_json" value={settings.experience_json} className="inline-block" />
            </div>
          )}

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingIndex === null ? "New Experience" : "Edit Experience"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                <Input placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                <Input placeholder="Period" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} />
                <Textarea rows={4} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={save}>Save</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Container>
    </section>
  );
}
