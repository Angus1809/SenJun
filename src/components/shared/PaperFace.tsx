"use client";

/**
 * Shared paper-collage face + color helpers — every character in the SenJun
 * world (the Girl, the Man and all residents) uses this exact hand-cut
 * paper-craft eye so the whole cast belongs to the same storybook.
 *
 * No more anime glints — the eyes are tiny seed-beads of dark paper with a
 * single soft highlight, framed by a slightly wobbly "scissor-cut" oval.
 * The eye is drawn around its own origin; place it with
 * `<g transform="translate(x y)"><PaperEye iris="..." /></g>`. When a
 * character needs a separately-animatable pupil group (the directors slide
 * `pupils` to track movement), pass `pupil={false}` and draw the dark bead
 * yourself.
 */

export const EYE_EDGE = "#3A2A1E";

/** Lighten a hex color toward white — paper highlight tones. */
export function lighten(hex: string, amt = 0.3): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const mix = (c: number) => Math.round(c + (255 - c) * amt);
  return `#${((mix(r) << 16) | (mix(g) << 8) | mix(b)).toString(16).padStart(6, "0")}`;
}

/** Darken a hex color — cut edges, seams and paper depth. */
export function darken(hex: string, amt = 0.18): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const mix = (c: number) => Math.round(c * (1 - amt));
  return `#${((mix(r) << 16) | (mix(g) << 8) | mix(b)).toString(16).padStart(6, "0")}`;
}

/** Deterministic pseudo-random in [-1, 1] from a seed + index (SSR-safe). */
function hash(seed: number, i: number): number {
  const x = Math.sin(seed * 12.9898 + i * 78.233 + 3.14159) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

/**
 * A hand-cut (slightly wobbly) paper oval path. Deterministic per seed so
 * the server and client render the exact same shape. `jitter` is the cut
 * wobble in px — small values read as careful scissors, larger as torn.
 */
export function roughOval(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  seed = 1,
  jitter = 0.7
): string {
  const N = 14;
  let d = "";
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const px = cx + Math.cos(a) * (rx + hash(seed, i) * jitter);
    const py = cy + Math.sin(a) * (ry + hash(seed + 7, i) * jitter * 0.8);
    d += `${i === 0 ? "M" : "L"}${px.toFixed(1)} ${py.toFixed(1)}`;
  }
  return `${d}Z`;
}

/**
 * A tiny seed-bead paper eye: white cut-paper oval with a dark iris bead
 * and a single soft highlight. No big anime shapes — just a gentle bead.
 */
export function PaperEye({
  iris = "#4A3324",
  pupil = true,
}: {
  iris?: string;
  pupil?: boolean;
}) {
  return (
    <>
      <path
        d={roughOval(0, 0, 1.8, 2.2, 11, 0.5)}
        fill="#FFFFFF"
        stroke={EYE_EDGE}
        strokeWidth={0.5}
      />
      {pupil && <circle cx={0.15} cy={0.1} r={0.9} fill={iris} />}
      <circle cx={-0.5} cy={-0.65} r={0.3} fill="#FFFFFF" opacity={0.9} />
    </>
  );
}
