"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useOwner } from "@/context/OwnerContext";
import { toast } from "@/lib/toast";
import { Pencil, Save, X } from "lucide-react";

interface EditableFieldProps {
  settingKey: string;
  value?: string;
  label?: string;
  multiline?: boolean;
  json?: boolean;
  as?: any;
  className?: string;
}

export function EditableField({
  settingKey,
  value = "",
  label,
  multiline,
  json,
  as = "span",
  className,
}: EditableFieldProps) {
  const { isOwner } = useOwner();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  const Tag = as as any;

  const startEdit = () => {
    if (!isOwner) return;
    setLocalValue(localValue ?? "");
    setEditing(true);
  };

  const cancelEdit = () => {
    setLocalValue(value ?? "");
    setEditing(false);
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      // Optional: validate JSON
      if (json) {
        try {
          JSON.parse(localValue || "null");
        } catch (e) {
          toast.error("Invalid JSON format");
          setSaving(false);
          return;
        }
      }

      const res = await fetch("/api/settings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates: { [settingKey]: localValue ?? "" } }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save");
      }

      toast.success("Saved");
      setEditing(false);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!isOwner) {
    return (
      <Tag className={className}>{value}</Tag>
    );
  }

  return (
    <div className={cn("group/ef inline-flex items-start gap-2", className)}>
      {!editing ? (
        <div className="relative">
          <Tag className="pr-6">{value}</Tag>
          <button
            type="button"
            onClick={startEdit}
            className="absolute -right-1 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground opacity-0 ring-1 ring-transparent transition-all hover:text-foreground hover:ring-border group-hover/ef:opacity-100"
            aria-label={label ? `Edit ${label}` : "Edit"}
            title={label ? `Edit ${label}` : "Edit"}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-2">
          {multiline || json ? (
            <Textarea
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              className="min-w-[280px]"
              rows={json ? 10 : 4}
            />
          ) : (
            <Input
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              className="min-w-[240px]"
            />
          )}
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={saveEdit} disabled={saving}>
              <Save className="mr-1 h-4 w-4" /> {saving ? "Saving..." : "Save"}
            </Button>
            <Button size="sm" variant="outline" onClick={cancelEdit} disabled={saving}>
              <X className="mr-1 h-4 w-4" /> Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
