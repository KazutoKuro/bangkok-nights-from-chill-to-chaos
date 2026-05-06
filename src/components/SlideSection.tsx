"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Slide } from "@/lib/slides";
import { RichText } from "@/components/RichText";
import type { SlideLayout } from "@/lib/slideLayouts";

type Props = {
  slide: Slide;
  images: string[];
  layout?: SlideLayout;
  index: number;
  active: boolean;
  setRef: (el: HTMLElement | null) => void;
  onNext: () => void;
  onPrev: () => void;
};

function titleKicker(slideNumber: number): string {
  if (slideNumber === 1) return "Opening";
  if (slideNumber === 4) return "Level 1";
  if (slideNumber === 5) return "Level 2";
  if (slideNumber === 6) return "Level 3";
  if (slideNumber === 7) return "Level 4";
  if (slideNumber === 13) return "Closing";
  return `Slide ${slideNumber}`;
}

function moodRing(slideNumber: number): string {
  if (slideNumber === 4)
    return "from-[rgba(0,240,255,0.18)] via-transparent to-transparent";
  if (slideNumber === 5)
    return "from-[rgba(255,209,102,0.18)] via-transparent to-transparent";
  if (slideNumber === 6)
    return "from-[rgba(0,240,255,0.14)] via-transparent to-transparent";
  if (slideNumber === 7)
    return "from-[rgba(255,45,149,0.20)] via-transparent to-transparent";
  if (slideNumber === 12)
    return "from-[rgba(0,240,255,0.12)] via-transparent to-transparent";
  return "from-white/10 via-transparent to-transparent";
}

function cleanLine(line: string): string {
  return line.replace(/^[•\-*]\s*/, "").trim();
}

function renderLines(lines: string[]): ReactNode {
  const trimmed = lines.map(cleanLine).filter(Boolean).slice(0, 6);
  if (trimmed.length === 0) return null;

  if (trimmed.length === 1) {
    return (
      <p className="mt-5 text-lg leading-8 text-[color:var(--text-muted)]">
        <RichText text={trimmed[0]} />
      </p>
    );
  }

  return (
    <ul className="mt-5 space-y-2 text-[15px] leading-7 text-[color:var(--text-muted)]">
      {trimmed.map((line, idx) => (
        <li key={idx} className="flex items-start gap-2">
          <span className="mt-[0.58rem] h-1.5 w-1.5 rounded-full bg-white/45" />
          <RichText text={line} />
        </li>
      ))}
    </ul>
  );
}

function transitionPreset(index: number) {
  const preset = index % 4;
  if (preset === 0) {
    return {
      active: { opacity: 1, y: 0, scale: 1 },
      idle: { opacity: 0.55, y: 12, scale: 0.985 },
      transition: { duration: 0.52, ease: "easeOut" as const },
    };
  }
  if (preset === 1) {
    return {
      active: { opacity: 1, x: 0, scale: 1 },
      idle: { opacity: 0.58, x: 18, scale: 0.99 },
      transition: { duration: 0.54, ease: "easeOut" as const },
    };
  }
  if (preset === 2) {
    return {
      active: { opacity: 1, y: 0, scale: 1 },
      idle: { opacity: 0.56, y: -10, scale: 0.986 },
      transition: { duration: 0.5, ease: "easeOut" as const },
    };
  }
  return {
    active: { opacity: 1, x: 0, y: 0, scale: 1 },
    idle: { opacity: 0.6, x: -14, y: 8, scale: 0.99 },
    transition: { duration: 0.56, ease: "easeOut" as const },
  };
}

function TextPanel({ slide, compact }: { slide: Slide; compact?: boolean }) {
  return (
    <div className={compact ? "max-w-xl" : "max-w-2xl"}>
      <div className="flex items-center gap-3">
        <div className="glass inline-flex items-center rounded-full px-3 py-1 text-xs text-[color:var(--text-muted)]">
          {titleKicker(slide.number)}
        </div>
        <div className="h-px flex-1 bg-white/10" />
      </div>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight text-[color:var(--text)] sm:text-5xl">
        <RichText text={slide.title} />
      </h1>
      {renderLines(slide.lines)}
    </div>
  );
}

function ImageTile({
  src,
  alt,
  className,
  zoom = false,
}: {
  src: string;
  alt: string;
  className?: string;
  zoom?: boolean;
}) {
  return (
    <div
      className={
        "relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] " +
        (className ?? "")
      }
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className={"object-cover " + (zoom ? "scale-[1.06]" : "")}
        priority={false}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-black/10" />
    </div>
  );
}

