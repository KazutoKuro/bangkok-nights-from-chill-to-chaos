"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  activeSlideNumber: number;
};

type BackdropTheme = {
  a: string;
  b: string;
  c: string;
  base: string;
  particlesOpacity: number;
  vignette?: boolean;
  bokeh?: boolean;
  grain?: boolean;
  glitch?: boolean;
  spotlight?: boolean;
  flow?: boolean;
};

function gradientForSlide(slideNumber: number): BackdropTheme {
  if (slideNumber === 1) {
    return {
      a: "rgba(0, 240, 255, 0.20)",
      b: "rgba(255, 45, 149, 0.18)",
      c: "rgba(66, 98, 255, 0.14)",
      base: "linear-gradient(180deg, #05070f 0%, #0a1022 100%)",
      particlesOpacity: 0.28,
      vignette: true,
    };
  }
  if (slideNumber === 2) {
    return {
      a: "rgba(86, 152, 255, 0.18)",
      b: "rgba(0, 221, 255, 0.13)",
      c: "rgba(149, 100, 255, 0.10)",
      base: "linear-gradient(180deg, #071225 0%, #0b1730 100%)",
      particlesOpacity: 0.22,
      vignette: true,
    };
  }
  if (slideNumber === 3) {
    return {
      a: "rgba(120, 128, 144, 0.10)",
      b: "rgba(90, 100, 120, 0.08)",
      c: "rgba(0, 0, 0, 0.05)",
      base: "linear-gradient(180deg, #0c1018 0%, #111625 100%)",
      particlesOpacity: 0.12,
    };
  }
  if (slideNumber === 4) {
    return {
      a: "rgba(0, 240, 255, 0.18)",
      b: "rgba(0, 150, 210, 0.13)",
      c: "rgba(69, 178, 174, 0.10)",
      base: "linear-gradient(180deg, #071626 0%, #0a1f2f 100%)",
      particlesOpacity: 0.16,
    };
  }
  if (slideNumber === 5) {
    return {
      a: "rgba(255, 176, 66, 0.22)",
      b: "rgba(255, 120, 52, 0.16)",
      c: "rgba(255, 210, 120, 0.12)",
      base: "linear-gradient(180deg, #17100d 0%, #28180e 100%)",
      particlesOpacity: 0.24,
      grain: true,
    };
  }
  if (slideNumber === 6) {
    return {
      a: "rgba(180, 89, 255, 0.20)",
      b: "rgba(255, 45, 149, 0.15)",
      c: "rgba(118, 90, 255, 0.12)",
      base: "linear-gradient(180deg, #100b1f 0%, #1a1030 100%)",
      particlesOpacity: 0.22,
      bokeh: true,
    };
  }
  if (slideNumber === 7) {
    return {
      a: "rgba(255, 45, 149, 0.28)",
      b: "rgba(255, 42, 86, 0.22)",
      c: "rgba(126, 72, 255, 0.20)",
      base: "linear-gradient(180deg, #120512 0%, #1b0624 100%)",
      particlesOpacity: 0.32,
      bokeh: true,
      vignette: true,
    };
  }
  if (slideNumber === 8) {
    return {
      a: "rgba(0, 240, 255, 0.16)",
      b: "rgba(255, 186, 78, 0.14)",
      c: "rgba(255, 45, 149, 0.14)",
      base: "linear-gradient(90deg, #0a1728 0%, #22172a 50%, #2a1b12 100%)",
      particlesOpacity: 0.2,
      flow: true,
    };
  }
  if (slideNumber === 9) {
    return {
      a: "rgba(0, 220, 255, 0.16)",
      b: "rgba(255, 46, 134, 0.16)",
      c: "rgba(220, 240, 255, 0.08)",
      base: "linear-gradient(180deg, #070b14 0%, #121826 100%)",
      particlesOpacity: 0.2,
      glitch: true,
      vignette: true,
    };
  }
  if (slideNumber === 10) {
    return {
      a: "rgba(80, 145, 255, 0.14)",
      b: "rgba(95, 110, 140, 0.12)",
      c: "rgba(0, 0, 0, 0.05)",
      base: "linear-gradient(180deg, #0a1220 0%, #131924 100%)",
      particlesOpacity: 0.14,
    };
  }
  if (slideNumber === 11) {
    return {
      a: "rgba(0, 240, 255, 0.16)",
      b: "rgba(255, 45, 149, 0.16)",
      c: "rgba(120, 85, 255, 0.12)",
      base: "linear-gradient(180deg, #0a0d18 0%, #140e24 100%)",
      particlesOpacity: 0.22,
      spotlight: true,
    };
  }
  if (slideNumber === 12) {
    return {
      a: "rgba(48, 115, 255, 0.12)",
      b: "rgba(90, 125, 150, 0.10)",
      c: "rgba(0, 0, 0, 0.05)",
      base: "linear-gradient(180deg, #080d18 0%, #101622 100%)",
      particlesOpacity: 0.12,
    };
  }
  if (slideNumber === 13) {
    return {
      a: "rgba(120, 60, 255, 0.10)",
      b: "rgba(255, 45, 149, 0.08)",
      c: "rgba(0, 240, 255, 0.06)",
      base: "linear-gradient(180deg, #040507 0%, #0a0d12 100%)",
      particlesOpacity: 0.08,
      vignette: true,
    };
  }
  return {
    a: "rgba(0, 240, 255, 0.14)",
    b: "rgba(255, 45, 149, 0.12)",
    c: "rgba(255, 209, 102, 0.08)",
    base: "linear-gradient(180deg, rgba(11,15,26,0.96) 0%, rgba(11,15,26,0.9) 60%, rgba(11,15,26,0.96) 100%)",
    particlesOpacity: 0.24,
  };
}

