"use client";

import gsap from "gsap";

type Tweenish = gsap.core.Tween | gsap.core.Timeline;

type GateOptions = {
  /** How far outside the viewport the section may drift before it freezes. */
  rootMargin?: string;
  /**
   * Tweens that must pause while the section is away but are started by the
   * chapter's own story timeline (never auto-started by the gate) — e.g. the
   * girl's idle-life bob/patrol, which begin only after her intro finishes.
   */
  pauseOnly?: Tweenish[];
  /** Fired each time the section becomes active again. */
  onActivate?: () => void;
};

/**
 * GateSectionWhenNear — keeps the site feeling alive without running every
 * chapter's animations at once.
 *
 * Each chapter owns a set of "always-on" tweens (ambient weather, breathing,
 * idle life). While its section is near the viewport they run; as soon as it
 * drifts far away they pause and every CSS animation inside the section is
 * frozen (the `.is-off` class), then everything resumes when the visitor
 * returns. Only ~one chapter animates at a time, so the main thread never
 * accumulates the load of all four chapters — the "page is not responding"
 * freeze on slower machines is caused by exactly that accumulation.
 *
 * The correct state is applied SYNCHRONOUSLY at setup (no waiting for the
 * observer's first async callback), so off-screen chapters never animate
 * even for a single frame during page load. Every step is wrapped so this
 * helper can never throw and break a chapter.
 */
export function gateSectionWhenNear(
  el: Element,
  tweens: Tweenish[],
  opts: GateOptions = {}
): () => void {
  const { rootMargin = "60% 0px 60% 0px", pauseOnly = [], onActivate } = opts;

  const apply = (on: boolean, fireActivate = true) => {
    el.classList.toggle("is-off", !on);
    tweens.forEach((t) => (on ? t.play() : t.pause()));
    if (!on) pauseOnly.forEach((t) => t.pause());
    if (on && fireActivate && onActivate) onActivate();
  };

  // Synchronous initial state — the chapter is frozen before first paint if
  // it is already off-screen, instead of animating for a frame or two.
  try {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight || 800;
    const active = r.top < vh * 1.6 && r.bottom > -vh * 0.6;
    apply(active, false);
  } catch {
    /* keep the tweens' default (running) state */
  }

  if (typeof IntersectionObserver === "undefined") {
    return () => el.classList.remove("is-off");
  }

  let io: IntersectionObserver | null = null;
  try {
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => apply(entry.isIntersecting));
      },
      { rootMargin }
    );
    io.observe(el);
  } catch {
    io = null;
  }

  return () => {
    io?.disconnect();
    el.classList.remove("is-off");
  };
}
