"use client";

/**
 * Floating ambient life — golden pollen drifting up through the sunlight,
 * dust motes, and a few leaves swaying near the trees.
 * All of these are animated by GSAP from GardenScene (tagged with
 * data-ambient attributes).
 */

const POLLEN: Array<[number, number, number, number]> = [
  // [startX, size, duration-ish variance, opacity]
  [180, 2.6, 0, 0.6],
  [320, 2, 1, 0.5],
  [480, 2.8, 2, 0.65],
  [600, 1.9, 3, 0.5],
  [720, 2.4, 4, 0.6],
  [860, 2, 5, 0.5],
  [260, 2.2, 6, 0.55],
  [540, 2.7, 7, 0.6],
  [900, 2.1, 8, 0.5],
  [400, 2.5, 9, 0.6],
];

const DUST: Array<[number, number, number]> = [
  [660, 1.6, 0],
  [760, 1.3, 1],
  [820, 1.5, 2],
  [560, 1.4, 3],
  [700, 1.2, 4],
  [900, 1.5, 5],
  [640, 1.3, 6],
];

const LEAVES: Array<[number, number, number]> = [
  [700, 560, 8],
  [760, 520, 10],
  [660, 600, 12],
  [250, 640, 9],
  [820, 560, 11],
];

export default function Ambient() {
  return (
    <g aria-hidden="true">
      {/* Golden pollen */}
      {POLLEN.map(([x, r, i], idx) => (
        <circle
          key={`p${idx}`}
          data-ambient="pollen"
          cx={x}
          cy={900 + i * 7}
          r={r}
          fill="#F6D889"
          opacity={0}
        />
      ))}

      {/* Dust motes in the sunlight */}
      {DUST.map(([x, r, i], idx) => (
        <circle
          key={`du${idx}`}
          data-ambient="dust"
          cx={x}
          cy={600 + i * 9}
          r={r}
          fill="#F9E8C0"
          opacity={0}
        />
      ))}

      {/* Drifting leaves */}
      {LEAVES.map(([x, y, i], idx) => (
        <path
          key={`l${idx}`}
          data-ambient="leaf"
          d="M 0 0 C 3 -2 6 -1 8 2 C 5 3 2 3 0 0 Z"
          transform={`translate(${x} ${y}) rotate(${i})`}
          fill="#A8C98F"
          stroke="#8FB377"
          strokeWidth={0.6}
          opacity={0.75}
        />
      ))}
    </g>
  );
}