export function NeonBackdrop({ activeSlideNumber }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const g = useMemo(() => gradientForSlide(activeSlideNumber), [activeSlideNumber]);

  const particles = useMemo(() => {
    const count = 16;
    return Array.from({ length: count }).map((_, i) => {
      const x = (i * 71) % 100;
      const y = (i * 47) % 100;
      const size = 6 + ((i * 13) % 18);
      const delay = (i % 8) * 0.3;
      const duration = 4.8 + (i % 7) * 0.55;
      const tint = i % 3 === 0 ? "var(--neon-pink)" : i % 3 === 1 ? "var(--neon-cyan)" : "var(--neon-amber)";
      return { x, y, size, delay, duration, tint };
    });
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        aria-hidden
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.55, ease: "easeOut" }}
        className="absolute inset-0"
        style={{
          background:
            `radial-gradient(1200px 700px at 20% 18%, ${g.a} 0%, rgba(0,0,0,0) 60%),` +
            `radial-gradient(900px 600px at 82% 22%, ${g.b} 0%, rgba(0,0,0,0) 62%),` +
            `radial-gradient(900px 700px at 55% 92%, ${g.c} 0%, rgba(0,0,0,0) 62%),` +
            g.base,
        }}
      />

      <div aria-hidden className="absolute inset-0" style={{ opacity: g.particlesOpacity }}>
        {particles.map((p, i) => (
          <div
            key={i}
            className="particle absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.tint,
              filter: "blur(0.2px)",
              boxShadow: "0 0 18px rgba(0,0,0,0)",
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {g.vignette ? (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.45) 100%)",
          }}
        />
      ) : null}

      {g.bokeh ? (
        <div aria-hidden className="absolute inset-0">
          <div className="absolute left-[12%] top-[16%] h-28 w-28 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="absolute right-[15%] top-[22%] h-24 w-24 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute bottom-[18%] left-[36%] h-32 w-32 rounded-full bg-violet-500/18 blur-3xl" />
        </div>
      ) : null}

      {g.spotlight ? (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(560px 320px at 50% 30%, rgba(255,255,255,0.12), rgba(0,0,0,0) 70%)",
          }}
        />
      ) : null}

      {g.grain ? (
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 3px)",
          }}
        />
      ) : null}

      {g.glitch ? (
        <motion.div
          aria-hidden
          initial={false}
          animate={{ x: [0, -6, 4, 0], opacity: [0.08, 0.12, 0.08] }}
          transition={{ duration: prefersReducedMotion ? 0 : 2.2, repeat: Infinity }}
          className="absolute inset-0 mix-blend-screen"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,50,120,0.14) 0%, rgba(0,0,0,0) 40%, rgba(0,255,255,0.10) 100%)",
          }}
        />
      ) : null}
    </div>
  );
}
