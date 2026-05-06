import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

function isSafeSegment(seg: string): boolean {
  return /^[a-zA-Z0-9._-]+$/.test(seg);
}

function contentTypeForFile(name: string): string {
  const lower = name.toLowerCase();
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  return "application/octet-stream";
}

export async function GET(
  _req: Request,
  ctx: { params: { folder: string; file: string } },
) {
  const { folder, file } = ctx.params;

  if (!isSafeSegment(folder) || !isSafeSegment(file)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const baseDir = path.join(process.cwd(), "research-images");
  const targetPath = path.join(baseDir, folder, file);
  const resolved = path.resolve(targetPath);
  const resolvedBase = path.resolve(baseDir);

  if (!resolved.startsWith(resolvedBase + path.sep)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const buf = await readFile(resolved);
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": contentTypeForFile(file),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
