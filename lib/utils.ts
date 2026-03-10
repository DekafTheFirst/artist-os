import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { LyricsSection } from "./data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseStructuredLyrics(text: string): LyricsSection[] {
  const sections: LyricsSection[] = [];
  const parts = text.split(/(\[[^\]]+\])/);
  let currentTag: string | null = null;

  for (const part of parts) {
    if (/^\[[^\]]+\]$/.test(part)) {
      currentTag = part.replace(/[\[\]]/g, "");
    } else if (currentTag && part.trim()) {
      sections.push({
        tag: currentTag,
        lines: part.trim().split("\n").filter(Boolean),
      });
      currentTag = null;
    }
  }
  return sections;
}
