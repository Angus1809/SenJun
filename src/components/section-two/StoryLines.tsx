"use client";

import FloatingLines, { type FloatingLine } from "@/components/shared/FloatingLines";
import type { MutableRefObject } from "react";

/**
 * Chapter Two story — floating handwritten sentences. Each one fades in as
 * the visitor scrolls, one at a time, telling the story of two journeys
 * meeting. SenJun, Senior and Junior are never mentioned yet — everything
 * stays mysterious.
 */

export const STORY_LINES: FloatingLine[] = [
  { text: "Every journey begins somewhere.", className: "left-[6%] top-[30%] text-left" },
  { text: "Some journeys begin alone.", className: "right-[6%] top-[38%] text-right" },
  { text: "But the most beautiful ones…", className: "left-[8%] top-[46%] text-left" },
  { text: "…find someone walking beside them.", className: "right-[6%] top-[54%] text-right" },
  { text: "And sometimes…", className: "left-[10%] top-[62%] text-left" },
  {
    text: "…they discover a place that feels like home.",
    className: "inset-x-0 top-[38%] text-center",
  },
];

export default function StoryLines({
  lineRefs,
}: {
  lineRefs: MutableRefObject<(HTMLParagraphElement | null)[]>;
}) {
  return <FloatingLines lines={STORY_LINES} lineRefs={lineRefs} />;
}
