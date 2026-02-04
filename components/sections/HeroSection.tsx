"use client";

import Link from "next/link";
import { Container } from "@/components/layout";
import { FadeIn, SlideUp, StaggerChildren, StaggerItem } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/owner/EditableText";
import { useOwner } from "@/context/OwnerContext";

interface HeroSectionProps {
  className?: string;
  settings?: Record<string, string>;
}

// Layout wrapper for hero content
function HeroContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center">
      <HeroBackgroundVisual />
      <Container className="relative z-10 mx-auto max-w-3xl py-20 text-center">
        {children}
      </Container>
    </div>
  );
}

// Strong positioning heading
function HeroHeading({ value }: { value: string }) {
  return (
    <FadeIn direction="up">
      <EditableText
        settingKey="hero_headline"
        value={value}
        as="h1"
        className="text-balance text-4xl font-bold tracking-tight sm:text-6xl"
      />
    </FadeIn>
  );
}

// Subheading paragraph
function HeroSubheading({ value }: { value: string }) {
  return (
    <SlideUp>
      <EditableText
        settingKey="hero_subheadline"
        value={value}
        multiline
        as="p"
        className="mt-6 text-pretty text-lg text-muted-foreground"
      />
    </SlideUp>
  );
}

// CTA buttons grouped with staggered motion
function HeroCTAGroup({
  cta1Label,
  cta1Href,
  cta2Label,
  cta2Href,
}: {
  cta1Label: string;
  cta1Href: string;
  cta2Label: string;
  cta2Href: string;
}) {
  const { isOwner } = useOwner();
  return (
    <StaggerChildren className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <StaggerItem>
        <Button asChild size="lg">
          <Link href={cta1Href}>
            <EditableText settingKey="hero_cta1_label" value={cta1Label} as="span" />
          </Link>
        </Button>
        {isOwner && (
          <div className="mt-1 text-xs text-muted-foreground">
            Link: <EditableText settingKey="hero_cta1_href" value={cta1Href} as="span" />
          </div>
        )}
      </StaggerItem>
      <StaggerItem>
        <Button asChild variant="outline" size="lg">
          <Link href={cta2Href}>
            <EditableText settingKey="hero_cta2_label" value={cta2Label} as="span" />
          </Link>
        </Button>
        {isOwner && (
          <div className="mt-1 text-xs text-muted-foreground">
            Link: <EditableText settingKey="hero_cta2_href" value={cta2Href} as="span" />
          </div>
        )}
      </StaggerItem>
    </StaggerChildren>
  );
}

// Background visual placeholder (subtle gradient/grid)
function HeroBackgroundVisual() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* radial gradient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_60%)]" />
      {/* technical grid */}
      <div
        className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(circle_at_center,black,transparent_75%)] dark:opacity-[0.09]"
      />
      {/* subtle top gradient fade */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background" />
    </div>
  );
}

export function HeroSection({ className, settings = {} }: HeroSectionProps) {
  const headline = settings.hero_headline ?? "I design AI-powered, data-intensive systems that scale.";
  const sub =
    settings.hero_subheadline ??
    "Senior engineer focused on distributed systems, AI integration, and platform architecture. I build resilient backends, optimized data pipelines, and interfaces that enable actionable intelligence.";
  const cta1Label = settings.hero_cta1_label ?? "View Projects";
  const cta1Href = settings.hero_cta1_href ?? "/projects";
  const cta2Label = settings.hero_cta2_label ?? "System Capabilities";
  const cta2Href = settings.hero_cta2_href ?? "#capabilities";
  return (
    <section className={className}>
      <HeroContainer>
        <HeroHeading value={headline} />
        <HeroSubheading value={sub} />
        <HeroCTAGroup
          cta1Label={cta1Label}
          cta1Href={cta1Href}
          cta2Label={cta2Label}
          cta2Href={cta2Href}
        />
      </HeroContainer>
    </section>
  );
}
