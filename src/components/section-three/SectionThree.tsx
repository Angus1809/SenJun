"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import CourtyardScene from "./scene/CourtyardScene";
import { butterflyDirector, type Point } from "@/lib/butterfly-director";
import { butterflyStore, BUTTERFLY_EXIT_EVENT } from "@/lib/butterfly-store";
import { gateSectionWhenNear } from "@/lib/gate-section";
import ScrollSnap from "@/components/shared/ScrollSnap";
import GardenDecor from "@/components/shared/GardenDecor";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

/**
 * SECTION THREE — the emotional heart of SenJun. The courtyard.
 *
 * The visitor stops following two strangers and starts seeing a family — not
 * by blood, but by choice. Residents arrive from every direction and fall
 * into tiny everyday scenes: cooking together, laughing at dinner, watering
 * the garden, offering tea, mending a bicycle, feeding a stray puppy, a
 * birthday cake with candlelight. The big tree at the center is where people
 * gather — it represents belonging.
 *
 * The butterfly circles the tree, visits people, rests on a branch — and at
 * the end it pauses, looks back, and flies toward a distant warm light where,
 * for the first time, the silhouette of the house appears. Nobody follows
 * anymore; they've already found what they were looking for. Only the girl
 * looks up and smiles.
 *
 * The site is FOUR full-viewport segments with one scroll per segment: the
 * story choreography auto-plays (condensed) each time this segment becomes
 * active — no pinning, no scroll scrubbing, so scrolling stays buttery.
 */

/** Condense the ~90-unit story into roughly 15 seconds of real time */
const STORY_TIMESCALE = 6;

