"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import HomeScene, { BUTTERFLY_REST } from "./scene/HomeScene";
import { butterflyDirector, type Point } from "@/lib/butterfly-director";
import { butterflyStore } from "@/lib/butterfly-store";
import { gateSectionWhenNear } from "@/lib/gate-section";
import ScrollSnap from "@/components/shared/ScrollSnap";
import GardenDecor from "@/components/shared/GardenDecor";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

/**
 * SECTION FOUR — the final chapter. The emotional conclusion of the journey.
 *
 * The website began at sunrise; it ends at golden hour. The butterfly flies
 * into the final scene, circles the handcrafted home once — almost
 * celebrating — and lands gently on the flowering plant by the door. It
 * watches everyone arrive, then it quietly remains there forever. The
 * guardian of SenJun.
 *
 * Only now is the story revealed: sixteen years, a Senior and a Junior, a
 * home built for everyone searching for a place to belong. The name fades in
 * — SenJun. Then the final message: you came looking for a room; you found a
 * home. Welcome home.
 *
 * The site is FOUR full-viewport segments with one scroll per segment: the
 * story choreography auto-plays (condensed) each time this segment becomes
 * active — no pinning, no scroll scrubbing, so scrolling stays buttery.
 */

/* Fireflies — deterministic scatter */
const FIREFLIES = [
  { left: "8%", top: "58%", dx: 40, dur: 8, delay: 0 },
  { left: "16%", top: "40%", dx: -30, dur: 10, delay: 1.4 },
  { left: "26%", top: "64%", dx: 24, dur: 9, delay: 2.6 },
  { left: "38%", top: "34%", dx: -36, dur: 11, delay: 0.8 },
  { left: "47%", top: "70%", dx: 30, dur: 8, delay: 3.4 },
  { left: "58%", top: "44%", dx: -26, dur: 10, delay: 1.9 },
  { left: "67%", top: "62%", dx: 34, dur: 9, delay: 0.4 },
  { left: "76%", top: "36%", dx: -32, dur: 12, delay: 2.2 },
  { left: "85%", top: "60%", dx: 26, dur: 9, delay: 1.1 },
  { left: "93%", top: "44%", dx: -20, dur: 11, delay: 3.8 },
];

/** Condense the ~103-unit story into roughly 17 seconds of real time */
const STORY_TIMESCALE = 6;

