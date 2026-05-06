import type { Slide } from "@/lib/slides";
import type { SlideImageManifest } from "@/lib/researchImages";

export type SlideLayout =
  | "hero"
  | "split"
  | "grid"
  | "cards"
  | "timeline"
  | "focus"
  | "carousel"
  | "asym"
  | "minimal";

const LAYOUTS: SlideLayout[] = [
  "hero",
  "split",
  "grid",
  "cards",
  "timeline",
  "focus",
  "carousel",
  "asym",
  "minimal",
];

const FIXED_LAYOUT_BY_SLIDE: Partial<Record<number, SlideLayout>> = {
  2: "asym",
  4: "focus",
  5: "asym",
  6: "cards",
  8: "timeline",
  9: "cards",
};

function byImageCount(count: number): SlideLayout[] {
  if (count <= 0) return ["minimal", "focus", "hero"];
  if (count === 1) return ["focus", "hero", "split"];
  if (count === 2) return ["split", "focus", "asym"];
  if (count === 3) return ["cards", "asym", "grid"];
  if (count <= 4) return ["grid", "split", "carousel", "cards"];
  return ["carousel", "grid", "asym"];
}

function bySlideMood(slideNumber: number): SlideLayout[] {
  if (slideNumber === 1) return ["hero", "focus", "split"];
  if (slideNumber === 2) return ["split", "hero", "focus"];
  if (slideNumber === 3) return ["minimal", "split", "focus"];
  if (slideNumber === 4) return ["minimal", "focus", "hero"];
  if (slideNumber === 5) return ["carousel", "grid", "split"];
  if (slideNumber === 6) return ["split", "focus", "grid"];
  if (slideNumber === 7) return ["asym", "carousel", "grid"];
  if (slideNumber === 8) return ["timeline", "carousel", "split"];
  if (slideNumber === 9) return ["split", "grid", "focus"];
  if (slideNumber === 10) return ["focus", "split", "minimal"];
  if (slideNumber === 11) return ["asym", "split", "focus"];
  if (slideNumber === 12) return ["minimal", "hero", "focus"];
  if (slideNumber === 13) return ["hero", "focus", "minimal"];
  return LAYOUTS;
}

function rankLayouts(slideNumber: number, imageCount: number): SlideLayout[] {
  const mood = bySlideMood(slideNumber);
  const count = byImageCount(imageCount);
  const ranked = [...mood, ...count, ...LAYOUTS];
  return Array.from(new Set(ranked));
}

export function chooseSlideLayouts(
  slides: Slide[],
  imagesBySlide: SlideImageManifest,
): SlideLayout[] {
  const assigned: SlideLayout[] = [];

  for (const slide of slides) {
    const imageCount = Math.min(imagesBySlide[slide.number]?.length ?? 0, 6);
    const fixedLayout = FIXED_LAYOUT_BY_SLIDE[slide.number];
    if (fixedLayout) {
      assigned.push(fixedLayout);
      continue;
    }

    const ranked = rankLayouts(slide.number, imageCount);
    const prev = assigned[assigned.length - 1];

    const next =
      ranked.find((layout) => layout !== prev) ??
      LAYOUTS.find((layout) => layout !== prev) ??
      "minimal";

    assigned.push(next);
  }

  return assigned;
}
