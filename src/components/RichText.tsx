"use client";

import { Fragment } from "react";
import { GlowText } from "@/components/GlowText";

type Props = {
  text: string;
};

type Token = { type: "plain"; value: string } | { type: "glow"; value: string; variant: "cyan" | "pink" | "amber" };

function tokenize(input: string): Token[] {
  const patterns: Array<{ re: RegExp; variant: "cyan" | "pink" | "amber" }> = [
    { re: /\bChaos\b/g, variant: "pink" },
    { re: /\bNight\b/g, variant: "cyan" },
    { re: /\bLevel 4\b/g, variant: "pink" },
    { re: /\bBangkok\b/g, variant: "amber" },
  ];

  let tokens: Token[] = [{ type: "plain", value: input }];

  for (const p of patterns) {
    const next: Token[] = [];
    for (const t of tokens) {
      if (t.type !== "plain") {
        next.push(t);
        continue;
      }
      const s = t.value;
      let last = 0;
      let match: RegExpExecArray | null;
      const re = new RegExp(p.re.source, p.re.flags);
      while ((match = re.exec(s))) {
        const start = match.index;
        const end = start + match[0].length;
        if (start > last) next.push({ type: "plain", value: s.slice(last, start) });
        next.push({ type: "glow", value: match[0], variant: p.variant });
        last = end;
      }
      if (last < s.length) next.push({ type: "plain", value: s.slice(last) });
    }
    tokens = next;
  }

  return tokens;
}

export function RichText({ text }: Props) {
  const tokens = tokenize(text);
  return (
    <>
      {tokens.map((t, i) => (
        <Fragment key={i}>
          {t.type === "plain" ? t.value : <GlowText variant={t.variant}>{t.value}</GlowText>}
        </Fragment>
      ))}
    </>
  );
}

