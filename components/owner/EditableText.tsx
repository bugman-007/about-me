"use client";

import { useState } from "react";
import { Pencil, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useOwner } from "@/context/OwnerContext";
import { toast } from "@/lib/toast";

interface EditableTextProps {
  settingKey: string;
  value?: string;
  label?: string;
  multiline?: boolean;
  as?: any;
  className?: string;
}

export function EditableText({ settingKey, value = "", label, multiline, as = "span", className }: EditableTextProps) {
  const { isOwner } = useOwner();
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState(value);
  const [saving, setSaving] = useState(false);
  const Tag = as as any;

  const save = async () => {
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

  if (!isOwner) return <Tag className={className}>{value}</Tag>;

  return (
    <span className={cn("group/et inline-flex items-center gap-2")}> 
      <Tag className={className}>{value}</Tag>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="rounded p-1 text-muted-foreground opacity-0 ring-1 ring-transparent transition-all hover:text-foreground hover:ring-border group-hover/et:opacity-100" aria-label="Edit">
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{label || "Edit"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {multiline ? (
              <Textarea rows={6} value={local} onChange={(e) => setLocal(e.target.value)} className="whitespace-pre-wrap" />
            ) : (
              <Input value={local} onChange={(e) => setLocal(e.target.value)} />
            )}
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