export default function SectionFour() {
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<SVGSVGElement>(null);
  const doorRef = useRef<SVGGElement>(null);
  const girlRef = useRef<SVGGElement>(null);
  const storyRef = useRef<gsap.core.Timeline | null>(null);
  const restedRef = useRef(false);
  /* The welcome (door + resident) is its OWN short timeline so the entrance
     never waits on the butterfly choreography. Both sequences play once per
     page visit and then hold, so minor scroll jitter never restarts them. */
  const welcomeRef = useRef<gsap.core.Timeline | null>(null);
  const welcomePlayedRef = useRef(false);
  const storyPlayedRef = useRef(false);

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
        gsap.utils.toArray<SVGGElement>("[data-ambient='cloud4']").forEach((el, i) => {
          ambientTweens.push(
            gsap.fromTo(el, { x: -300 }, { x: 1500, duration: 58 + i * 14, ease: "none", repeat: -1, delay: i * 7 })
          );
        });
        ambientTweens.push(
          gsap.to("[data-ambient='rays4']", {
            rotation: -4,
            duration: 110,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            transformOrigin: "300px 470px",
          })
        );
        gsap.utils.toArray<SVGGElement>("[data-ambient='bird4']").forEach((el, i) => {
          ambientTweens.push(
            gsap.fromTo(el, { x: -180 }, { x: 1380, duration: i ? 54 : 40, ease: "none", repeat: -1, delay: i * 15 })
          );
        });
      }, section);
    }

    const stopAmbientGate = gateSectionWhenNear(section, ambientTweens);

    /* ---------------- the welcome: door + resident — immediate ------------ */
    /* Plays the moment this segment activates, independent of the butterfly
       story, so the door swings and the resident appears in under a second.
       STORY_TIMESCALE (6) maps timeline units to real time: 3 units = 0.5s. */
    const settleWelcome = () => {
      gsap.set("[data-door-glow]", { opacity: 0.92 });
      if (doorRef.current) gsap.set(doorRef.current, { rotation: -72, transformOrigin: "0px 0px" });
      if (girlRef.current) gsap.set(girlRef.current, { autoAlpha: 1, x: 0, y: 0 });
    };

    const playWelcome = () => {
      if (reduced) {
        settleWelcome();
        return;
      }
      if (welcomePlayedRef.current) {
        /* Already played — only settle if it isn't still gliding to its end,
           so a quick scroll jitter never snaps the pose mid-animation. */
        if (!welcomeRef.current?.isActive()) settleWelcome();
        return;
      }
      welcomePlayedRef.current = true;

      gsap.set("[data-door-glow]", { opacity: 0 });
      if (doorRef.current) gsap.set(doorRef.current, { transformOrigin: "0px 0px" });
      if (girlRef.current) gsap.set(girlRef.current, { autoAlpha: 0, x: -16, y: -3 });

      const tl = gsap.timeline({ defaults: { ease: "sine.inOut" }, paused: true });
      tl.to("[data-door-glow]", { opacity: 0.92, duration: 3 }, 0);
      if (doorRef.current)
        tl.to(doorRef.current, { rotation: -72, duration: 3, ease: "power2.inOut" }, 0);
      /* +0.6 units = 100ms after the door starts; 4.2 units = 0.7s long, so
         the welcoming pose is complete 0.8s after the trigger. */
      if (girlRef.current)
        tl.to(girlRef.current, { autoAlpha: 1, x: 0, y: 0, duration: 4.2, ease: "power2.out" }, 0.6);
      tl.timeScale(STORY_TIMESCALE);
      welcomeRef.current = tl;
      tl.play();
    };

    /* ---------------- the story — auto-played per activation --------------- */
    const buildStory = () => {
      /* The butterfly's final viewport spot — it never leaves */
      const rest = T(BUTTERFLY_REST);

      /* Settle every STORY visual into its FINAL state (the door/resident are
         handled by settleWelcome). Used for prefers-reduced-motion and to hold
         the scene after the story has played once. */
      const settleStory = () => {
        if (butterflyDirector.isReady()) {
          butterflyDirector.setPosition(rest.x, rest.y);
          butterflyDirector.setVisible(true);
          butterflyDirector.flapSpeed("slow");
        }
        gsap.set("[data-stars]", { opacity: 0.85 });
        gsap.set("[data-window-glow]", { opacity: 0.85 });
      };

      if (reduced || storyPlayedRef.current) {
        storyRef.current?.kill();
        storyRef.current = null;
        settleStory();
        return;
      }

      storyRef.current?.kill();
      storyRef.current = null;
      restedRef.current = false;

      if (!butterflyDirector.isReady()) return;
      /* From here the story WILL play — lock it to once per page visit. */
      storyPlayedRef.current = true;

      /* The butterfly enters exactly where Chapter Three left it */
      const st = butterflyStore.getState();
      const entry: Point = st.exited
        ? { x: st.x * window.innerWidth, y: st.y * window.innerHeight }
        : { x: window.innerWidth * 0.95, y: window.innerHeight * 0.03 };
      butterflyDirector.setPosition(entry.x, entry.y);
      butterflyDirector.setVisible(false);
      butterflyDirector.trailReset();

      /* Start every story-scrolled visual from a known state. The heading,
         tagline and contact cards are NOT part of this: they belong to the
         visitor, not the story, and are visible the moment the segment
         exists (see `fade-in-now`). */
      gsap.set("[data-stars]", { opacity: 0 });
      gsap.set("[data-window-glow]", { opacity: 0 });

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

      /* --- opening: the butterfly flies in and circles the house once,
             almost celebrating --- */
      butterflyDirector.flapSpeed("fast");
      tl.to(butterflyDirector.el, { autoAlpha: 1, duration: 3 }, 0);
      bfRaw([entry, T({ x: 800, y: 470 }), T({ x: 742, y: 520 })], 6, 0);
      bf(circlePts(640, 500, 150), 11, 6);
      tl.call(() => butterflyDirector.flapSpeed("slow"), [], 17.2);
      tl.to(butterflyDirector.el, { y: "+=6", duration: 1.8, yoyo: true, repeat: 1, ease: "sine.inOut" }, 17.4);
      tl.to(butterflyDirector.el, { y: "+=4", duration: 1.6, yoyo: true, repeat: 1, ease: "sine.inOut" }, 40);
      tl.to(butterflyDirector.el, { y: "+=4", duration: 1.6, yoyo: true, repeat: 1, ease: "sine.inOut" }, 50);
      tl.to(butterflyDirector.el, { y: "+=4", duration: 1.6, yoyo: true, repeat: 1, ease: "sine.inOut" }, 58);

      /* --- the butterfly hovers by the door --- */
      bf([T({ x: 742, y: 520 }), T({ x: 650, y: 545 }), T({ x: 640, y: 560 })], 5, 20);
      tl.to(butterflyDirector.el, { y: "+=5", duration: 1.6, yoyo: true, repeat: 1, ease: "sine.inOut" }, 26);

      /* --- evening deepens: window lights and the first stars ---
             (the door itself is lit by the separate welcome timeline) */
      tl.to("[data-window-glow]", { opacity: 0.85, duration: 8, ease: "sine.inOut" }, 28);
      tl.to("[data-stars]", { opacity: 0.85, duration: 10, ease: "sine.inOut" }, 30);

      /* --- the butterfly settles on the flowering plant by the door --- */
      butterflyDirector.flapSpeed("fast");
      bf([T({ x: 640, y: 560 }), T({ x: 612, y: 572 }), T({ x: 574, y: 588 })], 8, 66);
      tl.call(() => butterflyDirector.flapSpeed("slow"), [], 74.4);
      tl.to(butterflyDirector.el, { y: "+=5", duration: 1.7, yoyo: true, repeat: 1, ease: "sine.inOut" }, 74.6);
      tl.to(butterflyDirector.el, { y: "+=4", duration: 1.7, yoyo: true, repeat: 1, ease: "sine.inOut" }, 84);
      tl.to(butterflyDirector.el, { y: "+=4", duration: 1.7, yoyo: true, repeat: 1, ease: "sine.inOut" }, 90);

      /* --- the engraved plaques and the closing message now belong to the
             immediate layer (they fade in on render, never on this timeline),
             so the visitor always finds them the moment the segment appears. --- */

      /* --- the ending: the butterfly lifts, flies a tiny circle, and
             returns — "my work is done". It never leaves. --- */
      tl.call(() => {
        if (restedRef.current) return;
        restedRef.current = true;
        butterflyDirector.flapSpeed("fast");
        const p = butterflyDirector.getPosition();
        gsap.to(butterflyDirector.el, {
          motionPath: {
            path: [p, { x: p.x + 26, y: p.y - 14 }, { x: p.x - 4, y: p.y - 22 }, { x: p.x, y: p.y }],
            alignOrigin: [0.5, 0.5],
            autoRotate: 90,
          },
          duration: 4.6,
          ease: "sine.inOut",
          onComplete: () => butterflyDirector.flapSpeed("slow"),
        });
      }, [], 98);

      tl.timeScale(STORY_TIMESCALE);
      storyRef.current = tl;
      tl.play();
    };

    /* The trigger fires as soon as this final segment slides into view —
       "top 30%" is the point where the doorway and the resident actually
       become visible on screen. It sits well BEFORE the resting scroll
       position, so one scroll gesture is always enough: the user never has to
       reach the very bottom of the page (or nudge it again) to start the
       welcome. "bottom top" keeps the window open for the whole segment. */
    const activation = ScrollTrigger.create({
      trigger: section,
      start: "top 30%",
      end: "bottom top",
      onToggle: (self) => {
        if (self.isActive) {
          /* Welcome first — it never waits on the butterfly story. */
          playWelcome();
          buildStory();
        } else {
          /* Only the story is held back; the welcome runs to its end so the
             door always finishes open and the resident keeps her pose. */
          storyRef.current?.kill();
          storyRef.current = null;
        }
      },
    });

    return () => {
      activation.kill();
      storyRef.current?.kill();
      storyRef.current = null;
      welcomeRef.current?.kill();
      welcomeRef.current = null;
      stopAmbientGate();
      ambientCtx?.revert();
    };
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-label="The Journey Home — Chapter Four"
      className="relative bg-cream"
    >
      <div className="relative h-[100svh] overflow-hidden">
        <HomeScene sceneRef={sceneRef} doorRef={doorRef} girlRef={girlRef} />

        <ScrollSnap />

        {/* The garden reaches the porch: a daisy by the path and three small
            butterflies drifting slowly by the tree, the cottage and the path */}
        <GardenDecor
          className="z-[15]"
          flowers={[
            { spot: { bottom: "27%", left: "3%" }, kind: "daisy", size: 16, rotate: 10, dur: 9, delay: 1.2 },
          ]}
          butterflies={[
            { spot: { top: "34%", left: "31%" }, size: 17, rotate: -7, dur: 9, delay: 1.4, dx: -9 },
            { spot: { top: "28%", left: "52%" }, size: 15, rotate: 8, dur: 7.5, delay: 3.1, dx: 8 },
            { spot: { top: "43%", right: "21%" }, size: 16, rotate: 6, dur: 8, delay: 2.4, dx: -8 },
          ]}
        />

        {/* Fireflies drifting in the evening air */}
        <div className="pointer-events-none absolute inset-0 z-[5]" aria-hidden="true">
          {FIREFLIES.map((f, i) => (
            <span
              key={i}
              className="firefly"
              style={
                {
                  left: f.left,
                  top: f.top,
                  "--ff-dx": `${f.dx}px`,
                  "--ff-dur": `${f.dur}s`,
                  "--ff-delay": `${f.delay}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* The closing message — set in the quiet upper sky, clear of the
            tree, the cottage roof and the navbar. Two short lines: the second
            one in the handwritten face. */}
        <div
          className="fade-in-now pointer-events-none absolute inset-x-0 top-[13%] z-20 flex flex-col items-center gap-1 px-6 text-center sm:top-[14%]"
        >
          <p className="font-body text-[0.7rem] font-medium uppercase tracking-[0.42em] text-[#5C3A24]/75 sm:text-[0.8rem]">
            More than a place to stay…
          </p>
          <p className="font-hand text-[2.1rem] font-bold leading-none text-[#4E3418] drop-shadow-[0_1px_0_rgba(255,244,214,0.5)] sm:text-[3rem]">
            A place to call home.
          </p>
        </div>

        {/* The old centred porch signboard ("Book Your Home / The door is
            open") is gone: it sat on top of the cottage entrance and hid the
            welcoming resident behind it. Her own wooden Welcome board now IS
            the entrance message, the navbar keeps the "Book a Visit" CTA, and
            the #rooms link now lands on the real Rooms gallery earlier in the
            page. */}

        {/* Engraved wooden contact signs — tucked into the bottom-right so
            they never cover the doorway or the welcoming resident. They wrap
            into two neat columns on small screens and never overflow. */}
        <div
          className="fade-in-now absolute bottom-[4%] right-3 z-30 flex max-w-[min(92vw,680px)] flex-wrap items-end justify-end gap-2.5 max-sm:bottom-[2%] sm:right-6 sm:gap-4"
        >
          {[
            { icon: "📍", word: "Address", sub: "12 Garden Lane" },
            { icon: "📞", word: "Phone", sub: "+91 98765 43210" },
            { icon: "✉", word: "Email", sub: "hello@senjun.home" },
            { icon: "🌐", word: "Instagram", sub: "@senjun.home" },
          ].map((c) => (
            <a
              key={c.word}
              href={
                c.word === "Email"
                  ? "mailto:hello@senjun.home"
                  : c.word === "Phone"
                    ? "tel:+919876543210"
                    : c.word === "Instagram"
                      ? "https://instagram.com"
                      : "https://maps.google.com"
              }
              target={c.word === "Address" || c.word === "Instagram" ? "_blank" : undefined}
              rel={c.word === "Address" || c.word === "Instagram" ? "noreferrer" : undefined}
              className="plaque flex min-h-[76px] min-w-[124px] flex-col items-center justify-center gap-1 px-5 py-2.5 text-center sm:min-w-[136px]"
              aria-label={`SenJun ${c.word}: ${c.sub}`}
            >
              <span className="text-sm" aria-hidden="true">
                {c.icon}
              </span>
              <span className="font-body text-[0.65rem] font-bold uppercase leading-none tracking-[0.22em] text-[#4E3418]">
                {c.word}
              </span>
              <span className="font-hand text-[1rem] leading-none text-[#4E3418]/85">{c.sub}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
