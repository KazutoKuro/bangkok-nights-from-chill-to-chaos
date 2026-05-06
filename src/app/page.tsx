import { PresentationShell } from "@/components/PresentationShell";
import { loadSlideImageManifest } from "@/lib/researchImages";
import { loadSlidesFromResearch } from "@/lib/slides";

export default async function Home() {
  const [slides, imagesBySlide] = await Promise.all([
    loadSlidesFromResearch(),
    loadSlideImageManifest(),
  ]);

  return <PresentationShell slides={slides} imagesBySlide={imagesBySlide} />;
}
