"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import type { Ref } from "react";
import gsap from "gsap";

/**
 * Chapter Two — the anime travellers.
 *
 * Three travellers walk the existing garden path, following the narrator
 * butterfly toward the signpost (and on to Chapter Three). They are NOT
 * re-drawn: each one is a distortion-free CSS crop of the single supplied
 * asset `/public/images/travelling.png` (a transparent 1536×1024 PNG holding
 * all three characters) — the crop windows land in the transparent gaps
 * between the characters, so every traveller keeps its original artwork,
 * proportions and lighting.
 *
 * Placement is anchored to the scene: the road centre-line (the SVG path
 * stroked in #E9E0C9) is sampled with `getPointAtLength`, and each scene
 * point is mapped into the container through the live `getScreenCTM` — the
 * same mapping the butterfly story uses — so the travellers stay planted on
 * the path at every viewport, in absolute positioning inside the section
 * (never fixed). Walking is a slow GSAP `motionPath` along that same
 * centre-line plus a tiny CSS bob on an inner element (no distortion, no
 * stretching); a soft blurred ellipse grounds each pair of feet.
 *
 * This component also OWNS the road geometry for the guide butterfly: `plan()`
 * returns hover/travel/land waypoints derived from the same centre-line —
 * every point is the first road position a fixed horizontal gap ahead of the
 * leader's box — so the butterfly is always visibly leading, never overlapping
 * the walkers, and never straying off the path (clamped to the visible window
 * on cropped phone screens).
 */

const SRC_W = 1536;
const SRC_H = 1024;

/** One traveller: a crop window into the shared asset + its story timing. */
const TRAVELLERS = [
  // Rendered BACK to FRONT — the rearmost traveller is drawn first, the
  // leader last, so the group overlaps read as depth, never as a flat row.
  {
    key: "t3",
    sx: 1096, sy: 107, sw: 436, sh: 899, // girl with glasses (rearmost)
    units: 132, // height in scene units (≈158px on a 1440×900 desktop)
    f: 0.29, // start position along the road (fraction of path length)
    bobDur: 1.32, bobDelay: 0.55,
    appear: 13, walkAt: 19,
  },
  {
    key: "t2",
    sx: 601, sy: 13, sw: 495, sh: 995, // boy with the duffle bag
    units: 128,
    f: 0.38,
    bobDur: 1.22, bobDelay: 0.28,
    appear: 9, walkAt: 15,
  },
  {
    key: "t1",
    sx: 10, sy: 80, sw: 591, sh: 928, // girl with the ponytail + suitcase (leader)
    units: 120,
    f: 0.47,
    bobDur: 1.14, bobDelay: 0,
    appear: 4, walkAt: 10,
  },
] as const;

/** Story timing for the walk (shared with the guide-butterfly planner). */
const WALK_DUR = 40; // the main walk's length in story units
const NUDGE_AT = 60; // the final settle-step, taken as the butterfly lands
const NUDGE_DUR = 16;

/** How far the group travels along the road: wide screens reach the upper
    end of the path near the signpost; the narrow, cropped phone window gets
    a shorter walk so nobody ever leaves the viewport. */
const WALK_WIDE = 0.27;
const WALK_NARROW = 0.1;
const NUDGE_STEP = 0.03;
/** Small screens look at a cropped slice of the scene — nudge the group
    forward along the path so everyone stays inside the visible window. */
const MOBILE_SHIFT = 0.03;

/* ---- Guide-butterfly geometry (all in scene units unless noted) ---- */
const GUIDE_LIFT = 78; // how high above the road it floats
const GUIDE_WAVE = 5; // gentle vertical wave woven into its flight
const GUIDE_GAP_RATIO = 0.65; // clear gap ≈ 65% of the leader's pixel height…
const GUIDE_GAP_MIN = 69; // …but never tighter than this (px; the butterfly
const GUIDE_GAP_MAX = 96; //    itself is a fixed 66px wide) …
const GUIDE_EDGE = 0.9; // keep the guide (centre) inside 90% of the width
const GUIDE_SIGN = { x: 836, y: 388 }; // the sign board's centre (scene)

type Pt = { x: number; y: number };

/** Where the guide butterfly goes, in scene units. */
export type GuidePlan = {
  /** Just ahead of the walkers — where it waits before they set off. */
  hover: Pt;
  /** Road-tracking waypoints across the main walk (with a soft float). */
  travel: Pt[];
  /** The destination stop: the sign board when visible, else the path's end. */
  land: Pt;
};

export type TravellersHandle = {
  /** Compute geometry + the guide-butterfly route (scene units). */
  plan: () => GuidePlan | null;
  /** Append appearance + walking tweens to the chapter's story timeline. */
  choreograph: (tl: gsap.core.Timeline) => void;
  /** Reduced motion: no timeline — just stand the group mid-path, visible. */
  showStatic: () => void;
};

type Geo = {
  /** Element-space walk paths (relative to each traveller's anchor point). */
  walk: Pt[][];
  nudge: Pt[][];
  guide: GuidePlan | null;
};

