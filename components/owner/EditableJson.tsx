"use client";

import { useState } from "react";
import { Pencil, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useOwner } from "@/context/OwnerContext";
import { toast } from "@/lib/toast";

interface EditableJsonProps {
  settingKey: string;
  value?: string; // JSON string
  className?: string;
}

export function EditableJson({ settingKey, value = "", className }: EditableJsonProps) {
  const { isOwner } = useOwner();
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState(value);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    try {
      JSON.parse(local || "null");
    } catch {
      toast.error("Invalid JSON");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/settings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates: { [settingKey]: local ?? "" } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      toast.success("Saved");
      setOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!isOwner) return null;

  return (
    <span className={cn("group/ej inline-flex items-center gap-2", className)}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="rounded p-1 text-muted-foreground ring-1 ring-transparent transition-all hover:text-foreground hover:ring-border" aria-label="Edit JSON">
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit JSON</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Textarea rows={14} value={local} onChange={(e) => setLocal(e.target.value)} className="font-mono text-xs" />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save} disabled={saving}>
                <Save className="mr-1 h-4 w-4" /> {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </span>
  );
}
