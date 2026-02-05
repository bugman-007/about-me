"use client";

import { Container } from "@/components/layout";
import { Reveal } from "@/components/animations/Reveal";
import { AnimatedHeading } from "@/components/visual/AnimatedHeading";
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
          <div className="grid items-start gap-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <Reveal>
                <AnimatedHeading as="h2" className="text-4xl font-bold tracking-tight text-balance">
                  <EditableText settingKey="about_title" value={title} as="span" />
                </AnimatedHeading>
              </Reveal>
            </div>
            <div className="md:col-span-8">
              <Reveal>
                <EditableText
                  settingKey="about_body"
                  value={body}
                  multiline
                  as="p"
                  className="max-w-2xl whitespace-pre-line leading-relaxed text-muted-foreground"
                />
              </Reveal>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
