"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Container } from "./Container";
import { ThemeToggle } from "./ThemeToggle";
import { EditableImageUrl } from "@/components/owner/EditableImageUrl";
import { useOwner } from "@/context/OwnerContext";
import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

interface NavbarProps {
  className?: string;
  settings?: Record<string, string>;
}

export function Navbar({ className, settings = {} }: NavbarProps) {
  const { isOwner } = useOwner();
  const avatarUrl = settings.navbar_avatar_url || "";
  const { scrollYProgress } = useScroll();
  const [active, setActive] = useState<string>("home");

  useEffect(() => {
    const sections = ["home", "projects", "about", "contact"]; 
    const obs = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActive(visible.target.id);
    }, { rootMargin: "-20% 0px -60% 0px", threshold: [0.25, 0.5, 0.75] });

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      {/* scroll progress bar only */}
      <motion.div
        className="absolute inset-x-0 top-0 h-1 rounded-b-full bg-primary/40"
        style={{ scaleX: scrollYProgress, transformOrigin: "0% 50%" }}
      />
      <Container>
        <nav className="flex h-20 items-center justify-between">
          {/* Logo / Brand */}
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full border border-border bg-muted ring-1 ring-border/50 before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:opacity-0 before:transition-opacity hover:before:opacity-100 before:[background:radial-gradient(120px_circle_at_var(--x,50%)_var(--y,50%),hsl(var(--primary)/.25),transparent_40%)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full" />
              )}
              {isOwner && (
                <EditableImageUrl settingKey="navbar_avatar_url" value={avatarUrl} />
              )}
            </div>
            <Link
              href="/"
              className="text-2xl font-semibold tracking-tight transition-colors hover:text-primary"
            >
              Portfolio
            </Link>
          </div>

          {/* Navigation Links */}
          <ul className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "text-lg font-medium transition-colors",
                    active === item.label.toLowerCase() ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {/* Mobile menu placeholder */}
            <button
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
              aria-label="Toggle navigation menu"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </nav>
      </Container>
    </header>
  );
}
