"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Soft animated gradient blobs */}
      <motion.div
        className="absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(59,130,246,0.35), transparent)" }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -20, 30, 0],
          scale: [1, 1.05, 0.98, 1],
          opacity: [0.6, 0.7, 0.65, 0.6],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute -bottom-24 -right-24 h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(168,85,247,0.25), transparent)" }}
        animate={{
          x: [0, -30, 15, 0],
          y: [0, 20, -25, 0],
          scale: [1, 0.97, 1.06, 1],
          opacity: [0.5, 0.6, 0.55, 0.5],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle animated grid overlay */}
      <motion.div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.25) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        animate={{ backgroundPositionX: [0, 40, 0], backgroundPositionY: [0, 40, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      {/* Top gradient fade for readability */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background" />
    </div>
  );
}
