"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * One scroll = one segment.
 *
 * The site is FOUR narrative segments (#top, #our-story, #community,
 * #contact) joined by the editorial bands that carry the real photography
 * (#home-intro, #story-photos, #community-dining, #rooms). An invisible,
 * pointer-transparent helper mounted inside every stop captures wheel and
 * touch gestures: every gesture glides the page to the neighbouring stop.
 * Gestures are routed through Lenis (exposed as window.__lenis by Section
 * One) so the soft scroll feel is preserved; without it, a plain GSAP
 * window-scroll tween is used instead. Keyboard and links are untouched.
 *
 * Every stop must be listed here, in document order — a stop that is not
 * registered would be jumped clean over by a glide, which is exactly how a
 * photo band can end up never being seen.
 */
const SEGMENTS = [
  "top",
  "home-intro",
  "our-story",
  "story-photos",
  "community",
  "community-dining",
  "rooms",
  "contact",
];

/**
 * A stop must hand over only once the visitor has actually READ it: when it
 * still hangs below this viewport, the gesture finishes the stop before
 * moving on, so tall content (the Rooms gallery, a stacked mobile column) is
 * never sailed past. The 8px allowance absorbs sub-pixel rounding — narrative
 * segments are exactly 100svh, which is never taller than the viewport, so
 * they keep their original single-gesture behaviour untouched.
 */
const FIT_SLACK = 8;
/**
 * How far past a stop's top counts as "still at its top" when scrolling back.
 * Small enough that a landing bounce falls inside it (and keeps going up one
 * gesture = one stop), large enough to catch a genuinely part-read stop.
 */
const TOP_SLACK_RATIO = 0.06;

/** Short hops stay snappy; a full-screen journey keeps the original glide. */
const glideDuration = (dist: number) => Math.min(1.05, Math.max(0.45, 0.4 + dist / 1400));

export default function ScrollSnap() {
  const zoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let busy = false;
    let tween: gsap.core.Tween | null = null;
    let touchY: number | null = null;

    /* Active while the viewport centre sits inside this segment's zone */
    const isActive = () => {
      const zone = zoneRef.current;
      if (!zone) return false;
      const r = zone.getBoundingClientRect();
      const mid = window.innerHeight / 2;
      return r.top <= mid && mid <= r.bottom;
    };

    type LenisLike = {
      scrollTo: (
        target: number,
        opts?: { duration?: number; easing?: (t: number) => number; onComplete?: () => void }
      ) => void;
    };
    const lenis = () => (window as unknown as { __lenis?: LenisLike }).__lenis;

    const glide = (y: number, dur: number, done: () => void) => {
      const l = lenis();
      if (l) {
        l.scrollTo(y, {
          duration: dur,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
          onComplete: done,
        });
        return;
      }
      tween?.kill();
      const o = { v: window.scrollY };
      tween = gsap.to(o, {
        v: y,
        duration: dur,
        ease: "power2.inOut",
        onUpdate: () => window.scrollTo(0, o.v),
        onComplete: done,
      });
    };

    const step = (dir: 1 | -1) => {
      if (busy) return;
      const sections = SEGMENTS.map((id) => document.getElementById(id)).filter(
        (s): s is HTMLElement => !!s
      );
      if (!sections.length) return;

      const vh = window.innerHeight;
      const y0 = window.scrollY;
      const mid = y0 + vh / 2;
      let idx = 0;
      sections.forEach((s, i) => {
        if (s.getBoundingClientRect().top + y0 <= mid) idx = i;
      });

      const cur = sections[idx];
      const curTop = cur.getBoundingClientRect().top + y0;
      const curBottom = curTop + cur.offsetHeight;

      let target: number | null = null;

      if (dir === 1) {
        if (curBottom - y0 > vh + FIT_SLACK) {
          /* The stop still hangs below this viewport: finish reading it before
             handing over, so nothing at its foot is ever skipped. */
          target = curBottom - vh;
        } else {
          const next = sections[idx + 1];
          target = next ? next.getBoundingClientRect().top + y0 : null;
        }
      } else {
        if (y0 - curTop > vh * TOP_SLACK_RATIO) {
          /* Partway into a stop — return to its top first instead of leaping
             backwards over everything between. */
          target = curTop;
        } else {
          const prev = sections[idx - 1];
          if (prev) {
            const pTop = prev.getBoundingClientRect().top + y0;
            /* Mirror of the descent: a stop that reads across two viewports is
               stepped back to its foot first, so scrolling up never glides over
               its lower half. Narrative segments are exactly 100svh, which is
               never taller than the viewport, so they keep one gesture per stop. */
            target =
              prev.offsetHeight > vh + FIT_SLACK
                ? pTop + prev.offsetHeight - vh
                : pTop;
          } else {
            target = null;
          }
        }
      }

      if (target === null) return;
      busy = true;
      const y = Math.max(0, target);
      glide(y, glideDuration(Math.abs(y - y0)), () => window.setTimeout(() => (busy = false), 200));
    };

    /* Capture phase + stopPropagation so native scrolling AND Lenis's own
       wheel handler both stand aside while segments hand over one by one. */
    const onWheel = (e: WheelEvent) => {
      if (!isActive()) return;
      e.preventDefault();
      e.stopPropagation();
      if (busy || Math.abs(e.deltaY) < 12) return;
      step(e.deltaY > 0 ? 1 : -1);
    };
    const onTouchStart = (e: TouchEvent) => {
      if (isActive()) touchY = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isActive()) e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!isActive() || touchY === null) return;
      const dy = touchY - (e.changedTouches[0]?.clientY ?? touchY);
      touchY = null;
      if (Math.abs(dy) > 48) step(dy > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true, capture: true });

    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("touchstart", onTouchStart, { capture: true });
      window.removeEventListener("touchmove", onTouchMove, { capture: true });
      window.removeEventListener("touchend", onTouchEnd, { capture: true });
      tween?.kill();
    };
  }, []);

  return <div ref={zoneRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />;
}
