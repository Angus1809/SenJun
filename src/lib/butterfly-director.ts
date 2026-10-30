"use client";

import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

/**
 * Butterfly director — the choreography layer for THE butterfly.
 *
 * Exactly ONE butterfly DOM node exists for the whole website. It lives in a
 * fixed full-viewport layer (ButterflyLayer) in viewport-pixel coordinates,
 * and every chapter drives it through this singleton. Chapters convert their
 * own scene coordinates to screen pixels (via the scene SVG's getScreenCTM)
 * and call flyPath / setPosition / etc. — the character itself is never
 * re-created or moved between scenes.
 */

export type Point = { x: number; y: number };

/** Butterfly orientation offset — drawn nose-up, so +90 aligns it with travel */
export const BUTTERFLY_AUTO_ROTATE = 90;

type DirectorState = {
  el: SVGGElement | null;
  inner: SVGGElement | null;
  trail: SVGPathElement | null;
};

const state: DirectorState = { el: null, inner: null, trail: null };

export const butterflyDirector = {
  register(el: SVGGElement | null, inner: SVGGElement | null, trail: SVGPathElement | null) {
    state.el = el;
    state.inner = inner;
    state.trail = trail;
    // TEMP-DEBUG
    if (typeof window !== "undefined")
      (window as unknown as { __dbg?: unknown }).__dbg = { gsap, state };
  },

  isReady() {
    return !!state.el;
  },

  /** The butterfly's root <g> — the element every flight tween targets. */
  get el() {
    return state.el;
  },

  /** The .bf-inner group — bobs and "looks around" independently of flight. */
  get inner() {
    return state.inner;
  },

  /** Current position in viewport pixels. */
  getPosition(): Point {
    const el = state.el;
    if (!el) return { x: 0, y: 0 };
    return {
      x: gsap.getProperty(el, "x") as number,
      y: gsap.getProperty(el, "y") as number,
    };
  },

  setPosition(x: number, y: number) {
    const el = state.el;
    if (!el) return;
    gsap.set(el, { x, y });
  },

  setVisible(visible: boolean, duration = 0) {
    const el = state.el;
    if (!el) return null;
    if (duration > 0) {
      return gsap.to(el, { autoAlpha: visible ? 1 : 0, duration, ease: "power2.out" });
    }
    gsap.set(el, { autoAlpha: visible ? 1 : 0 });
    return null;
  },

  /** Fly the butterfly along a pixel-space path (organic curve, auto-rotated). */
  flyPath(path: Point[], vars: gsap.TweenVars = {}) {
    const el = state.el;
    if (!el) return null;
    return gsap.to(el, {
      motionPath: {
        path,
        alignOrigin: [0.5, 0.5],
        autoRotate: BUTTERFLY_AUTO_ROTATE,
      },
      ease: "sine.inOut",
      ...vars,
    });
  },

  flapSpeed(speed: "slow" | "fast") {
    const el = state.el;
    if (!el) return;
    const wings = el.querySelectorAll<SVGElement>(".bf-wing");
    wings.forEach((w) => {
      w.style.animationDuration = speed === "slow" ? "0.9s" : "0.26s";
    });
  },

  /** Rotate the inner group — the butterfly "looks" somewhere. */
  lookAt(degrees: number, duration = 0.6) {
    if (!state.inner) return null;
    return gsap.to(state.inner, { rotation: degrees, duration, ease: "sine.inOut" });
  },

  /* ---------------- glowing dotted trail ---------------- */

  trailReset() {
    if (!state.trail) return;
    // Kill any lingering flow/fade tweens so two trails never fight
    gsap.killTweensOf(state.trail);
    gsap.set(state.trail, { opacity: 0, strokeDashoffset: 0 });
    state.trail.setAttribute("d", "");
  },

  trailAdd(x: number, y: number) {
    const trail = state.trail;
    if (!trail) return;
    const d = trail.getAttribute("d") || "";
    // Cap the path so scrubbing back and forth across an exit can never grow
    // the DOM string unboundedly over a long session.
    if (d.length > 16000) {
      trail.setAttribute("d", `M ${x.toFixed(1)} ${y.toFixed(1)}`);
      return;
    }
    const px = `${x.toFixed(1)} ${y.toFixed(1)}`;
    trail.setAttribute("d", d ? `${d} L ${px}` : `M ${px}`);
  },

  /** Make the dotted trail visible and set its dashes flowing. */
  trailFlow() {
    const trail = state.trail;
    if (!trail) return;
    gsap.set(trail, { opacity: 1 });
    gsap.to(trail, { strokeDashoffset: -340, duration: 2.6, repeat: -1, ease: "none" });
  },

  trailFade(duration = 1.8, delay = 0) {
    const trail = state.trail;
    if (!trail) return;
    gsap.to(trail, { opacity: 0, duration, delay });
  },
};
