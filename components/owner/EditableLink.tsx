"use client";

import { useState } from "react";
import { Pencil, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useOwner } from "@/context/OwnerContext";
import { toast } from "@/lib/toast";

interface EditableLinkProps {
  labelKey: string;
  hrefKey: string;
  labelValue?: string;
  hrefValue?: string;
  className?: string;
  anchorClassName?: string;
}

export function EditableLink({ labelKey, hrefKey, labelValue = "", hrefValue = "", className, anchorClassName }: EditableLinkProps) {
  const { isOwner } = useOwner();
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState(labelValue);
  const [href, setHref] = useState(hrefValue);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates: { [labelKey]: label ?? "", [hrefKey]: href ?? "" } }),
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
    <span className={cn("group/el inline-flex items-center gap-2", className)}>
      <a href={hrefValue || "#"} className={cn("hover:underline", anchorClassName)}>
        {labelValue}
      </a>
      {isOwner && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="rounded p-1 text-muted-foreground opacity-0 ring-1 ring-transparent transition-all hover:text-foreground hover:ring-border group-hover/el:opacity-100" aria-label="Edit">
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Label</div>
                <Input value={label} onChange={(e) => setLabel(e.target.value)} />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">URL</div>
                <Input value={href} onChange={(e) => setHref(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={save} disabled={saving}>
                  <Save className="mr-1 h-4 w-4" /> {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </span>
  );
}
