"use client";

import { Container } from "@/components/layout";
import { FadeIn } from "@/components/animations";
import { EditableText } from "@/components/owner/EditableText";

interface AboutSectionProps {
  className?: string;
  settings?: Record<string, string>;
}

export function AboutSection({ className, settings = {} }: AboutSectionProps) {
  const title = settings.about_title ?? "About";
  const body = settings.about_body ?? "";

  return (
    <section className={className}>
      <Container>
        <div className="py-20">
          <FadeIn>
            <EditableText
              settingKey="about_title"
              value={title}
              as="h2"
              className="text-3xl font-bold tracking-tight"
            />
            <EditableText
              settingKey="about_body"
              value={body}
              multiline
              as="p"
              className="mt-4 text-muted-foreground max-w-3xl"
            />
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
