"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

interface SlideUpProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
}

const SlideUp = forwardRef<HTMLDivElement, SlideUpProps>(
  (
    {
      children,
      delay = 0,
      duration = 0.6,
      distance = 50,
      once = true,
      ...props
    },
    ref
  ) => {
    const variants: Variants = {
      hidden: {
        opacity: 0,
        y: distance,
      },
      visible: {
        opacity: 1,
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
        viewport={{ once, margin: "-50px" }}
        variants={variants}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

SlideUp.displayName = "SlideUp";

export { SlideUp };
export type { SlideUpProps };
