import { readFile } from "node:fs/promises";
import path from "node:path";

export type Slide = {
  number: number;
  header: string;
  title: string;
  rawBody: string;
  lines: string[];
};

function normalizeLine(line: string): string {
  return line.replace(/\r/g, "").trimEnd();
}

function parseSlidesFromText(text: string): Slide[] {
  const lines = text.split("\n").map(normalizeLine);
  const slides: Slide[] = [];

  const headerRe = /^\s*(?:[\u{1F300}-\u{1FAFF}]\s*)?SLIDE\s+(\d+)\s+—\s*(.+)\s*$/iu;

  let current:
    | {
        number: number;
        header: string;
        headerTitle: string;
        bodyLines: string[];
      }
    | undefined;

  const flush = () => {
    if (!current) return;
    const bodyLines = current.bodyLines;
    const firstMeaningful =
      bodyLines.find((l) => {
        const t = l.trim();
        if (t.length === 0) return false;
        if (/^(script|subtitle)\s*:/i.test(t)) return false;
        return true;
      }) ?? "";
    const title = (firstMeaningful || current.headerTitle || `Slide ${current.number}`).trim();
    const rawBody = bodyLines.join("\n").trim();
    const cleanedLines = bodyLines
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !/^#+$/.test(l));

    slides.push({
      number: current.number,
      header: current.header,
      title,
      rawBody,
      lines: cleanedLines,
    });
  };

  for (const line of lines) {
    const match = line.match(headerRe);
    if (match) {
      flush();
      const number = Number(match[1]);
      const headerTitle = match[2]?.trim() ?? "";
      current = {
        number,
        header: line.trim(),
        headerTitle,
        bodyLines: [],
      };
      continue;
    }
    if (!current) continue;
    current.bodyLines.push(line);
  }

  flush();
  return slides.sort((a, b) => a.number - b.number);
}

export async function loadSlidesFromResearch(): Promise<Slide[]> {
  const filePath = path.join(process.cwd(), "research", "documents");
  const text = await readFile(filePath, "utf8");
  const slides = parseSlidesFromText(text);
  if (slides.length === 0) {
    throw new Error("No slides found in /research/documents");
  }
  return slides;
}
