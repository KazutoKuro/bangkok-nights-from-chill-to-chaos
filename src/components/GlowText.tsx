"use client";

import type { ReactNode } from "react";

type Props = {
  variant?: "cyan" | "pink" | "amber";
  children: ReactNode;
};

export function GlowText({ variant = "cyan", children }: Props) {
  const cls =
    variant === "pink"
      ? "neon-text-pink text-[color:var(--neon-pink)]"
      : variant === "amber"
        ? "text-[color:var(--neon-amber)]"
        : "neon-text text-[color:var(--neon-cyan)]";

  return <span className={`${cls} neon-hover`}>{children}</span>;
}

