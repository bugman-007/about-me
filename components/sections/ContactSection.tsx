"use client";

import { Container } from "@/components/layout";
import { FadeIn } from "@/components/animations";
import { EditableText } from "@/components/owner/EditableText";
import { Mail, Github, Linkedin, Twitter } from "lucide-react";

interface ContactSectionProps {
  className?: string;
  initialSettings?: Record<string, string>;
}

export function ContactSection({ className, initialSettings = {} }: ContactSectionProps) {
  const settings = {
    contact_email: initialSettings.contact_email || "",
    github_url: initialSettings.github_url || "",
    linkedin_url: initialSettings.linkedin_url || "",
    x_url: initialSettings.x_url || "",
  };

  return (
    <section className={className}>
      <Container>
        <div className="py-20">
          <FadeIn>
            <div className="mx-auto max-w-2xl">
              {/* Header with optional edit button */}
              <div className="mb-8">
                <EditableText
                  settingKey="contact_title"
                  value={initialSettings.contact_title ?? "Get in Touch"}
                  as="h2"
                  className="text-3xl font-bold tracking-tight"
                />
                <EditableText
                  settingKey="contact_subtitle"
                  value={initialSettings.contact_subtitle ?? "Interested in working together? Let's connect."}
                  as="p"
                  className="mt-2 text-muted-foreground"
                />
              </div>

              {/* Display + Inline Edit via EditableField */}
              <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <EditableText
                        settingKey="contact_email"
                        value={settings.contact_email}
                        as="p"
                        className="text-base truncate"
                      />
                    </div>
                  </div>

                  {/* GitHub */}
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Github className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground">GitHub</p>
                      <EditableText
                        settingKey="github_url"
                        value={settings.github_url}
                        as="p"
                        className="text-base truncate"
                      />
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Linkedin className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground">LinkedIn</p>
                      <EditableText
                        settingKey="linkedin_url"
                        value={settings.linkedin_url}
                        as="p"
                        className="text-base truncate"
                      />
                    </div>
                  </div>

                  {/* X/Twitter */}
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Twitter className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground">X / Twitter</p>
                      <EditableText
                        settingKey="x_url"
                        value={settings.x_url}
                        as="p"
                        className="text-base truncate"
                      />
                    </div>
                  </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
