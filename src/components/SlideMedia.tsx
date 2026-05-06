"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: string[];
  title: string;
};

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export function SlideMedia({ images, title }: Props) {
  const hasMany = images.length >= 5;
  const [page, setPage] = useState(0);

  const pages = useMemo(() => {
    if (!hasMany) return [images];
    return chunk(images, 4);
  }, [hasMany, images]);

  const current = pages[Math.min(page, pages.length - 1)] ?? [];

  if (images.length === 0) {
    return (
      <div className="glass flex h-full min-h-[260px] items-center justify-center rounded-3xl border border-white/10 px-6 py-6 text-sm text-[color:var(--text-muted)]">
        No images for this slide.
      </div>
    );
  }

  const gridCols =
    current.length <= 1
      ? "grid-cols-1"
      : current.length === 2
        ? "grid-cols-2"
        : "grid-cols-2";
  const gridRows =
    current.length <= 2
      ? "auto-rows-[minmax(160px,1fr)]"
      : "auto-rows-[minmax(140px,1fr)]";

  return (
    <div className="relative">
      <div className={`grid gap-3 ${gridCols} ${gridRows}`}>
        {current.map((src, idx) => (
          <motion.div
            key={src}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: idx * 0.06 }}
            className="glass relative min-h-[200px] overflow-hidden rounded-3xl border border-white/10"
          >
            <div className="absolute inset-0">
              <Image
                src={src}
                alt={`${title} image ${idx + 1}`}
                fill
                sizes="(min-width: 1024px) 520px, 90vw"
                className="object-cover"
                priority={false}
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/10" />
          </motion.div>
        ))}
      </div>

      {hasMany ? (
        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className={
              "glass inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs text-[color:var(--text-muted)] transition-all " +
              (page === 0
                ? "opacity-50"
                : "hover:border-white/20 hover:bg-white/[0.09]")
            }
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>

          <div className="glass rounded-full px-3 py-2 text-xs text-[color:var(--text-muted)]">
            {page + 1} / {pages.length}
          </div>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pages.length - 1, p + 1))}
            disabled={page >= pages.length - 1}
            className={
              "glass inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs text-[color:var(--text-muted)] transition-all " +
              (page >= pages.length - 1
                ? "opacity-50"
                : "hover:border-white/20 hover:bg-white/[0.09]")
            }
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
