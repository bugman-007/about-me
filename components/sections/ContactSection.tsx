"use client";

import { useState } from "react";
import { Container } from "@/components/layout";
import { FadeIn } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOwner } from "@/context/OwnerContext";
import { toast } from "@/lib/toast";
import { Pencil, Mail, Github, Linkedin, Twitter, X, Save } from "lucide-react";

interface ContactSectionProps {
  className?: string;
  initialSettings?: Record<string, string>;
}

export function ContactSection({ className, initialSettings = {} }: ContactSectionProps) {
  const { isOwner } = useOwner();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize with provided settings or defaults
  const [settings, setSettings] = useState({
    contact_email: initialSettings.contact_email || "",
    github_url: initialSettings.github_url || "",
    linkedin_url: initialSettings.linkedin_url || "",
    x_url: initialSettings.x_url || "",
  });

  // Form state (only used during editing)
  const [formData, setFormData] = useState(settings);

  const handleEdit = () => {
    setFormData(settings);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(settings);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const response = await fetch("/api/settings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates: formData }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save settings");
      }

      // Update local state
      setSettings(formData);
      setIsEditing(false);
      toast.success("Contact settings saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <section className={className}>
      <Container>
        <div className="py-20">
          <FadeIn>
            <div className="mx-auto max-w-2xl">
              {/* Header with optional edit button */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">
                    Get in Touch
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Interested in working together? Let&apos;s connect.
                  </p>
                </div>
                {isOwner && !isEditing && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleEdit}
                    className="shrink-0"
                    title="Edit contact settings"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Edit Form (only visible when editing) */}
              {isEditing ? (
                <div className="space-y-6 rounded-lg border border-border bg-card p-6">
                  <div className="space-y-4">
                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="contact_email">Email Address</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.contact_email}
                        onChange={(e) =>
                          handleInputChange("contact_email", e.target.value)
                        }
                      />
                    </div>

                    {/* GitHub */}
                    <div className="space-y-2">
                      <Label htmlFor="github_url">GitHub URL</Label>
                      <Input
                        id="github_url"
                        type="url"
                        placeholder="https://github.com/username"
                        value={formData.github_url}
                        onChange={(e) =>
                          handleInputChange("github_url", e.target.value)
                        }
                      />
                    </div>

                    {/* LinkedIn */}
                    <div className="space-y-2">
                      <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                      <Input
                        id="linkedin_url"
                        type="url"
                        placeholder="https://linkedin.com/in/username"
                        value={formData.linkedin_url}
                        onChange={(e) =>
                          handleInputChange("linkedin_url", e.target.value)
                        }
                      />
                    </div>

                    {/* X/Twitter (optional) */}
                    <div className="space-y-2">
                      <Label htmlFor="x_url">X / Twitter URL (Optional)</Label>
                      <Input
                        id="x_url"
                        type="url"
                        placeholder="https://x.com/username"
                        value={formData.x_url}
                        onChange={(e) =>
                          handleInputChange("x_url", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 justify-end pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isSaving}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              ) : (
                /* Display Mode */
                <div className="space-y-6">
                  {/* Email */}
                  {settings.contact_email && (
                    <a
                      href={`mailto:${settings.contact_email}`}
                      className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:bg-accent transition-colors group"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-muted-foreground">
                          Email
                        </p>
                        <p className="text-base truncate group-hover:text-primary transition-colors">
                          {settings.contact_email}
                        </p>
                      </div>
                    </a>
                  )}

                  {/* GitHub */}
                  {settings.github_url && (
                    <a
                      href={settings.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:bg-accent transition-colors group"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Github className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-muted-foreground">
                          GitHub
                        </p>
                        <p className="text-base truncate group-hover:text-primary transition-colors">
                          {settings.github_url.replace(/^https?:\/\//, "")}
                        </p>
                      </div>
                    </a>
                  )}

                  {/* LinkedIn */}
                  {settings.linkedin_url && (
                    <a
                      href={settings.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:bg-accent transition-colors group"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Linkedin className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-muted-foreground">
                          LinkedIn
                        </p>
                        <p className="text-base truncate group-hover:text-primary transition-colors">
                          {settings.linkedin_url.replace(/^https?:\/\//, "")}
                        </p>
                      </div>
                    </a>
                  )}

                  {/* X/Twitter */}
                  {settings.x_url && (
                    <a
                      href={settings.x_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:bg-accent transition-colors group"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Twitter className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-muted-foreground">
                          X / Twitter
                        </p>
                        <p className="text-base truncate group-hover:text-primary transition-colors">
                          {settings.x_url.replace(/^https?:\/\//, "")}
                        </p>
                      </div>
                    </a>
                  )}

                  {/* Empty state */}
                  {!settings.contact_email && !settings.github_url && !settings.linkedin_url && !settings.x_url && (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No contact information available.</p>
                      {isOwner && (
                        <p className="text-sm mt-2">Click the edit button to add your contact details.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
