"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import PathwayScene from "./scene/PathwayScene";
import Travellers, { type TravellersHandle } from "./Travellers";
import { butterflyDirector, type Point } from "@/lib/butterfly-director";
import { butterflyStore, BUTTERFLY_EXIT_EVENT } from "@/lib/butterfly-store";
import { gateSectionWhenNear } from "@/lib/gate-section";
import ScrollSnap from "@/components/shared/ScrollSnap";
import GardenDecor from "@/components/shared/GardenDecor";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

/**
 * SECTION TWO — the second chapter of the SenJun story.
 *
 * The visitor has followed the butterfly here. Now they discover why this
 * place exists — not through paragraphs, but by walking inside a living
 * storybook: the butterfly continues its flight (the SAME global element),
 * swoops down onto the garden path and leads three anime travellers along
 * it toward the "Way to SenJun" signpost, and the afternoon slowly warms.
 *
 * The site is FOUR full-viewport segments with one scroll per segment. This
 * chapter is one such segment: the scene fills the viewport, its ambient life
 * runs whenever the chapter is near, and the story choreography auto-plays
 * (condensed) each time the segment becomes active — no pinning, no scroll
 * scrubbing, so scrolling itself stays buttery.
 */

const PETALS = [
  { left: "4%", size: 11, color: "#F7C7D4", drift: "5vw", duration: 14, delay: 0, opacity: 0.8 },
  { left: "12%", size: 9, color: "#F6D889", drift: "-4vw", duration: 17, delay: 2.5, opacity: 0.7 },
  { left: "21%", size: 12, color: "#E8C6E4", drift: "6vw", duration: 15, delay: 1.2, opacity: 0.75 },
  { left: "29%", size: 8, color: "#F7C7D4", drift: "-6vw", duration: 18, delay: 4, opacity: 0.7 },
  { left: "38%", size: 10, color: "#F6D889", drift: "4vw", duration: 13, delay: 0.6, opacity: 0.8 },
  { left: "47%", size: 9, color: "#E8C6E4", drift: "-5vw", duration: 16, delay: 3.2, opacity: 0.75 },
  { left: "56%", size: 11, color: "#F7C7D4", drift: "5vw", duration: 14, delay: 1.8, opacity: 0.8 },
  { left: "64%", size: 8, color: "#F6D889", drift: "-4vw", duration: 19, delay: 5, opacity: 0.7 },
  { left: "72%", size: 10, color: "#E8C6E4", drift: "6vw", duration: 15, delay: 0.9, opacity: 0.75 },
  { left: "80%", size: 9, color: "#F7C7D4", drift: "-5vw", duration: 17, delay: 2.2, opacity: 0.7 },
  { left: "88%", size: 11, color: "#F6D889", drift: "4vw", duration: 14, delay: 3.8, opacity: 0.75 },
  { left: "95%", size: 8, color: "#E8C6E4", drift: "-6vw", duration: 18, delay: 1.4, opacity: 0.7 },
];

/** Condense the ~90-unit story into roughly 15 seconds of real time */
const STORY_TIMESCALE = 6;