export default function SectionThree() {
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<SVGSVGElement>(null);
  const leafRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<gsap.core.Timeline | null>(null);
  const hoverRef = useRef<{ scene: Element | null; cleanup: (() => void) | null }>({
    scene: null,
    cleanup: null,
  });

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const section = sectionRef.current;
    if (!section) return;

    // Scene point -> viewport pixels (the butterfly lives in a fixed, viewport
    // space layer; the scene fills the viewport while this segment is active).
    const T = (p: Point): Point => {
      const svg = sceneRef.current;
      if (!svg) return p;
      const pt = svg.createSVGPoint();
      pt.x = p.x;
      pt.y = p.y;
      const ctm = svg.getScreenCTM();
      if (!ctm) return p;
      const s = pt.matrixTransform(ctm);
      return { x: s.x, y: s.y };
    };

    const circlePts = (cx: number, cy: number, r: number, startDeg = 0): Point[] => {
      const pts: Point[] = [];
      for (let i = 0; i <= 12; i++) {
        const a = ((startDeg + i * 30) * Math.PI) / 180;
        pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) - r * 0.3 });
      }
      return pts;
    };

    /* ---------------- ambient life (real time, gated by proximity) -------- */
    const ambientTweens: Array<gsap.core.Tween | gsap.core.Timeline> = [];
    let ambientCtx: gsap.Context | null = null;
    if (!reduced) {
      ambientCtx = gsap.context(() => {
        gsap.utils.toArray<SVGGElement>("[data-ambient='cloud3']").forEach((el, i) => {
          ambientTweens.push(
            gsap.fromTo(el, { x: -300 }, { x: 1500, duration: 62 + i * 13, ease: "none", repeat: -1, delay: i * 7 })
          );
        });
        ambientTweens.push(
          gsap.to("[data-ambient='rays3']", {
            rotation: -4,
            duration: 110,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            transformOrigin: "940px 200px",
          })
        );
        gsap.utils.toArray<SVGGElement>("[data-ambient='bird3']").forEach((el, i) => {
          ambientTweens.push(
            gsap.fromTo(el, { x: -180 }, { x: 1380, duration: i ? 56 : 42, ease: "none", repeat: -1, delay: i * 16 })
          );
        });
        gsap.utils.toArray<SVGGElement>("[data-ambient^='farbf']").forEach((el) => {
          ambientTweens.push(
            gsap.to(el, { x: 44, y: -24, duration: 8, yoyo: true, repeat: -1, ease: "sine.inOut" })
          );
        });

        /* The cat pads across the courtyard */
        ambientTweens.push(gsap.to("[data-cat]", { x: 150, duration: 13, yoyo: true, repeat: -1, ease: "sine.inOut" }));
      }, section);
    }

    const stopAmbientGate = gateSectionWhenNear(section, ambientTweens);

    /* ---------------- the story — auto-played per activation --------------- */
    const buildStory = () => {
      storyRef.current?.kill();
      storyRef.current = null;

      if (reduced) {
        gsap.set("[data-house]", { opacity: 0.9 });
        return;
      }
      if (!butterflyDirector.isReady()) return;

      /* The butterfly begins where Chapter Two left it */
      const st = butterflyStore.getState();
      const entry: Point = st.exited
        ? { x: st.x * window.innerWidth, y: st.y * window.innerHeight }
        : { x: window.innerWidth * 0.8, y: window.innerHeight * 0.06 };
      butterflyDirector.setPosition(entry.x, entry.y);
      butterflyDirector.setVisible(false);
      butterflyDirector.trailReset();
      butterflyDirector.flapSpeed("slow");

      /* Start every story-scrolled visual from a known state */
      gsap.set("[data-house]", { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "sine.inOut" }, paused: true });

      const bf = (path: Point[], dur: number, pos: number, vars: gsap.TweenVars = {}) =>
        tl.to(
          butterflyDirector.el,
          {
            motionPath: { path: path.map(T), alignOrigin: [0.5, 0.5], autoRotate: 90 },
            ease: "sine.inOut",
            duration: dur,
            ...vars,
          },
          pos
        );
      const bfRaw = (path: Point[], dur: number, pos: number, vars: gsap.TweenVars = {}) =>
        tl.to(
          butterflyDirector.el,
          {
            motionPath: { path, alignOrigin: [0.5, 0.5], autoRotate: 90 },
            ease: "sine.inOut",
            duration: dur,
            ...vars,
          },
          pos
        );

      /* --- opening: the butterfly circles the great tree --- */
      butterflyDirector.flapSpeed("fast");
      tl.to(butterflyDirector.el, { autoAlpha: 1, duration: 3 }, 0);
      bfRaw([entry, T({ x: 640, y: 520 }), ...circlePts(600, 430, 120).map(T)], 11, 0);
      tl.call(() => butterflyDirector.flapSpeed("slow"), [], 11.2);
      tl.to(butterflyDirector.el, { y: "+=6", duration: 1.8, yoyo: true, repeat: 1, ease: "sine.inOut" }, 11.4);
      tl.to(butterflyDirector.el, { y: "+=5", duration: 1.6, yoyo: true, repeat: 1, ease: "sine.inOut" }, 15);

      /* --- the butterfly visits the courtyard --- */
      butterflyDirector.flapSpeed("fast");
      bf([{ x: 480, y: 500 }, { x: 520, y: 520 }, { x: 545, y: 505 }], 4, 20);
      bf([{ x: 545, y: 505 }, { x: 680, y: 480 }, { x: 790, y: 500 }], 4, 24);
      bf([{ x: 790, y: 500 }, { x: 660, y: 540 }, { x: 522, y: 620 }], 3.5, 28);
      tl.to(butterflyDirector.el, { y: "+=5", duration: 1.6, yoyo: true, repeat: 1, ease: "sine.inOut" }, 32.5);

      /* --- the butterfly rests on the branch --- */
      bf([{ x: 522, y: 620 }, { x: 590, y: 480 }, { x: 648, y: 350 }], 6, 42);
      tl.call(() => butterflyDirector.flapSpeed("slow"), [], 48.2);
      tl.to(butterflyDirector.el, { y: "+=5", duration: 1.6, yoyo: true, repeat: 1, ease: "sine.inOut" }, 48.4);
      tl.to(butterflyDirector.el, { y: "+=4", duration: 1.6, yoyo: true, repeat: 1, ease: "sine.inOut" }, 53);
      tl.to(butterflyDirector.el, { y: "+=4", duration: 1.6, yoyo: true, repeat: 1, ease: "sine.inOut" }, 60);

      /* --- the house appears in the distance --- */
      tl.to("[data-house]", { opacity: 0.9, duration: 12, ease: "sine.inOut" }, 60);

      /* --- the butterfly circles once more, pauses, looks back, departs --- */
      const circle2 = circlePts(600, 400, 150);
      bf([{ x: 648, y: 350 }, ...circle2], 8, 70);
      butterflyDirector.flapSpeed("fast");

      // It pauses once…
      tl.to(butterflyDirector.el, { y: "+=6", duration: 1.4, yoyo: true, repeat: 2, ease: "sine.inOut" }, 78);
      // …looks back…
      tl.call(() => butterflyDirector.lookAt(155, 1.3), [], 79);

      // …and flies toward the warm light
      tl.call(() => {
        butterflyDirector.flapSpeed("fast");
        butterflyDirector.trailReset();
        butterflyDirector.trailFlow();
      }, [], 81);
      bf(
        [circle2[circle2.length - 1], { x: 880, y: 300 }, { x: 1000, y: 330 }, { x: 1090, y: 318 }, { x: 1160, y: 296 }],
        8,
        81,
        {
          onUpdate: () => {
            const p = butterflyDirector.getPosition();
            butterflyDirector.trailAdd(p.x, p.y);
          },
        }
      );
      tl.to(butterflyDirector.el, { autoAlpha: 0, duration: 3 }, 87);

      tl.call(() => {
        butterflyDirector.setVisible(false);
        butterflyDirector.trailFade(1.6, 0.3);
        const end = T({ x: 1160, y: 296 });
        const nx = Math.min(0.96, Math.max(0.04, end.x / window.innerWidth));
        butterflyStore.setExited(nx, 0.03);
        window.dispatchEvent(new CustomEvent(BUTTERFLY_EXIT_EVENT, { detail: { x: nx, y: 0.03 } }));
      }, [], 90);

      tl.timeScale(STORY_TIMESCALE);
      storyRef.current = tl;
      tl.play();
    };

    /* When this segment takes the viewport: build + play the story.
       When it leaves: stop it — the next segment owns the butterfly. */
    const activation = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom top",
      onToggle: (self) => {
        if (self.isActive) buildStory();
        else {
          storyRef.current?.kill();
          storyRef.current = null;
        }
      },
    });

    return () => {
      activation.kill();
      storyRef.current?.kill();
      storyRef.current = null;
      stopAmbientGate();
      ambientCtx?.revert();
    };
  }, []);

  /* ---------------- hover micro-interactions ---------------- */
  const runHover = (sceneEl: Element) => {
    const id = sceneEl.getAttribute("data-scene");
    if (!id) return;
    let cleanup: (() => void) | null = null;
    const tweens: gsap.core.Tween[] = [];

    if (id === "tree") {
      const leaf = leafRef.current;
      if (leaf) {
        gsap.fromTo(
          leaf,
          { y: -30, x: 0, opacity: 0, rotation: 0 },
          { y: 250, x: 46, opacity: 0.85, rotation: 170, duration: 2.6, ease: "sine.inOut", onComplete: () => gsap.set(leaf, { opacity: 0 }) }
        );
      }
    } else if (id === "lights") {
      const glow = sceneEl.querySelector<SVGEllipseElement>("[data-lights-glow]");
      if (glow) tweens.push(gsap.to(glow, { opacity: 0.55, duration: 0.5 }));
    } else if (id === "tea") {
      const steam = sceneEl.querySelector<SVGGElement>("[data-steam-wrap]");
      if (steam) tweens.push(gsap.to(steam, { scale: 1.35, y: -3, duration: 0.6, ease: "power2.out" }));
    } else if (id === "cake") {
      const glow = sceneEl.querySelector<SVGEllipseElement>("[data-cake-glow]");
      if (glow) tweens.push(gsap.to(glow, { opacity: 0.6, duration: 0.5 }));
    } else if (id === "cat") {
      tweens.push(gsap.to(sceneEl, { rotation: -4, duration: 0.4, yoyo: true, repeat: 3, ease: "sine.inOut" }));
    } else if (id === "puppy") {
      tweens.push(gsap.to(sceneEl, { rotation: -3, duration: 0.4, yoyo: true, repeat: 3, ease: "sine.inOut" }));
    } else if (id === "smile" || id === "tea") {
      const sm = sceneEl.querySelector<SVGPathElement>('[data-mouth="smile"]');
      const nt = sceneEl.querySelector<SVGPathElement>('[data-mouth="neutral"]');
      if (sm) tweens.push(gsap.to(sm, { autoAlpha: 1, duration: 0.4 }));
      if (nt) tweens.push(gsap.to(nt, { autoAlpha: 0, duration: 0.4 }));
    }

    cleanup = () => {
      tweens.forEach((tw) => tw.kill());
      const id2 = sceneEl.getAttribute("data-scene");
      if (id2 === "smile" || id2 === "tea") {
        const sm = sceneEl.querySelector<SVGPathElement>('[data-mouth="smile"]');
        const nt = sceneEl.querySelector<SVGPathElement>('[data-mouth="neutral"]');
        if (sm) gsap.to(sm, { autoAlpha: 0, duration: 0.4 });
        if (nt) gsap.to(nt, { autoAlpha: 1, duration: 0.4 });
      } else if (id2 === "lights") {
        const glow = sceneEl.querySelector<SVGEllipseElement>("[data-lights-glow]");
        if (glow) gsap.to(glow, { opacity: 0, duration: 0.5 });
      } else if (id2 === "tea") {
        const steam = sceneEl.querySelector<SVGGElement>("[data-steam-wrap]");
        if (steam) gsap.to(steam, { scale: 1, y: 0, duration: 0.5 });
      } else if (id2 === "cake") {
        const glow = sceneEl.querySelector<SVGEllipseElement>("[data-cake-glow]");
        if (glow) gsap.to(glow, { opacity: 0, duration: 0.5 });
      }
    };
    hoverRef.current = { scene: sceneEl, cleanup };
  };

  const onSceneEnter = (e: React.PointerEvent) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = (e.target as Element).closest?.("[data-scene]");
    if (!el) {
      // Moved onto empty courtyard — release the previous scene's hover
      hoverRef.current.cleanup?.();
      hoverRef.current = { scene: null, cleanup: null };
      return;
    }
    if (hoverRef.current.scene === el) return;
    hoverRef.current.cleanup?.();
    runHover(el);
  };

  const onSceneLeave = (e: React.PointerEvent) => {
    const el = (e.target as Element).closest?.("[data-scene]");
    if (!el || hoverRef.current.scene !== el) return;
    hoverRef.current.cleanup?.();
    hoverRef.current = { scene: null, cleanup: null };
  };

  return (
    <section
      id="community"
      ref={sectionRef}
      aria-label="Community — Chapter Three"
      className="relative bg-cream"
    >
      <div
        onPointerEnter={onSceneEnter}
        onPointerLeave={onSceneLeave}
        className="relative h-[100svh] overflow-hidden"
      >
        <CourtyardScene sceneRef={sceneRef} />

        <ScrollSnap />

        {/* One small butterfly, high in the courtyard air */}
        <GardenDecor
          className="z-[15]"
          butterflies={[
            { spot: { top: "15%", left: "9%" }, size: 24, rotate: -8, dur: 6.5, delay: 0.6, dx: 10 },
          ]}
        />

        {/* A falling tree leaf, triggered by hovering the big tree */}
        <div
          ref={leafRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-[47%] top-[14%] h-3 w-3 rounded-[62%_38%_58%_42%] bg-[#8DB38F] opacity-0"
        />
      </div>
    </section>
  );
}
