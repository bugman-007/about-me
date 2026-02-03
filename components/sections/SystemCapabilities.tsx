"use client";

import { Container } from "@/components/layout";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/animations";

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
}

export function SystemCapabilities({ className }: SystemCapabilitiesProps) {
  return (
    <section className={className}>
      <Container>
        <div className="py-20">
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight">
              System Capabilities
            </h2>
            <p className="mt-4 text-muted-foreground">
              Technical expertise and capabilities
            </p>
          </FadeIn>

          <StaggerChildren className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((capability) => (
              <StaggerItem key={capability.title}>
                <div className="rounded-lg border border-border p-6">
                  <h3 className="font-semibold">{capability.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {capability.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </Container>
    </section>
  );
}
