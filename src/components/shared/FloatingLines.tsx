"use client";

import type { MutableRefObject } from "react";

/**
 * Floating handwritten story sentences — shared by the chapters. Each line
 * fades in/out as the visitor scrolls (driven by the chapter's scrub
 * timeline). One sentence at a time, elegant, mysterious.
 */

export type FloatingLine = { text: string; className: string; sizeClass?: string };

const DEFAULT_SIZE = "text-[clamp(1.6rem,4.2vw,3.2rem)]";

export default function FloatingLines({
  lines,
  lineRefs,
}: {
  lines: FloatingLine[];
  lineRefs: MutableRefObject<(HTMLParagraphElement | null)[]>;
}) {
  return (
    <>
      {lines.map((line, i) => (
        <p
          key={line.text}
          ref={(el) => {
            lineRefs.current[i] = el;
          }}
          className={`story-line pointer-events-none absolute z-20 max-w-[86vw] px-6 font-hand font-semibold leading-tight text-deep drop-shadow-[0_2px_12px_rgba(253,248,242,0.95)] sm:max-w-[60vw] lg:max-w-[44vw] ${line.sizeClass ?? DEFAULT_SIZE} ${line.className}`}
        >
          {line.text}
        </p>
      ))}
    </>
  );
}
