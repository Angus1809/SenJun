"use client";

import { useLayoutEffect, useRef } from "react";
import Butterfly from "@/components/section-one/scene/Butterfly";
import { butterflyDirector } from "@/lib/butterfly-director";

/**
 * ButterflyLayer — the ONLY home of the butterfly in the whole document.
 *
 * A fixed, pointer-transparent SVG spanning the viewport. It hosts the single
 * <Butterfly/> node and the glowing dotted trail, both driven in viewport
 * pixels by the butterfly director. Chapter One and Chapter Two fly this same
 * element — it is never re-created, so the character stays continuous.
 *
 * Registration happens in useLayoutEffect so the director is ready before any
 * chapter's useEffect choreography runs.
 */
export default function ButterflyLayer() {
  const rootRef = useRef<SVGGElement>(null);
  const trailRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const inner = el.querySelector<SVGGElement>(".bf-inner");
    butterflyDirector.register(el, inner, trailRef.current);
    // Never visible until a chapter shows it.
    butterflyDirector.setVisible(false);
  }, []);

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[38] h-full w-full overflow-visible"
    >
      <defs>
        {/* Gradient copies for the overlay — the butterfly references these by id */}
        <radialGradient id="wingGrad" cx="35%" cy="35%" r="90%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#EAF7FD" />
          <stop offset="100%" stopColor="#BBDDEA" />
        </radialGradient>
        <radialGradient id="bfGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F6D889" stopOpacity="0.55" />
          <stop offset="70%" stopColor="#F6D889" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#F6D889" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* The narrator — one continuous character across the whole site */}
      <Butterfly ref={rootRef} />

      {/* Glowing dotted trail — drawn while the butterfly departs a chapter */}
      <path
        ref={trailRef}
        d=""
        fill="none"
        stroke="#F6D889"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeDasharray="0.5 14"
        opacity={0}
      />
    </svg>
  );
}