export default function SectionTwo() {
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<SVGSVGElement>(null);
  const warmRef = useRef<HTMLDivElement>(null);
  const travellersRef = useRef<TravellersHandle>(null);
  const storyRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const section = sectionRef.current;
    if (!section) return;

    // Scene point (SVG units) -> viewport pixels. The scene fills the
    // viewport while its segment is active and the butterfly lives in a fixed
    // (viewport-space) layer, so the live CTM already maps into the space the
    // butterfly moves in.
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

    /* ---------------- ambient life (real time, gated by proximity) -------- */
    const ambientTweens: Array<gsap.core.Tween | gsap.core.Timeline> = [];
    let ambientCtx: gsap.Context | null = null;
    if (!reduced) {
      ambientCtx = gsap.context(() => {
        gsap.utils.toArray<SVGGElement>("[data-ambient='cloud2']").forEach((el, i) => {
          ambientTweens.push(
            gsap.fromTo(
              el,
              { x: -300 },
              { x: 1500, duration: 60 + i * 14, ease: "none", repeat: -1, delay: i * 6 }
            )
          );
        });
        ambientTweens.push(
          gsap.to("[data-ambient='rays2']", {
            rotation: -4,
            duration: 110,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            transformOrigin: "950px 205px",
          })
        );
        gsap.utils.toArray<SVGGElement>("[data-ambient='bird2']").forEach((el, i) => {
          ambientTweens.push(
            gsap.fromTo(
              el,
              { x: -180 },
              { x: 1380, duration: i ? 55 : 40, ease: "none", repeat: -1, delay: i * 15 }
            )
          );
        });
        gsap.utils.toArray<SVGGElement>("[data-ambient^='farbf']").forEach((el) => {
          ambientTweens.push(
            gsap.to(el, { x: 46, y: -26, duration: 7, yoyo: true, repeat: -1, ease: "sine.inOut" })
          );
        });
      }, section);
    }

    const stopAmbientGate = gateSectionWhenNear(section, ambientTweens);

    /* ---------------- the story — auto-played per activation --------------- */
    const buildStory = () => {
      storyRef.current?.kill();
      storyRef.current = null;

      if (reduced) {
        if (warmRef.current) gsap.set(warmRef.current, { opacity: 1 });
        travellersRef.current?.showStatic();
        return;
      }
      if (!butterflyDirector.isReady()) return;

      /* Chapter One's scroll exit is a standalone 2.4s flight that can still
         be mid-air when this story builds; its onComplete hides the butterfly
         (and writes the store) long after our own autoAlpha:1 has finished.
         This chapter owns the character from here, so retire that flight —
         it has already carried the butterfly to the entry point we want. */
      gsap.killTweensOf(butterflyDirector.el);

      /* The butterfly begins exactly where Chapter One left it */
      const st = butterflyStore.getState();
      const entry: Point = st.exited
        ? { x: st.x * window.innerWidth, y: st.y * window.innerHeight }
        : { x: window.innerWidth * 0.78, y: window.innerHeight * 0.06 };
      butterflyDirector.setPosition(entry.x, entry.y);
      butterflyDirector.setVisible(false);
      butterflyDirector.trailReset();
      butterflyDirector.flapSpeed("slow");

      /* Start every story-scrolled visual from a known state */
      if (warmRef.current) gsap.set(warmRef.current, { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "sine.inOut" }, paused: true });

      /* The travellers own the road geometry; the butterfly borrows it, so
         every waypoint is derived from the actual path — always a clear gap
         ahead of the walkers, never straying over grass or river. */
      const guide =
        travellersRef.current?.plan() ?? {
          hover: { x: 643, y: 532 },
          travel: [
            { x: 643, y: 532 },
            { x: 700, y: 505 },
            { x: 760, y: 442 },
            { x: 815, y: 372 },
          ],
          land: { x: 836, y: 388 },
        };

      const bf = (path: Point[], dur: number, pos: number, vars: gsap.TweenVars = {}) =>
        tl.to(
          butterflyDirector.el,
          {
            motionPath: {
              path: path.map(T),
              alignOrigin: [0.5, 0.5],
              autoRotate: 90,
              // MotionPathPlugin prepends the element's CURRENT position to the
              // path when it initialises. Chapter One can still be flying the
              // butterfly when a tween inits, which would splice a stray sky
              // point into the front of an otherwise exact route — so every
              // waypoint here is absolute, start to finish.
              fromCurrent: false,
            },
            ease: "sine.inOut",
            duration: dur,
            ...vars,
          },
          pos
        );
      // For paths that already contain viewport-pixel points (the chapter entry)
      const bfRaw = (path: Point[], dur: number, pos: number, vars: gsap.TweenVars = {}) =>
        tl.to(
          butterflyDirector.el,
          {
            motionPath: {
              path,
              alignOrigin: [0.5, 0.5],
              autoRotate: 90,
              fromCurrent: false,
            },
            ease: "sine.inOut",
            duration: dur,
            ...vars,
          },
          pos
        );

      /* --- opening: the butterfly continues its flight --- */
      butterflyDirector.flapSpeed("fast");
      tl.to(butterflyDirector.el, { autoAlpha: 1, duration: 3 }, 0);
      /* It swoops down onto the path — already ahead of where the travellers
         will stand — and waits there a heartbeat before leading them on. */
      bfRaw([entry, T({ x: 700, y: 460 }), T({ x: 665, y: 505 }), T(guide.hover)], 9, 0);
      tl.call(() => butterflyDirector.flapSpeed("slow"), [], 9.2);
      tl.to(butterflyDirector.el, { y: "+=6", duration: 1.1, yoyo: true, repeat: 1, ease: "sine.inOut" }, 9.4);

      /* --- butterfly → leads the way: it tracks the same curved road at a
             constant gap ahead of the leading traveller — wings working,
             bobbing gently, banking with the path's direction, never random. */
      tl.call(() => butterflyDirector.flapSpeed("fast"), [], 12);
      bf(guide.travel, 38, 12);

      /* --- it reaches the "Way to SenJun" signpost first --- */
      bf([guide.travel[guide.travel.length - 1], guide.land], 6, 56);
      tl.call(() => butterflyDirector.flapSpeed("slow"), [], 62.2);
      tl.to(butterflyDirector.el, { y: "+=5", duration: 1.6, yoyo: true, repeat: 1, ease: "sine.inOut" }, 62.4);

      /* --- the afternoon warms --- */
      tl.to(warmRef.current, { opacity: 1, duration: 8, ease: "sine.inOut" }, 62);

      /* --- the butterfly departs toward Chapter Three --- */
      tl.call(() => {
        butterflyDirector.flapSpeed("fast");
        butterflyDirector.trailReset();
        butterflyDirector.trailFlow();
      }, [], 80);
      bf(
        // scene points — `bf` maps them through T() exactly once
        [guide.land, { x: 905, y: 240 }, { x: 962, y: 40 }, { x: 980, y: -160 }],
        8,
        80,
        {
          onUpdate: () => {
            const p = butterflyDirector.getPosition();
            butterflyDirector.trailAdd(p.x, p.y);
          },
        }
      );
      tl.call(() => {
        butterflyDirector.setVisible(false);
        butterflyDirector.trailFade(1.4, 0.3);
        const end = T({ x: 980, y: -160 });
        const nx = Math.min(0.96, Math.max(0.04, end.x / window.innerWidth));
        butterflyStore.setExited(nx, 0.02);
        window.dispatchEvent(
          new CustomEvent(BUTTERFLY_EXIT_EVENT, { detail: { x: nx, y: 0.02 } })
        );
      }, [], 88);

      /* --- the travellers appear and follow, always a step behind --- */
      travellersRef.current?.choreograph(tl);

      tl.timeScale(STORY_TIMESCALE);
      storyRef.current = tl;
      tl.play();
    };

    /* When this segment takes the viewport: build + play the story.
       When it leaves: stop it — the next segment owns the butterfly.
       `top+=10` (as in Chapter Four) so the story arms a hair before the
       glide settles: at an exact snap position ScrollTrigger's active zone
       would otherwise still read as "not yet entered". */
    const activation = ScrollTrigger.create({
      trigger: section,
      start: "top top+=10",
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

  return (
    <section
      id="our-story"
      ref={sectionRef}
      aria-label="Our Story — Chapter Two"
      className="relative bg-cream"
    >
      <div className="relative h-[100svh] overflow-hidden">
        <PathwayScene sceneRef={sceneRef} />

        {/* The anime travellers, planted on the garden path */}
        <Travellers ref={travellersRef} sceneRef={sceneRef} />

        {/* A small handwritten note, kept to the upper-left sky */}
        <p className="senjun-journey-note font-hand text-[1.25rem] leading-[1.5] text-deep/75 sm:text-[1.5rem]">
          Every home begins with a little journey.
        </p>

        <ScrollSnap />

        {/* A couple of garden flowers, kept to the outer edge */}
        <GardenDecor
          className="z-[15]"
          flowers={[
            { spot: { top: "11%", left: "5%" }, kind: "daisy", size: 18, rotate: -12, dur: 8.5, delay: 0.4 },
            { spot: { bottom: "13%", right: "7%" }, kind: "blossom", size: 15, rotate: 14, dur: 9.5, delay: 1.8 },
          ]}
        />

        {/* Falling petals */}
        <div className="pointer-events-none absolute inset-0 z-[5]" aria-hidden="true">
          {PETALS.map((p, i) => (
            <span
              key={i}
              className="petal"
              style={
                {
                  left: p.left,
                  width: p.size,
                  height: p.size * 0.82,
                  background: p.color,
                  "--drift": p.drift,
                  "--petal-duration": `${p.duration}s`,
                  "--petal-delay": `${p.delay}s`,
                  "--petal-opacity": p.opacity,
                  "--petal-color": p.color,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* Warm afternoon glow — deepens as the journey continues */}
        <div
          ref={warmRef}
          className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(246,216,137,0),rgba(246,216,137,0.38))] opacity-0"
        />
      </div>
    </section>
  );
}
