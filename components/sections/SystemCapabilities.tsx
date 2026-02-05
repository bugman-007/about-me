"use client";

import { Container } from "@/components/layout";
import { FadeIn } from "@/components/animations";
import { Reveal, RevealStagger } from "@/components/animations/Reveal";
import { HoverCard } from "@/components/animations/HoverCard";
import { EditableText } from "@/components/owner/EditableText";
import { EditableJson } from "@/components/owner/EditableJson";
import { useOwner } from "@/context/OwnerContext";

interface Capability {
  title: string;
  description: string;
}

const capabilities: Capability[] = [
  {
    title: "Frontend Architecture",
    description: "Placeholder for frontend architecture capabilities",
  },
  {
    title: "Backend Systems",
    description: "Placeholder for backend systems capabilities",
  },
  {
    title: "DevOps & Infrastructure",
    description: "Placeholder for DevOps and infrastructure capabilities",
  },
  {
    title: "System Design",
    description: "Placeholder for system design capabilities",
  },
];

interface SystemCapabilitiesProps {
  className?: string;
  settings?: Record<string, string>;
}

export function SystemCapabilities({ className, settings = {} }: SystemCapabilitiesProps) {
  const { isOwner } = useOwner();
  const title = settings.capabilities_title ?? "System Capabilities";
  const subtitle = settings.capabilities_subtitle ?? "Technical expertise and capabilities";
  let list: Capability[] = capabilities;
  if (settings.capabilities_json) {
    try {
      const parsed = JSON.parse(settings.capabilities_json);
      if (Array.isArray(parsed)) list = parsed as Capability[];
    } catch {}
  }
  return (
    <section id="capabilities" className={className}>
      <Container>
        <div className="py-20">
          <Reveal>
            <EditableText
              settingKey="capabilities_title"
              value={title}
              as="h2"
              className="text-4xl font-bold tracking-tight"
            />
            <EditableText
              settingKey="capabilities_subtitle"
              value={subtitle}
              as="p"
              className="mt-4 text-muted-foreground"
            />
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((capability, i) => (
              <Reveal key={capability.title} delay={i * 0.06}>
                <HoverCard className="p-6">
                  <h3 className="font-semibold">{capability.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {capability.description}
                  </p>
                </HoverCard>
              </Reveal>
            ))}
          </div>

          {isOwner && (
            <div className="mt-8">
              <p className="mb-2 text-xs text-muted-foreground">Edit capabilities list (JSON)</p>
              <EditableJson
                settingKey="capabilities_json"
                value={settings.capabilities_json}
                className="inline-block"
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
