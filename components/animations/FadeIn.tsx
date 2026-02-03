"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

interface FadeInProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  once?: boolean;
}

const FadeIn = forwardRef<HTMLDivElement, FadeInProps>(
  (
    {
      children,
      delay = 0,
      duration = 0.5,
      direction = "none",
      distance = 24,
      once = true,
      ...props
    },
    ref
  ) => {
    const getInitialPosition = () => {
      switch (direction) {
        case "up":
          return { y: distance };
        case "down":
          return { y: -distance };
        case "left":
          return { x: distance };
        case "right":
          return { x: -distance };
        default:
          return {};
      }
    };

    const variants: Variants = {
      hidden: {
        opacity: 0,
        ...getInitialPosition(),
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1],
        },
      },
    };

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-100px" }}
        variants={variants}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

FadeIn.displayName = "FadeIn";

export { FadeIn };
export type { FadeInProps };
