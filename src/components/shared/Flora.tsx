"use client";

/**
 * Shared hand-painted flora — daisies, lavender and grass tufts, drawn once
 * and reused by both chapter scenes so the garden stays visually consistent.
 */

export function Daisy({ x, y, s }: { x: number; y: number; s: number }) {
  const petals = Array.from({ length: 8 }, (_, i) => (i * 45 + 22) % 360);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} aria-hidden="true">
      {petals.map((deg) => (
        <ellipse
          key={deg}
          cx={0}
          cy={-6.2}
          rx={2.7}
          ry={1.7}
          fill="#FFFFFF"
          stroke="#EFE7D8"
          strokeWidth={0.4}
          transform={`rotate(${deg})`}
        />
      ))}
      <circle r={2.7} fill="#F2D06B" />
      <circle r={1.2} fill="#E4B84F" />
    </g>
  );
}

export function Lavender({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${(i - 2) * 4.4} 0)`}>
          <path
            d={`M0 0 Q ${i % 2 ? 2 : -2} -6 0 -15`}
            stroke="#7FA96F"
            strokeWidth={1}
            fill="none"
          />
          <rect x={-1.7} y={-14} width={3.4} height={9} rx={1.7} fill="#A79BD8" />
          <rect x={-1.2} y={-10} width={2.4} height={6} rx={1.2} fill="#9589CD" opacity={0.85} />
        </g>
      ))}
    </g>
  );
}

export function GrassTuft({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${s})`}
      className="sway-plant"
      aria-hidden="true"
    >
      <path
        d="M0 0 Q -2 -7 -5 -11 M0 0 Q 0 -8 1 -12 M0 0 Q 2 -6 5 -9"
        stroke="#7FBA7B"
        strokeWidth={1.6}
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

export function PinkFlower({ x, y, s }: { x: number; y: number; s: number }) {
  const petals = Array.from({ length: 6 }, (_, i) => (i * 60 + 10) % 360);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} aria-hidden="true">
      {petals.map((deg) => (
        <ellipse
          key={deg}
          cx={0}
          cy={-5.4}
          rx={2.5}
          ry={1.6}
          fill="#F5C4CE"
          stroke="#E8ACBA"
          strokeWidth={0.4}
          transform={`rotate(${deg})`}
        />
      ))}
      <circle r={2.2} fill="#F2D06B" />
    </g>
  );
}
