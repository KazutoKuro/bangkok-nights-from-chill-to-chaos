"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  children: ReactNode;
  delay?: number;
};

export function TypeReveal({ children, delay = 0 }: Props) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.span
      className="inline-block"
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0.3, clipPath: "inset(0 100% 0 0)" }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, clipPath: "inset(0 0% 0 0)" }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.85, delay: prefersReducedMotion ? 0 : delay, ease: "easeOut" }}
    >
      {children}
    </motion.span>
  );
}

