"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

type Option = {
  key: string;
  label: string;
  emoji: string;
  desc: string;
};

const OPTIONS: Option[] = [
  { key: "home", emoji: "🛋", label: "Stay home", desc: "Your bed has the best vibes." },
  { key: "food", emoji: "🍜", label: "Food hunter", desc: "One snack becomes a buffet." },
  { key: "chill", emoji: "🍻", label: "Chill drinker", desc: "Just one drink. Probably." },
  { key: "party", emoji: "🔥", label: "Party animal", desc: "Plans dissolve at midnight." },
];

export function PollSlide() {
  const [selected, setSelected] = useState<string | null>(null);
  const selection = useMemo(() => OPTIONS.find((o) => o.key === selected) ?? null, [selected]);

  return (
    <div className="mt-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {OPTIONS.map((o) => {
          const active = selected === o.key;
          return (
            <motion.button
              key={o.key}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(o.key)}
              className={
                "glass group flex items-start gap-3 rounded-2xl px-4 py-4 text-left transition-colors " +
                (active
                  ? "border-[color:var(--neon-cyan)]/60 neon-ring"
                  : "hover:border-white/20 hover:bg-white/[0.09]")
              }
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg">
                {o.emoji}
              </div>
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-[color:var(--text)]">{o.label}</div>
                  <div
                    className={
                      "h-2.5 w-2.5 rounded-full transition-all " +
                      (active ? "bg-[color:var(--neon-cyan)] shadow-[0_0_16px_rgba(0,240,255,0.4)]" : "bg-white/15")
                    }
                  />
                </div>
                <div className="mt-1 text-sm leading-6 text-[color:var(--text-muted)]">{o.desc}</div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: selection ? 1 : 0, y: selection ? 0 : 10 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mt-4"
      >
        {selection ? (
          <div className="glass rounded-2xl px-4 py-4">
            <div className="text-sm text-[color:var(--text-muted)]">Tonight you are:</div>
            <div className="mt-1 text-lg font-semibold tracking-tight">
              <span className="neon-hover">{selection.emoji}</span> {selection.label}
            </div>
            <div className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">
              No HR judging. But Bangkok might.
            </div>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}

