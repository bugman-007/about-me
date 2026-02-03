"use client";

import Link from "next/link";
import { Container } from "@/components/layout";
import { FadeIn, SlideUp, StaggerChildren, StaggerItem } from "@/components/animations";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  className?: string;
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
function HeroHeading() {
  return (
    <FadeIn direction="up">
      <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">
        I design AI-powered, data-intensive systems that scale.
      </h1>
    </FadeIn>
  );
}

// Subheading paragraph
function HeroSubheading() {
  return (
    <SlideUp>
      <p className="mt-6 text-pretty text-lg text-muted-foreground">
        Senior engineer focused on distributed systems, AI integration, and platform architecture.
        I build resilient backends, optimized data pipelines, and interfaces that enable actionable intelligence.
      </p>
    </SlideUp>
  );
}

// CTA buttons grouped with staggered motion
function HeroCTAGroup() {
  return (
    <StaggerChildren className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <StaggerItem>
        <Button asChild size="lg">
          <Link href="/projects">View Projects</Link>
        </Button>
      </StaggerItem>
      <StaggerItem>
        <Button asChild variant="outline" size="lg">
          <Link href="#capabilities">System Capabilities</Link>
        </Button>
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

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section className={className}>
      <HeroContainer>
        <HeroHeading />
        <HeroSubheading />
        <HeroCTAGroup />
      </HeroContainer>
    </section>
  );
}
