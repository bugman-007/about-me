"use client";

import { motion, useReducedMotion } from "framer-motion";

export function AnimatedBackground() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* gradient blobs */}
      <motion.div
        className="absolute -top-40 -left-32 h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(59,130,246,0.28), transparent)" }}
        animate={reduce ? undefined : { x: [0, 40, -20, 0], y: [0, -20, 30, 0], scale: [1, 1.05, 0.98, 1], opacity: [0.5, 0.65, 0.6, 0.5] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-24 h-[30rem] w-[30rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(168,85,247,0.22), transparent)" }}
        animate={reduce ? undefined : { x: [0, -30, 15, 0], y: [0, 20, -25, 0], scale: [1, 0.97, 1.06, 1], opacity: [0.4, 0.55, 0.45, 0.4] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* faint grid overlay */}
      <motion.div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(127,127,127,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(127,127,127,0.3) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
        animate={reduce ? undefined : { backgroundPositionX: [0, 44, 0], backgroundPositionY: [0, 44, 0] }}
        transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
      />

      {/* noise overlay */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay [background-image:url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%\' height=\'100%\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\' opacity=\'0.12\'/></svg>')]" />

      {/* top gradient for readability */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background" />
    </div>
  );
}