const easeInOut = (p: number) =>
  p <= 0 ? 0 : p >= 1 ? 1 : -(Math.cos(Math.PI * p) - 1) / 2;

const Travellers = forwardRef(function Travellers(
  { sceneRef }: { sceneRef: React.RefObject<SVGSVGElement | null> },
  ref: Ref<TravellersHandle>
) {
  const layerRef = useRef<HTMLDivElement>(null);
  const elsRef = useRef<Array<HTMLDivElement | null>>([]);
  const geoRef = useRef<Geo | null>(null);
  const phaseRef = useRef<number | "mid">(0);

  /**
   * Anchor every traveller on the road, size them to the scene, and derive
   * the guide butterfly's route from the same road.
   * Returns null when the road can't be found (nothing is positioned, the
   * group simply stays hidden — the chapter can never break because of it).
   */
  const prepare = useCallback(
    (phase: number | "mid"): Geo | null => {
      const svg = sceneRef.current;
      const layer = layerRef.current;
      if (!svg || !layer) return null;
      const road = svg.querySelector<SVGPathElement>('path[stroke="#E9E0C9"]');
      if (!road) return null;

      const rect = layer.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      const ctm = svg.getScreenCTM();
      if (!ctm) return null;

      // Scene unit (after the slice mapping) -> container-relative pixels.
      const toPx = (p: Pt): Pt => {
        const pt = svg.createSVGPoint();
        pt.x = p.x;
        pt.y = p.y;
        const s = pt.matrixTransform(ctm);
        return { x: s.x - rect.left, y: s.y - rect.top };
      };

      const len = road.getTotalLength();
      const narrow = rect.width < 768;
      const shift = narrow ? MOBILE_SHIFT : 0;
      const walkMain = narrow ? WALK_NARROW : WALK_WIDE;
      // Reduced-motion static view: plant the group mid-journey.
      const effPhase = phase === "mid" ? (walkMain + NUDGE_STEP) / 2 : phase;
      // Slice scale (max of the two axes) + a small-screen multiplier, so
      // the travellers shrink with the scene but never exceed ~185px.
      const scale = Math.min(Math.max(rect.width / 1200, rect.height / 800), 1.35);
      const mul = rect.width >= 1024 ? 1 : rect.width >= 768 ? 0.88 : 0.8;

      const walk: Pt[][] = [];
      const nudge: Pt[][] = [];
      let leaderF0 = 0;
      const leaderIdx = TRAVELLERS.findIndex((t) => t.key === "t1");

      TRAVELLERS.forEach((t, i) => {
        const el = elsRef.current[i];
        if (!el) return;

        const f0 = Math.min(0.98, t.f + shift + effPhase);
        if (i === leaderIdx) leaderF0 = f0;
        const at = (f: number) => {
          const p = road.getPointAtLength(Math.min(len, f * len));
          return toPx({ x: p.x, y: p.y });
        };

        // Anchor: feet planted on the centre-line (the element's bottom
        // centre sits on the road point via percent transforms, which GSAP
        // composes with the walking tween's x/y), sized from scene units.
        const anchor = at(f0);
        el.style.left = `${(anchor.x / rect.width) * 100}%`;
        el.style.top = `${(anchor.y / rect.height) * 100}%`;
        el.style.height = `${Math.min(185, t.units * scale * mul)}px`;
        gsap.set(el, { xPercent: -50, yPercent: -100 });

        // Walking path: samples along the same road, relative to the anchor.
        const seg = (from: number, to: number, n: number): Pt[] => {
          const pts: Pt[] = [];
          for (let k = 1; k <= n; k++) {
            const q = at(from + ((to - from) * k) / n);
            pts.push({ x: q.x - anchor.x, y: q.y - anchor.y });
          }
          return pts;
        };
        walk.push(seg(f0, f0 + walkMain, walkMain > 0.2 ? 20 : 10));
        nudge.push(seg(f0 + walkMain, f0 + walkMain + NUDGE_STEP, 4));
      });

      /* ---- the guide butterfly, derived from the same road ---- */
      let guide: GuidePlan | null = null;
      const leaderEl = elsRef.current[leaderIdx];
      const leader = TRAVELLERS[leaderIdx];
      if (leaderEl && leader && leaderEl.offsetHeight > 0) {
        const a = ctm.a || 1; // px per scene unit (uniform — slice mapping)
        const p0 = toPx({ x: 0, y: 0 });

        // Fraction-at-x lookup: the road runs strictly left → right.
        const STEPS = 320;
        const xs: number[] = [];
        for (let i = 0; i <= STEPS; i++) {
          xs.push(road.getPointAtLength((i / STEPS) * len).x);
        }
        const fAtX = (x: number): number => {
          let lo = 0;
          let hi = STEPS;
          while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (xs[mid] < x) lo = mid + 1;
            else hi = mid;
          }
          return lo / STEPS;
        };

        // Visible window: the guide never leaves the right of the crop.
        const maxF = fAtX((rect.width * GUIDE_EDGE - p0.x) / a);
        const roadAt = (f: number): Pt => {
          const p = road.getPointAtLength(Math.min(1, Math.max(0, f)) * len);
          return { x: p.x, y: p.y };
        };

        // The leader's road fraction at a story time (mirrors choreograph).
        const leaderF = (t: number): number => {
          let f = leaderF0;
          if (t > leader.walkAt) {
            f += walkMain * easeInOut(Math.min(1, (t - leader.walkAt) / WALK_DUR));
          }
          if (t > NUDGE_AT) {
            f += NUDGE_STEP * easeInOut(Math.min(1, (t - NUDGE_AT) / NUDGE_DUR));
          }
          return f;
        };
        // The guide's fraction: the first road point a clear horizontal gap
        // ahead of the leader's bounding box (and inside the visible crop).
        const hw = leaderEl.offsetWidth / 2 / a;
        const gap =
          Math.min(
            GUIDE_GAP_MAX,
            Math.max(GUIDE_GAP_MIN, leaderEl.offsetHeight * GUIDE_GAP_RATIO)
          ) / a;
        const guideF = (fL: number): number =>
          Math.min(fAtX(roadAt(fL).x + hw + gap), maxF);
        const floatAt = (f: number, lift: number): Pt => {
          const p = roadAt(f);
          return { x: p.x, y: p.y - lift };
        };

        // Hover before the walk starts; waypoints sampled through the walk
        // with a gentle ±wave so the flight breathes as it moves.
        const hover = floatAt(guideF(leaderF(leader.walkAt + 2)), GUIDE_LIFT);
        const travel: Pt[] = [hover];
        for (const t of [16, 20, 24, 28, 32, 36, 40, 44, 48, 50]) {
          const wave = travel.length % 2 === 1 ? GUIDE_WAVE : -GUIDE_WAVE;
          travel.push(floatAt(guideF(leaderF(t)), GUIDE_LIFT + wave));
        }
        // Where it would naturally stop after the final settle-step…
        const rest = floatAt(guideF(leaderF(NUDGE_AT + NUDGE_DUR)), GUIDE_LIFT);
        guide = {
          hover,
          travel,
          // …but the destination is the sign board whenever it is on screen.
          land: toPx(GUIDE_SIGN).x <= rect.width * 0.92 ? GUIDE_SIGN : rest,
        };
      }

      return { walk, nudge, guide };
    },
    [sceneRef]
  );

  useImperativeHandle(ref, () => ({
    plan: () => {
      phaseRef.current = 0;
      const geo = prepare(0);
      geoRef.current = geo;
      return geo?.guide ?? null;
    },
    choreograph: (tl) => {
      phaseRef.current = 0;
      const geo = prepare(0);
      geoRef.current = geo;
      TRAVELLERS.forEach((t, i) => {
        const el = elsRef.current[i];
        if (!el) return;
        // The traveller "notices" the butterfly and steps forward, then
        // keeps progressing as the butterfly climbs toward the signpost.
        tl.fromTo(
          el,
          { autoAlpha: 0, x: 0, y: 10 },
          { autoAlpha: 1, x: 0, y: 0, duration: 5, ease: "sine.out" },
          t.appear
        );
        if (geo) {
          tl.to(
            el,
            {
              motionPath: { path: [{ x: 0, y: 0 }, ...geo.walk[i]], curviness: 1.1 },
              duration: WALK_DUR,
              ease: "sine.inOut",
            },
            t.walkAt
          );
          tl.to(
            el,
            {
              motionPath: { path: geo.nudge[i], curviness: 1.1 },
              duration: NUDGE_DUR,
              ease: "sine.inOut",
            },
            NUDGE_AT
          );
        }
      });
    },
    showStatic: () => {
      phaseRef.current = "mid";
      geoRef.current = prepare("mid");
      TRAVELLERS.forEach((t, i) => {
        const el = elsRef.current[i];
        if (el) gsap.set(el, { autoAlpha: 1, x: 0, y: 0 });
      });
    },
  }));

  // Keep anchors + sizes correct when the viewport changes.
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (geoRef.current) geoRef.current = prepare(phaseRef.current);
      });
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [prepare]);

  return (
    <div ref={layerRef} className="pointer-events-none absolute inset-0 z-[4]" aria-hidden="true">
      {TRAVELLERS.map((t, i) => (
        <div
          key={t.key}
          ref={(el) => {
            elsRef.current[i] = el;
          }}
          className="traveller"
        >
          <span className="traveller__shadow" />
          <div
            className="traveller__bob"
            style={{ animationDuration: `${t.bobDur}s`, animationDelay: `${t.bobDelay}s` }}
          >
            <div className="traveller__frame" style={{ aspectRatio: `${t.sw} / ${t.sh}` }}>
              <img
                src="/images/travelling.png"
                alt=""
                draggable={false}
                style={{
                  height: `${(SRC_H / t.sh) * 100}%`,
                  left: `${(-t.sx / t.sw) * 100}%`,
                  top: `${(-t.sy / t.sh) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

export default Travellers;
