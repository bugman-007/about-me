"use client";

import { Container } from "@/components/layout";
import { Reveal } from "@/components/animations/Reveal";
import { EditableText } from "@/components/owner/EditableText";

interface AboutSectionProps {
  className?: string;
  settings?: Record<string, string>;
}

export function AboutSection({ className, settings = {} }: AboutSectionProps) {
  const title = settings.about_title ?? "About";
  const body = settings.about_body ?? "";

  return (
    <section id="about" className={className}>
      <Container>
        <div className="py-20">
          <Reveal>
            <EditableText
              settingKey="about_title"
              value={title}
              as="h2"
              className="text-4xl font-bold tracking-tight"
            />
            <EditableText
              settingKey="about_body"
              value={body}
              multiline
              as="p"
              className="mt-4 max-w-3xl text-muted-foreground"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
