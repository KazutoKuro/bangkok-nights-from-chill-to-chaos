"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Slide } from "@/lib/slides";
import type { SlideImageManifest } from "@/lib/researchImages";
import { NeonBackdrop } from "@/components/NeonBackdrop";
import { ProgressBar } from "@/components/ProgressBar";
import { SlideSection } from "@/components/SlideSection";
import { chooseSlideLayouts } from "@/lib/slideLayouts";

type Props = {
  slides: Slide[];
  imagesBySlide: SlideImageManifest;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function PresentationShell({ slides, imagesBySlide }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  const slideCount = slides.length;
  const layoutSequence = useMemo(
    () => chooseSlideLayouts(slides, imagesBySlide),
    [imagesBySlide, slides],
  );

  const enableWheelSnap = useMemo(() => {
    if (typeof window === "undefined") return false;
    const finePointer = window.matchMedia?.("(pointer: fine)")?.matches ?? false;
    const wide = window.matchMedia?.("(min-width: 1024px)")?.matches ?? false;
    return finePointer && wide;
  }, []);

  const scrollToIndex = useCallback(
    (nextIndex: number) => {
      const idx = clamp(nextIndex, 0, slideCount - 1);
      const el = sectionRefs.current[idx];
      if (!el) return;
      setHasInteracted(true);
      el.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    },
    [prefersReducedMotion, slideCount]
  );

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (!best) return;
        const idx = Number((best.target as HTMLElement).dataset.slideIndex ?? 0);
        if (Number.isFinite(idx)) setActiveIndex(idx);
      },
      { root, threshold: [0.4, 0.55, 0.7] }
    );

    for (const el of sectionRefs.current) {
      if (el) io.observe(el);
    }

    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || target?.isContentEditable) return;

      if (["ArrowDown", "PageDown", " ", "Enter"].includes(e.key)) {
        e.preventDefault();
        scrollToIndex(activeIndex + 1);
      }
      if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        scrollToIndex(activeIndex - 1);
      }
      if (e.key === "Home") {
        e.preventDefault();
        scrollToIndex(0);
      }
      if (e.key === "End") {
        e.preventDefault();
        scrollToIndex(slideCount - 1);
      }
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, scrollToIndex, slideCount]);

  useEffect(() => {
    if (!enableWheelSnap) return;
    const root = containerRef.current;
    if (!root) return;

    let cooldown = 0;
    const onWheel = (e: WheelEvent) => {
      if (prefersReducedMotion) return;
      const now = Date.now();
      if (now < cooldown) return;

      const dy = e.deltaY;
      if (Math.abs(dy) < 18) return;

      e.preventDefault();
      cooldown = now + 520;
      scrollToIndex(activeIndex + (dy > 0 ? 1 : -1));
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, [activeIndex, enableWheelSnap, prefersReducedMotion, scrollToIndex]);

  return (
    <div className="relative flex-1">
      <NeonBackdrop activeSlideNumber={slides[activeIndex]?.number ?? 1} />

      <div className="pointer-events-none fixed inset-x-0 top-0 z-40">
        <div className="mx-auto w-full max-w-6xl px-5 pt-4">
          <div className="flex items-center justify-between gap-3">
            <div className="glass pointer-events-auto flex items-center gap-2 rounded-full px-3 py-2 text-xs text-[color:var(--text-muted)]">
              <span className="text-[color:var(--text)]">Bangkok Nights</span>
              <span className="opacity-60">/</span>
              <span>
                Slide {activeIndex + 1} of {slideCount}
              </span>
            </div>
            <div className="glass pointer-events-auto hidden items-center gap-3 rounded-full px-3 py-2 text-xs text-[color:var(--text-muted)] md:flex">
              <span>Scroll or</span>
              <span className="inline-flex items-center gap-1">
                <ChevronUp className="h-3.5 w-3.5" />
                <ChevronDown className="h-3.5 w-3.5" />
              </span>
              <span>to navigate</span>
            </div>
          </div>
          <ProgressBar activeIndex={activeIndex} total={slideCount} />
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative z-10 h-dvh overflow-y-auto overscroll-contain scroll-smooth snap-y snap-mandatory"
      >
        <a
          href="#slides"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-black/60 focus:px-3 focus:py-2"
        >
          Skip to slides
        </a>

        <div id="slides">
          {slides.map((slide, idx) => (
            <SlideSection
              key={slide.number}
              slide={slide}
              images={imagesBySlide[slide.number] ?? []}
              layout={layoutSequence[idx]}
              index={idx}
              active={idx === activeIndex}
              setRef={(el) => {
                sectionRefs.current[idx] = el;
              }}
              onNext={() => scrollToIndex(idx + 1)}
              onPrev={() => scrollToIndex(idx - 1)}
            />
          ))}
        </div>

        <AnimatePresence>
          {!hasInteracted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="pointer-events-none fixed inset-x-0 bottom-6 z-40"
            >
              <div className="mx-auto max-w-6xl px-5">
                <div className="glass mx-auto flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs text-[color:var(--text-muted)]">
                  <span className="text-[color:var(--neon-cyan)] neon-text">Scroll</span>
                  <span>to start the night</span>
                  <span className="opacity-60">·</span>
                  <span>Arrow keys work too</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
