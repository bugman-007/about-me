"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUpdateProject, type Project } from "@/hooks/useProjects";

interface ProjectEditFormProps {
  project: Project;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * Inline edit form for projects
 * Example implementation of owner editing UI
 */
export function ProjectEditForm({
  project,
  onClose,
  onSuccess,
}: ProjectEditFormProps) {
  const { updateProject, isUpdating, error } = useUpdateProject();
  
  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description || "",
    url: project.url || "",
    tech_stack: project.tech_stack.join(", "),
    featured: project.featured,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProject({
        id: project.id,
        title: formData.title,
        description: formData.description,
        url: formData.url,
        tech_stack: formData.tech_stack.split(",").map((t) => t.trim()),
        featured: formData.featured,
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Failed to update project:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit Project</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium"
            >
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label
              htmlFor="tech_stack"
              className="mb-1 block text-sm font-medium"
            >
              Tech Stack (comma-separated)
            </label>
            <input
              id="tech_stack"
              type="text"
              value={formData.tech_stack}
              onChange={(e) =>
                setFormData({ ...formData, tech_stack: e.target.value })
              }
              placeholder="React, TypeScript, Node.js"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="url" className="mb-1 block text-sm font-medium">
              URL
            </label>
            <input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              placeholder="https://github.com/..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="featured"
              type="checkbox"
              checked={formData.featured}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
              }
              className="h-4 w-4 rounded border-input"
            />
            <label htmlFor="featured" className="text-sm font-medium">
              Featured Project
            </label>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error.message}
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={isUpdating} className="flex-1">
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUpdating}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
