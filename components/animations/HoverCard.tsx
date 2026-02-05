"use client";

import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface HoverCardProps {
  children: React.ReactNode;
  className?: string;
  tilt?: boolean;
}

export function HoverCard({ children, className, tilt = true }: HoverCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) * 2 - 1;
    const py = (y / rect.height) * 2 - 1;
    const max = 6; // deg
    ref.current.style.transform = `perspective(800px) rotateX(${-py * max}deg) rotateY(${px * max}deg) translateY(-2px)`;
  }, [tilt]);

  const onLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "translateY(0)";
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        "relative cursor-pointer rounded-lg border border-border bg-card/70 shadow-sm transition-all duration-200 will-change-transform hover:-translate-y-0.5 hover:shadow-lg",
        // glow border using gradient overlay
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-lg before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100",
        "before:[background:radial-gradient(400px_circle_at_var(--x,50%)_var(--y,50%),hsl(var(--primary)/.15),transparent_40%)]",
        className
      )}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.addEventListener("mousemove", (ev) => {
          const r = el.getBoundingClientRect();
          const x = ((ev.clientX - r.left) / r.width) * 100;
          const y = ((ev.clientY - r.top) / r.height) * 100;
          el.style.setProperty("--x", `${x}%`);
          el.style.setProperty("--y", `${y}%`);
        }, { passive: true });
      }}
    >
      {children}
    </div>
  );
}
