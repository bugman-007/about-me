"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedHeadingProps {
  text?: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  accent?: boolean;
  children?: React.ReactNode;
}

export function AnimatedHeading({ text, as = "h2", className, accent = true, children }: AnimatedHeadingProps) {
  const reduce = useReducedMotion();
  const Tag = as as any;

  const base = cn(
    "bg-clip-text text-transparent",
    accent
      ? "bg-[linear-gradient(90deg,hsl(var(--foreground))_0%,hsl(var(--primary))_20%,hsl(var(--foreground))_40%)]"
      : "bg-[linear-gradient(90deg,hsl(var(--foreground))_0%,hsl(var(--muted-foreground))_20%,hsl(var(--foreground))_40%)]",
    className
  );

  return (
    <motion.span
      aria-hidden={false}
      className="inline-block"
      animate={reduce ? undefined : { backgroundPositionX: ["0%", "100%", "0%"] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      style={{ backgroundSize: "200% 100%" }}
    >
      <Tag className={base}>{children ?? text}</Tag>
    </motion.span>
  );
}
