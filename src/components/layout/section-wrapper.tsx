"use client";

import { motion, HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

interface SectionWrapperProps extends HTMLMotionProps<"section"> {
  delay?: number;
}

export function SectionWrapper({
  children,
  className,
  delay = 0,
  ...props
}: SectionWrapperProps) {
  return (
    <motion.section
      {...props}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
        delay,
      }}
      className={cn(className)}
    >
      {children}
    </motion.section>
  );
}
