"use client";

import Link from "next/link";
import { Container } from "@/components/layout";
import { FadeIn, SlideUp, StaggerChildren, StaggerItem } from "@/components/animations";
import { Reveal, RevealStagger } from "@/components/animations/Reveal";
import { motion } from "framer-motion";
import { AnimatedHeading } from "@/components/visual/AnimatedHeading";
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
function Badge() {
  return (
    <div>
      <div className="mx-auto mb-4 mr-4 inline-flex items-center rounded-full border border-border bg-background/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
        AI/ML Systems Engineer
      </div>
      <div className="mx-auto mb-4 ml-4 inline-flex items-center rounded-full border border-border bg-background/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
        Backend Engineer
      </div>
    </div>
  );
}

function HeroHeading({ value }: { value: string }) {
  return (
    <Reveal>
      <div>
        <Badge />
        <AnimatedHeading as="h1" className="text-balance text-5xl font-bold tracking-tight sm:text-6xl">
          <EditableText
            settingKey="hero_headline"
            value={value}
            as="span"
            className="whitespace-pre-line"
          />
        </AnimatedHeading>
      </div>
    </Reveal>
  );
}

// Subheading paragraph
function HeroSubheading({ value }: { value: string }) {
  return (
    <Reveal delay={0.1}>
      <EditableText
        settingKey="hero_subheadline"
        value={value}
        multiline
        as="p"
        className="mt-6 text-pretty text-lg text-muted-foreground whitespace-pre-line"
      />
    </Reveal>
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
    <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <RevealStagger>
        <div>
          <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <Button asChild size="lg">
              <Link href={cta1Href}>
                <EditableText settingKey="hero_cta1_label" value={cta1Label} as="span" />
              </Link>
            </Button>
          </motion.div>
          {isOwner && (
            <div className="mt-1 text-xs text-muted-foreground">
              Link: <EditableText settingKey="hero_cta1_href" value={cta1Href} as="span" />
            </div>
          )}
        </div>
        <div>
          <Button asChild variant="outline" size="lg" className="group">
            <Link href={cta2Href}>
              <EditableText settingKey="hero_cta2_label" value={cta2Label} as="span" />
              <span className="ml-2 transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </Button>
          {isOwner && (
            <div className="mt-1 text-xs text-muted-foreground">
              Link: <EditableText settingKey="hero_cta2_href" value={cta2Href} as="span" />
            </div>
          )}
        </div>
      </RevealStagger>
    </div>
  );
}

// Background visual placeholder (subtle gradient/grid)
function HeroBackgroundVisual() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* cleaned hero-specific layer kept subtle, global animated bg handles motion */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background" />
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
    <section id="home" className={className}>
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
