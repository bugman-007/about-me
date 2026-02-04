"use client";

import { useState } from "react";
import { Pencil, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useOwner } from "@/context/OwnerContext";
import { toast } from "@/lib/toast";

export function EditableImageUrl({ settingKey, value }: { settingKey: string; value?: string }) {
  const { isOwner } = useOwner();
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState(value || "");
  const [saving, setSaving] = useState(false);

  if (!isOwner) return null;

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates: { [settingKey]: local } }),
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="absolute -bottom-1 -right-1 rounded-full bg-background/80 p-1 text-muted-foreground ring-1 ring-border backdrop-blur hover:text-foreground" aria-label="Edit avatar">
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Avatar URL</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input value={local} onChange={(e) => setLocal(e.target.value)} placeholder="https://..." />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}><Save className="mr-1 h-4 w-4" /> {saving ? "Saving..." : "Save"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
