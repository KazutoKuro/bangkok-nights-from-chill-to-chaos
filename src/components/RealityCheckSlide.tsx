"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Card = {
  left: string;
  right: string;
  accent: "cyan" | "pink" | "amber";
};

const CARDS: Card[] = [
  { left: "Quick dinner", right: "3,000 THB gone", accent: "amber" },
  { left: "One drink", right: "5 drinks", accent: "pink" },
  { left: "Go home early", right: "2AM", accent: "cyan" },
];

function accentStyle(accent: Card["accent"]) {
  if (accent === "pink") return "border-[color:var(--neon-pink)]/40 neon-ring-pink";
  if (accent === "amber") return "border-[color:var(--neon-amber)]/30";
  return "border-[color:var(--neon-cyan)]/40 neon-ring";
}

export function RealityCheckSlide() {
  const prefersReducedMotion = useReducedMotion();
  const items = useMemo(() => CARDS, []);

  return (
    <div className="mt-6 grid gap-3 md:grid-cols-3">
      {items.map((c, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.45, delay: prefersReducedMotion ? 0 : idx * 0.08, ease: "easeOut" }}
          className={`glass rounded-2xl border px-4 py-4 ${accentStyle(c.accent)}`}
        >
          <div className="text-sm text-[color:var(--text-muted)]">Expectation</div>
          <div className="mt-1 text-lg font-semibold tracking-tight">
            <span className="neon-hover">{c.left}</span>
          </div>
          <div className="mt-4 text-sm text-[color:var(--text-muted)]">Reality</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight text-[color:var(--text)]">
            {c.right}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

