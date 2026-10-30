"use client";

import type { CSSProperties } from "react";

/**
 * GardenDecor — the small flowers and butterflies that gather around the
 * homepage chapters, continuing the butterfly's journey out of the hero.
 *
 * Decorative ONLY: pointer-transparent, aria-hidden, inline SVG in the
 * SenJun palette (no external assets, no new dependencies). Each piece sits
 * near a section's OUTER edge, is a different size and angle from its
 * neighbours, and drifts on a slow CSS ease-in-out that:
 *   · stops entirely under prefers-reduced-motion, and
 *   · is frozen with the rest of a chapter while it is parked off-screen
 *     (the existing `.is-off` performance gate pauses CSS animations).
 */

type Spot = { top?: string; bottom?: string; left?: string; right?: string };

type Flower = {
  spot: Spot;
  kind?: "daisy" | "blossom";
  size?: number;
  rotate?: number;
  dur?: number;
  delay?: number;
};

type Fly = {
  spot: Spot;
  size?: number;
  rotate?: number;
  dur?: number;
  delay?: number;
  dx?: number;
};

export default function GardenDecor({
  flowers = [],
  butterflies = [],
  className = "",
}: {
  flowers?: Flower[];
  butterflies?: Fly[];
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      {flowers.map((f, i) => (
        <span
          key={`flower-${i}`}
          className="garden-flower"
          style={
            {
              ...f.spot,
              width: f.size ?? 16,
              height: f.size ?? 16,
              "--gf-dur": `${f.dur ?? 8}s`,
              "--gf-delay": `${f.delay ?? 0}s`,
            } as CSSProperties
          }
        >
          <svg
            viewBox="0 0 24 24"
            width="100%"
            height="100%"
            style={{ transform: `rotate(${f.rotate ?? 0}deg)` }}
            aria-hidden="true"
          >
            {f.kind === "blossom" ? <Blossom /> : <Daisy />}
          </svg>
        </span>
      ))}

      {butterflies.map((b, i) => (
        <span
          key={`butterfly-${i}`}
          className="garden-butterfly"
          style={
            {
              ...b.spot,
              width: b.size ?? 22,
              height: Math.round((b.size ?? 22) * 0.77),
              "--gb-dur": `${b.dur ?? 6.5}s`,
              "--gb-delay": `${b.delay ?? 0}s`,
              "--gb-dx": `${b.dx ?? 8}px`,
              "--gb-rot-from": `${(b.rotate ?? 0) - 4}deg`,
              "--gb-rot-to": `${(b.rotate ?? 0) + 5}deg`,
            } as CSSProperties
          }
        >
          <svg viewBox="0 0 26 20" width="100%" height="100%" aria-hidden="true">
            {/* Same little butterfly the hero hint uses — one species, one site */}
            <g className="mini-butterfly-wing" fill="#FFFDF7" stroke="#A9D8EE" strokeWidth="0.8">
              <path d="M12 8 C 8 3, 1 2, 1 6 C 1 9, 6 11, 12 11 Z" />
              <path d="M12 11 C 8 12, 4 15, 5 17 C 6 18.5, 10 15, 12 12.5 Z" />
            </g>
            <g
              className="mini-butterfly-wing mini-butterfly-wing--r"
              fill="#FFFDF7"
              stroke="#A9D8EE"
              strokeWidth="0.8"
            >
              <path d="M14 8 C 18 3, 25 2, 25 6 C 25 9, 20 11, 14 11 Z" />
              <path d="M14 11 C 18 12, 22 15, 21 17 C 20 18.5, 16 15, 14 12.5 Z" />
            </g>
            <ellipse cx="13" cy="10.5" rx="1.3" ry="3.6" fill="#F2E3CE" />
          </svg>
        </span>
      ))}
    </div>
  );
}

/** A small pale daisy — white petals, sun-yellow heart */
function Daisy() {
  return (
    <g>
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse
          key={a}
          cx="12"
          cy="6.6"
          rx="2.4"
          ry="4.2"
          fill="#FFFDF7"
          stroke="#E6DEBE"
          strokeWidth="0.5"
          transform={`rotate(${a} 12 12)`}
        />
      ))}
      <circle cx="12" cy="12" r="2.5" fill="#F6D889" stroke="#E4B95F" strokeWidth="0.5" />
    </g>
  );
}

/** A soft pink blossom — five pastel petals */
function Blossom() {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx="12"
          cy="7.2"
          rx="3.1"
          ry="3.9"
          fill="#F7C7D4"
          stroke="#EBB2C2"
          strokeWidth="0.5"
          transform={`rotate(${a} 12 12)`}
        />
      ))}
      <circle cx="12" cy="12" r="2.2" fill="#F6E3B5" stroke="#E4C98A" strokeWidth="0.5" />
    </g>
  );
}
