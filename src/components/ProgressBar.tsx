"use client";

import { motion, useReducedMotion } from "framer-motion";

type Props = {
  activeIndex: number;
  total: number;
};

export function ProgressBar({ activeIndex, total }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const pct = total <= 1 ? 100 : ((activeIndex + 1) / total) * 100;

  return (
    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <motion.div
        className="h-full rounded-full"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,240,255,1) 0%, rgba(255,45,149,1) 55%, rgba(255,209,102,1) 100%)",
          boxShadow: "0 0 22px rgba(0,240,255,0.22)",
        }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: "easeOut" }}
      />
    </div>
  );
}