function CarouselMedia({
  images,
  title,
  active,
}: {
  images: string[];
  title: string;
  active: boolean;
}) {
  const safe = images.slice(0, 6);
  const [cursor, setCursor] = useState(0);
  const total = safe.length;

  useEffect(() => {
    if (!active || total < 2) return;
    const timer = window.setInterval(() => {
      setCursor((prev) => (prev + 1) % total);
    }, 2600);
    return () => window.clearInterval(timer);
  }, [active, total]);

  if (total === 0) return null;

  return (
    <div className="space-y-3">
      <div className="glass relative h-[48vh] min-h-[260px] overflow-hidden rounded-3xl border border-white/10">
        <Image
          src={safe[cursor]}
          alt={`${title} image ${cursor + 1}`}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-all duration-500"
          priority={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/10" />
      </div>
      {total > 1 ? (
        <div className="flex items-center gap-2">
          {safe.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Go to media ${i + 1}`}
              onClick={() => setCursor(i)}
              className={
                "h-2 rounded-full transition-all " +
                (cursor === i
                  ? "w-7 bg-[color:var(--neon-cyan)] shadow-[0_0_18px_rgba(0,240,255,0.45)]"
                  : "w-2 bg-white/35 hover:bg-white/55")
              }
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function NavControls({
  onPrev,
  onNext,
}: {
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mt-8 flex items-center gap-3">
      <button
        type="button"
        onClick={onPrev}
        className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-[color:var(--text-muted)] transition-all hover:border-white/20 hover:bg-white/[0.09]"
      >
        <ArrowLeft className="h-4 w-4" />
        Prev
      </button>
      <button
        type="button"
        onClick={onNext}
        className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-[color:var(--text)] transition-all hover:border-[color:var(--neon-cyan)]/50 hover:bg-white/[0.09] hover:shadow-[0_0_24px_rgba(0,240,255,0.14)]"
      >
        Next
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function LayoutFrame({
  slide,
  images,
  layout,
  active,
  onPrev,
  onNext,
}: {
  slide: Slide;
  images: string[];
  layout: SlideLayout;
  active: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  const picked = images.slice(0, 6);
  const hero = picked[0];
  const secondary = picked.slice(1);
  const title = slide.title;

  if (layout === "hero") {
    return (
      <div className="relative min-h-[72vh] overflow-hidden rounded-[2rem] border border-white/10">
        {hero ? (
          <>
            <Image
              src={hero}
              alt={`${title} hero`}
              fill
              sizes="100vw"
              className="object-cover"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/45 to-black/65" />
        )}
        <div className="relative flex min-h-[72vh] items-end p-6 sm:p-10">
          <div className="glass w-full max-w-3xl rounded-3xl px-6 py-6">
            <TextPanel slide={slide} />
            <NavControls onPrev={onPrev} onNext={onNext} />
          </div>
        </div>
      </div>
    );
  }

  if (layout === "split") {
    if (slide.number === 4) {
      return (
        <div className="grid items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <TextPanel slide={slide} />
            <NavControls onPrev={onPrev} onNext={onNext} />
          </div>
          <div className="space-y-3 lg:col-span-7">
            {picked[0] ? (
              <div className="glass relative h-[44vh] min-h-[280px] overflow-hidden rounded-3xl border border-cyan-200/20">
                <Image
                  src={picked[0]}
                  alt={`${title} scenic main`}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                  priority={false}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-cyan-200/10" />
              </div>
            ) : null}
            <div className="grid grid-cols-3 gap-3">
              {picked.slice(1, 4).map((src, idx) => (
                <div
                  key={src}
                  className="relative h-[16vh] min-h-[120px] overflow-hidden rounded-2xl border border-white/10"
                >
                  <Image
                    src={src}
                    alt={`${title} scenic ${idx + 2}`}
                    fill
                    sizes="(min-width: 1024px) 18vw, 33vw"
                    className="object-cover"
                    priority={false}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="grid items-center gap-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <TextPanel slide={slide} />
          <NavControls onPrev={onPrev} onNext={onNext} />
        </div>
        <div className="grid gap-3 lg:col-span-6">
          {picked.slice(0, 2).map((src, idx) => (
            <ImageTile
              key={src}
              src={src}
              alt={`${title} media ${idx + 1}`}
              className="h-[34vh] min-h-[200px]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (layout === "grid") {
    if (slide.number === 5) {
      return (
        <div className="grid items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <TextPanel slide={slide} />
            <NavControls onPrev={onPrev} onNext={onNext} />
          </div>
          <div className="grid grid-cols-2 gap-3 lg:col-span-7 sm:grid-cols-3">
            {picked.slice(0, 6).map((src, idx) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: idx * 0.06,
                  ease: "easeOut",
                }}
                className="group relative h-[23vh] min-h-[150px] overflow-hidden rounded-2xl border border-amber-200/20 bg-black/40"
              >
                <Image
                  src={src}
                  alt={`${title} food ${idx + 1}`}
                  fill
                  sizes="(min-width: 1024px) 22vw, 44vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                  priority={false}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-amber-900/35 via-black/10 to-transparent" />
                <div className="pointer-events-none absolute left-2 top-2 rounded-full border border-amber-100/25 bg-black/35 px-2 py-1 text-[10px] tracking-wide text-amber-100/90">
                  Food Spot
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      );
    }

    if (slide.number === 6) {
      return (
        <div className="grid items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <TextPanel slide={slide} />
            <NavControls onPrev={onPrev} onNext={onNext} />
          </div>
          <div className="grid grid-cols-2 gap-3 lg:col-span-7">
            {picked.slice(0, 4).map((src, idx) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: idx * 0.08,
                  ease: "easeOut",
                }}
                className="group relative h-[26vh] min-h-[170px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition-transform"
              >
                <Image
                  src={src}
                  alt={`${title} social ${idx + 1}`}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover transition-all duration-300 group-hover:scale-[1.04]"
                  priority={false}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-black/0" />
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:shadow-[inset_0_0_40px_rgba(255,45,149,0.32)]" />
                <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/45 px-2 py-1 text-[10px] tracking-wide text-white/90 backdrop-blur-sm">
                  {idx % 2 === 0 ? "Let's go?" : "On my way"}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="relative">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {picked.slice(0, 6).map((src, idx) => (
            <ImageTile
              key={src}
              src={src}
              alt={`${title} gallery ${idx + 1}`}
              className={
                idx % 3 === 0
                  ? "h-[30vh] min-h-[170px]"
                  : "h-[24vh] min-h-[150px]"
              }
            />
          ))}
        </div>
        <div className="glass mt-4 w-full rounded-3xl px-6 py-5 lg:absolute lg:left-6 lg:top-6 lg:mt-0 lg:max-w-xl">
          <TextPanel slide={slide} compact />
          <NavControls onPrev={onPrev} onNext={onNext} />
        </div>
      </div>
    );
  }

  if (layout === "focus") {
    return (
      <div className="relative min-h-[72vh]">
        {hero ? (
          <ImageTile
            src={hero}
            alt={`${title} focus`}
            className="h-[72vh] min-h-[320px]"
            zoom
          />
        ) : (
          <div className="glass h-[72vh] min-h-[320px] rounded-3xl border border-white/10" />
        )}
        <div className="glass absolute inset-x-4 bottom-4 rounded-3xl px-5 py-5 sm:left-6 sm:right-auto sm:w-[min(540px,92%)] sm:px-6">
          <TextPanel slide={slide} compact />
          <NavControls onPrev={onPrev} onNext={onNext} />
        </div>
      </div>
    );
  }

  if (layout === "carousel") {
    return (
      <div className="grid items-center gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <TextPanel slide={slide} />
          <NavControls onPrev={onPrev} onNext={onNext} />
        </div>
        <div className="lg:col-span-7">
          <CarouselMedia images={picked} title={title} active={active} />
        </div>
      </div>
    );
  }

  if (layout === "asym") {
    if (slide.number === 2) {
      return (
        <div className="grid items-center gap-8 lg:grid-cols-12">
          <div className="relative lg:col-span-7">
            {hero ? (
              <div className="relative h-[56vh] min-h-[300px] overflow-hidden rounded-[2rem] border border-white/10">
                <Image
                  src={hero}
                  alt={`${title} main`}
                  fill
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="object-cover"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/5" />
              </div>
            ) : null}

            <div className="absolute -bottom-5 right-3 grid w-[55%] gap-3">
              {secondary.slice(0, 2).map((src, idx) => (
                <div
                  key={src}
                  className={
                    "relative h-[18vh] min-h-[120px] overflow-hidden rounded-2xl border border-white/10 bg-black/35 " +
                    (idx === 0 ? "translate-x-0" : "translate-x-4")
                  }
                >
                  <Image
                    src={src}
                    alt={`${title} layer ${idx + 1}`}
                    fill
                    sizes="(min-width: 1024px) 26vw, 65vw"
                    className="object-cover"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/35 to-black/0" />
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5">
            <TextPanel slide={slide} />
            <NavControls onPrev={onPrev} onNext={onNext} />
          </div>
        </div>
      );
    }

    if (slide.number === 5) {
      return (
        <div className="grid items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <TextPanel slide={slide} />
            <NavControls onPrev={onPrev} onNext={onNext} />
          </div>
          <div className="relative lg:col-span-7">
            {hero ? (
              <div className="relative h-[52vh] min-h-[300px] overflow-hidden rounded-[2rem] border border-amber-200/20">
                <Image
                  src={hero}
                  alt={`${title} food lead`}
                  fill
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="object-cover"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/35 via-black/10 to-transparent" />
              </div>
            ) : null}

            <div className="absolute -bottom-5 right-0 grid w-[64%] gap-3">
              {secondary.slice(0, 3).map((src, idx) => (
                <motion.div
                  key={src}
                  initial={{ opacity: 0, x: 10, rotate: 0 }}
                  animate={{ opacity: 1, x: 0, rotate: idx % 2 === 0 ? -2 : 2 }}
                  transition={{
                    duration: 0.4,
                    delay: idx * 0.06,
                    ease: "easeOut",
                  }}
                  className="relative h-[15vh] min-h-[110px] overflow-hidden rounded-2xl border border-amber-100/20 bg-black/40"
                >
                  <Image
                    src={src}
                    alt={`${title} stack ${idx + 1}`}
                    fill
                    sizes="(min-width: 1024px) 30vw, 72vw"
                    className="object-cover"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/35 to-transparent" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="grid items-center gap-8 lg:grid-cols-12">
        <div className="relative lg:col-span-7">
          {hero ? (
            <ImageTile
              src={hero}
              alt={`${title} feature`}
              className="h-[58vh] min-h-[300px]"
              zoom
            />
          ) : null}
          <div className="mt-3 grid grid-cols-2 gap-3">
            {secondary.slice(0, 2).map((src, idx) => (
              <ImageTile
                key={src}
                src={src}
                alt={`${title} detail ${idx + 1}`}
                className="h-[24vh] min-h-[150px]"
              />
            ))}
          </div>
        </div>
        <div className="lg:col-span-5">
          <TextPanel slide={slide} />
          <NavControls onPrev={onPrev} onNext={onNext} />
        </div>
      </div>
    );
  }

  if (layout === "cards") {
    const isSocialCards = slide.number === 6;
    const labels = isSocialCards
      ? ["Group Chat", "Meetup", "After Work"]
      : ["Quick Night", "One Drink", "Budget"];
    return (
      <div className="grid items-center gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <TextPanel slide={slide} />
          <NavControls onPrev={onPrev} onNext={onNext} />
        </div>
        <div className="grid gap-4 lg:col-span-7 sm:grid-cols-3">
          {picked.slice(0, 3).map((src, idx) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 12, rotate: 0 }}
              animate={{
                opacity: 1,
                y: 0,
                rotate: idx === 1 ? 0 : idx % 2 === 0 ? -3 : 3,
              }}
              transition={{
                duration: 0.45,
                delay: idx * 0.09,
                ease: "easeOut",
              }}
              className="glass relative h-[36vh] min-h-[220px] overflow-hidden rounded-3xl border border-white/10"
            >
              <Image
                src={src}
                alt={`${title} card ${idx + 1}`}
                fill
                sizes="(min-width: 1024px) 24vw, 90vw"
                className="object-cover"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5" />
              <div className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-black/45 px-3 py-1 text-xs tracking-wide text-white/90 backdrop-blur-sm">
                {labels[idx] ?? "Reality"}
              </div>
              {isSocialCards ? (
                <div className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/45 px-2 py-1 text-[10px] tracking-wide text-white/85 backdrop-blur-sm">
                  Online now
                </div>
              ) : (
                <div className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/45 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
                  Expectation vs Reality
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (layout === "timeline") {
    const flow = ["Chill", "Food", "Drinks", "Chaos"];
    const timelineImages = picked.slice(0, 4);
    const leadLine = cleanLine(slide.lines[0] ?? "");
    const showLeadLine =
      Boolean(leadLine) && leadLine.toLowerCase() !== slide.title.toLowerCase();
    const stageSizes = [
      "h-[20vh] min-h-[150px] max-h-[220px] opacity-70 saturate-[0.9]",
      "h-[24vh] min-h-[170px] max-h-[260px]",
      "h-[29vh] min-h-[200px] max-h-[320px]",
      "h-[34vh] min-h-[230px] max-h-[380px] scale-[1.03]",
    ];
    return (
      <div className="space-y-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="glass inline-flex items-center rounded-full px-3 py-1 text-xs text-[color:var(--text-muted)]">
              {titleKicker(slide.number)}
            </div>
            <div className="h-px w-16 bg-white/15 sm:w-24" />
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--text)] sm:text-5xl">
            <RichText text={slide.title} />
          </h1>
          {showLeadLine ? (
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-muted)] sm:text-lg sm:leading-8">
              <RichText text={leadLine} />
            </p>
          ) : null}
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute left-3 right-3 top-[48%] h-[2px] rounded-full bg-gradient-to-r from-cyan-300/85 via-amber-300/75 to-pink-400/85 shadow-[0_0_30px_rgba(0,240,255,0.28),0_0_36px_rgba(255,45,149,0.32)] sm:left-10 sm:right-10" />
          <div className="grid grid-cols-4 items-end gap-3 sm:gap-4">
            {flow.map((label, idx) => {
              const src = timelineImages[idx];
              if (!src) return null;
              const isChaos = idx === 3;
              return (
                <motion.div
                  key={`${label}-${src}`}
                  initial={{ opacity: 0, x: -18, y: 18 }}
                  animate={
                    isChaos
                      ? {
                          opacity: [0.95, 1, 0.95],
                          x: 0,
                          y: [0, -2, 0],
                          scale: [1.03, 1.045, 1.03],
                        }
                      : { opacity: 1, x: 0, y: 0, scale: 1 }
                  }
                  transition={
                    isChaos
                      ? {
                          duration: 2.4,
                          delay: idx * 0.14 + 0.15,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                      : {
                          duration: 0.46,
                          delay: idx * 0.14,
                          ease: "easeOut",
                        }
                  }
                  className="min-w-0"
                >
                  <div
                    className={
                      "group relative overflow-hidden rounded-[1.45rem] border border-white/10 bg-black/35 shadow-[0_20px_45px_rgba(0,0,0,0.38)] " +
                      stageSizes[idx]
                    }
                  >
                    <Image
                      src={src}
                      alt={`${title} ${label.toLowerCase()} stage`}
                      fill
                      sizes="(min-width: 1024px) 22vw, 42vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      priority={false}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/78 via-black/28 to-black/0" />
                    {isChaos ? (
                      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_42px_rgba(255,45,149,0.32)]" />
                    ) : null}
                  </div>
                  <div className="mt-3 text-center text-[11px] tracking-[0.16em] text-white/72">
                    {label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="mx-auto max-w-3xl">
          <NavControls onPrev={onPrev} onNext={onNext} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {hero ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
          <Image
            src={hero}
            alt={`${title} subtle background`}
            fill
            sizes="100vw"
            className="object-cover opacity-[0.16] blur-[1px]"
            priority={false}
          />
          <div className="absolute inset-0 bg-black/65" />
        </div>
      ) : null}
      <div className="relative mx-auto max-w-3xl py-12 sm:py-20">
        <TextPanel slide={slide} />
        <NavControls onPrev={onPrev} onNext={onNext} />
      </div>
    </div>
  );
}

export function SlideSection({
  slide,
  images,
  layout = "minimal",
  index,
  active,
  setRef,
  onNext,
  onPrev,
}: Props) {
  const prefersReducedMotion = useReducedMotion();
  const preset = useMemo(() => transitionPreset(index), [index]);

  const animation = prefersReducedMotion
    ? { opacity: 1, x: 0, y: 0, scale: 1 }
    : active
      ? preset.active
      : preset.idle;

  return (
    <section
      ref={setRef}
      data-slide-index={index}
      className="relative snap-start"
      style={{ minHeight: "100dvh" }}
    >
      <div className="mx-auto flex h-dvh max-w-6xl flex-col justify-center px-5 py-24">
        <div
          className={`absolute inset-0 -z-10 bg-gradient-to-b ${moodRing(slide.number)}`}
        />

        <motion.div
          initial={false}
          animate={animation}
          transition={
            prefersReducedMotion ? { duration: 0 } : preset.transition
          }
        >
          <LayoutFrame
            slide={slide}
            images={images}
            layout={layout}
            active={active}
            onPrev={onPrev}
            onNext={onNext}
          />
        </motion.div>
      </div>
    </section>
  );
}
