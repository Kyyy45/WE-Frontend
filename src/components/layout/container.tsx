"use client";

import { motion, HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

type ContainerSize = "default" | "narrow" | "wide";

interface ContainerProps extends HTMLMotionProps<"div"> {
  size?: ContainerSize;
}

export function Container({
  size = "default",
  className,
  children,
  ...props
}: ContainerProps) {
  const sizeMap: Record<ContainerSize, string> = {
    default: "max-w-360",
    narrow: "max-w-270",
    wide: "max-w-400",
  };

  return (
    <motion.div
      {...props}
      className={cn("mx-auto w-full px-6 lg:px-12", sizeMap[size], className)}
    >
      {children}
    </motion.div>
  );
}
