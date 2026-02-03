"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

interface StaggerChildrenProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  staggerDelay?: number;
  initialDelay?: number;
  once?: boolean;
}

interface StaggerItemProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (custom: { staggerDelay: number; initialDelay: number }) => ({
    opacity: 1,
    transition: {
      delay: custom.initialDelay,
      staggerChildren: custom.staggerDelay,
      delayChildren: custom.initialDelay,
    },
  }),
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const StaggerChildren = forwardRef<HTMLDivElement, StaggerChildrenProps>(
  (
    {
      children,
      staggerDelay = 0.1,
      initialDelay = 0,
      once = true,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-50px" }}
        variants={containerVariants}
        custom={{ staggerDelay, initialDelay }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

StaggerChildren.displayName = "StaggerChildren";

const StaggerItem = forwardRef<HTMLDivElement, StaggerItemProps>(
  ({ children, ...props }, ref) => {
    return (
      <motion.div ref={ref} variants={itemVariants} {...props}>
        {children}
      </motion.div>
    );
  }
);

StaggerItem.displayName = "StaggerItem";

export { StaggerChildren, StaggerItem, itemVariants, containerVariants };
export type { StaggerChildrenProps, StaggerItemProps };
