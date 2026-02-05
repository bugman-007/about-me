"use client";

import { Container } from "@/components/layout";
import { FadeIn } from "@/components/animations";
import { Reveal } from "@/components/animations/Reveal";
import { HoverCard } from "@/components/animations/HoverCard";
import { AnimatedHeading } from "@/components/visual/AnimatedHeading";
import { EditableText } from "@/components/owner/EditableText";
import { EditableJson } from "@/components/owner/EditableJson";
import { useOwner } from "@/context/OwnerContext";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

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
  const initialList: Capability[] = useMemo(() => {
    let arr: Capability[] = capabilities;
    if (settings.capabilities_json) {
      try {
        const parsed = JSON.parse(settings.capabilities_json);
        if (Array.isArray(parsed)) arr = parsed as Capability[];
      } catch {}
    }
    return arr;
  }, [settings.capabilities_json]);

  const [list, setList] = useState<Capability[]>(initialList);

  useEffect(() => {
    setList(initialList);
  }, [initialList]);

  const move = async (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= list.length) return;
    const updated = [...list];
    const tmp = updated[idx];
    updated[idx] = updated[target];
    updated[target] = tmp;
    setList(updated);
    await fetch("/api/settings/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updates: { capabilities_json: JSON.stringify(updated) } }),
    });
  };
  return (
    <section id="capabilities" className={className}>
      <Container>
        <div className="py-20">
          <Reveal>
            <AnimatedHeading as="h2" className="text-4xl font-bold tracking-tight">
              <EditableText
                settingKey="capabilities_title"
                value={title}
                as="span"
              />
            </AnimatedHeading>
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
                  <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                    {capability.description}
                  </p>
                  {isOwner && (
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => move(i, -1)}>Up</Button>
                      <Button size="sm" variant="outline" onClick={() => move(i, 1)}>Down</Button>
                    </div>
                  )}
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
