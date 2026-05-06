import { readdir } from "node:fs/promises";
import path from "node:path";

export type SlideImageManifest = Record<number, string[]>;

function isSafeSegment(seg: string): boolean {
  return /^[a-zA-Z0-9._-]+$/.test(seg);
}

function isAllowedImageFile(name: string): boolean {
  const lower = name.toLowerCase();
  return (
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".png") ||
    lower.endsWith(".webp") ||
    lower.endsWith(".gif")
  );
}

export async function loadSlideImageManifest(): Promise<SlideImageManifest> {
  const baseDir = path.join(process.cwd(), "research-images");
  const entries = await readdir(baseDir, { withFileTypes: true });

  const manifest: SlideImageManifest = {};

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const folder = entry.name;
    const match = folder.match(/^slide-(\d+)-imgs$/i);
    if (!match) continue;

    const slideNumber = Number(match[1]);
    const folderPath = path.join(baseDir, folder);
    const files = await readdir(folderPath, { withFileTypes: true });

    const urls = files
      .filter((f) => f.isFile())
      .map((f) => f.name)
      .filter((name) => isSafeSegment(name) && isAllowedImageFile(name))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((file) => `/research-images/${folder}/${file}`);

    if (urls.length > 0) manifest[slideNumber] = urls;
  }

  return manifest;
}

