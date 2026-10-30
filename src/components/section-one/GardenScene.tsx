"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { butterflyDirector, type Point } from "@/lib/butterfly-director";
import { butterflyStore, BUTTERFLY_EXIT_EVENT } from "@/lib/butterfly-store";
import { gateSectionWhenNear } from "@/lib/gate-section";

gsap.registerPlugin(MotionPathPlugin);

/**
 * GardenScene — Chapter One's choreography.
 *
 * The painted garden has been replaced by the senjun-hero.png artwork
 * (rendered by SectionOne next to this SVG), so this element no longer
 * paints anything: it stays as the scene's coordinate system — flight
 * paths are still converted through its CTM — plus the story timeline,
 * the mouse curiosity and the scroll exit. The butterfly itself lives in
 * the global ButterflyLayer (ONE node for the whole site) and is flown
 * here in viewport pixels.
 */

export type SceneHandle = {
  svg: SVGSVGElement;
  getButterflyPoint: () => { x: number; y: number };
  startle: (clientX: number, clientY: number) => void;
  beginExit: () => void;
};

/** Butterfly orientation offset — drawn nose-up, so +90 aligns it with travel */
const AUTO_ROTATE = 90;

const BASE_POINT: Point = { x: 600, y: 745 };

// Organic flight paths (SVG user units, viewBox 0 0 1000 1000)
const PATH = {
  entry: [
    { x: 120, y: 200 },
    { x: 148, y: 330 },
    { x: 128, y: 405 },
    { x: 186, y: 452 },
    { x: 158, y: 500 },
    { x: 224, y: 548 },
    { x: 262, y: 650 },
    { x: 300, y: 760 },
  ],
  daisyLoop: [
    { x: 300, y: 760 },
    { x: 330, y: 790 },
    { x: 358, y: 772 },
    { x: 330, y: 738 },
    { x: 382, y: 788 },
    { x: 428, y: 800 },
    { x: 470, y: 815 },
    { x: 500, y: 820 },
  ],
  toFlowers: [
    { x: 500, y: 820 },
    { x: 540, y: 800 },
    { x: 562, y: 758 },
    { x: 590, y: 744 },
    { x: 620, y: 700 },
  ],
  circle: [
    { x: 620, y: 700 },
    { x: 560, y: 768 },
    { x: 512, y: 830 },
    { x: 470, y: 788 },
    { x: 400, y: 768 },
    { x: 336, y: 792 },
    { x: 302, y: 858 },
    { x: 332, y: 922 },
    { x: 402, y: 946 },
    { x: 470, y: 922 },
    { x: 502, y: 866 },
    { x: 476, y: 842 },
  ],
  land: [
    { x: 476, y: 842 },
    { x: 476, y: 852 },
    { x: 476, y: 862 },
  ],
  takeoff: [
    { x: 476, y: 862 },
    { x: 472, y: 846 },
    { x: 480, y: 830 },
    { x: 485, y: 820 },
  ],
  flyAhead: [
    { x: 485, y: 820 },
    { x: 512, y: 806 },
    { x: 542, y: 790 },
    { x: 572, y: 772 },
    { x: 600, y: 745 },
  ],
  patrol: [
    { x: 600, y: 745 },
    { x: 624, y: 730 },
    { x: 638, y: 744 },
    { x: 618, y: 756 },
    { x: 600, y: 752 },
    { x: 584, y: 742 },
    { x: 600, y: 738 },
    { x: 607, y: 746 },
  ],
};

const GardenScene = forwardRef<SceneHandle>(function GardenScene(_props, ref) {
  const svgRef = useRef<SVGSVGElement>(null);

  const storyTlRef = useRef<gsap.core.Timeline | null>(null);
  const idleActiveRef = useRef(false);
  const lastStartleRef = useRef(0);
  const exitedRef = useRef(false);
  const startleFnRef = useRef<(cx: number, cy: number) => void>(() => {});
  const beginExitFnRef = useRef<() => void>(() => {});

  useEffect(() => {
    const svg = svgRef.current;
    const bf = butterflyDirector.el;
    if (!svg || !bf) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Convert a scene point (SVG units) to viewport pixels via the live CTM */
    const toScreen = (p: Point): Point => {
      const pt = svg.createSVGPoint();
      pt.x = p.x;
      pt.y = p.y;
      const ctm = svg.getScreenCTM();
      if (!ctm) return { x: p.x, y: p.y };
      const s = pt.matrixTransform(ctm);
      return { x: s.x, y: s.y };
    };
    const px: Record<string, Point[]> = {};
    let basePoint: Point = BASE_POINT;
    const convert = () => {
      px.entry = PATH.entry.map(toScreen);
      px.daisyLoop = PATH.daisyLoop.map(toScreen);
      px.toFlowers = PATH.toFlowers.map(toScreen);
      px.circle = PATH.circle.map(toScreen);
      px.land = PATH.land.map(toScreen);
      px.takeoff = PATH.takeoff.map(toScreen);
      px.flyAhead = PATH.flyAhead.map(toScreen);
      px.patrol = PATH.patrol.map(toScreen);
      basePoint = toScreen(BASE_POINT);
    };
    convert();

    /* Idle life for the butterfly — gated to run only while Chapter One is
       near the viewport (the painted garden it used to animate is gone). */
    const idleLife: Array<gsap.core.Tween | gsap.core.Timeline> = [];
    let ungate: () => void = () => {};

    const ctx = gsap.context(() => {
      /* ---------------- setup ---------------- */
      butterflyDirector.setPosition(px.entry[0].x, px.entry[0].y);
      butterflyDirector.setVisible(false);

      /* ---------------- the butterfly's story ---------------- */
      const story = gsap.timeline({ defaults: { ease: "sine.inOut" } });
      storyTlRef.current = story;

      const mp = (path: Point[], overrides?: gsap.TweenVars) => ({
        motionPath: {
          path,
          alignOrigin: [0.5, 0.5],
          autoRotate: AUTO_ROTATE,
        },
        ...overrides,
      });

      story.addLabel("enter", 2.5);
      story.fromTo(
        bf,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 1.3, ease: "power2.out" },
        "enter"
      );
      story.to(bf, mp(px.entry, { duration: 3.6 }), "enter");

      // hover at the lavender (pauses, changes direction)
      story.to(
        bf,
        { y: "+=9", rotation: "+=7", duration: 1.7, yoyo: true, repeat: 1, ease: "sine.inOut" },
        "enter+=3.6"
      );

      story.to(bf, mp(px.daisyLoop, { duration: 2.6 }), "enter+=7.0");
      story.to(bf, mp(px.toFlowers, { duration: 2.2 }), "enter+=9.6");

      // circles the flowerbed once
      story.to(bf, mp(px.circle, { duration: 3.4 }), "enter+=11.8");

      // lands on the suitcase handle — one second
      story.to(bf, mp(px.land, { duration: 1.2 }), "enter+=15.2");
      story.call(() => butterflyDirector.flapSpeed("slow"), [], "enter+=16.0");
      story.call(() => butterflyDirector.flapSpeed("fast"), [], "enter+=17.7");

      // takes off, hovers, waits
      story.to(bf, mp(px.takeoff, { duration: 1.3 }), "enter+=17.7");
      story.to(
        bf,
        { y: "+=6", rotation: "+=5", duration: 0.9, yoyo: true, repeat: 1, ease: "sine.inOut" },
        "enter+=19.0"
      );

      // the butterfly flies ahead along the path
      story.to(bf, mp(px.flyAhead, { duration: 2.2 }), "enter+=24.0");

      /* ---------------- idle life for the butterfly ---------------- */
      const inner = butterflyDirector.inner;
      const bob = gsap.to(inner, {
        y: "+=6",
        rotation: "+=6",
        duration: 2.1,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        paused: true,
      });
      const patrol = gsap.timeline({ repeat: -1, repeatDelay: 6.5, paused: true });
      patrol.to(bf, mp(px.patrol, { duration: 3.2, ease: "sine.inOut" }));
      idleLife.push(bob, patrol);

      story.eventCallback("onComplete", () => {
        idleActiveRef.current = true;
        // If the garden is off-screen the gate keeps idle life paused; it
        // restarts everything when the visitor returns.
        if (svg.classList.contains("is-off")) return;
        idleLife.forEach((t) => t.play());
      });

      /* ---------------- mouse curiosity ---------------- */
      const startleButterfly = (clientX: number, clientY: number) => {
        if (exitedRef.current || !idleActiveRef.current || reduced) return;
        if (Date.now() - lastStartleRef.current < 2600) return;
        const pos = butterflyDirector.getPosition();
        const dx = pos.x - clientX;
        const dy = pos.y - clientY;
        const dist = Math.hypot(dx, dy);
        if (dist > 150) return;

        lastStartleRef.current = Date.now();
        bob.pause();
        patrol.pause();

        const ux = dx / (dist || 1);
        const uy = dy / (dist || 1);
        const tx = pos.x + ux * 122 + (Math.random() * 26 - 13);
        const ty = pos.y + uy * 62 - 46;

        gsap.to(bf, {
          motionPath: {
            path: [
              { x: pos.x, y: pos.y },
              { x: pos.x + ux * 46, y: pos.y + uy * 30 - 16 },
              { x: tx, y: ty },
            ],
            curviness: 1.15,
            alignOrigin: [0.5, 0.5],
            autoRotate: AUTO_ROTATE,
          },
          duration: 1.05,
          ease: "power2.out",
          onComplete: () => {
            if (exitedRef.current) return;
            const np = butterflyDirector.getPosition();
            const ang = (Math.atan2(clientY - np.y, clientX - np.x) * 180) / Math.PI;
            // looks back at the visitor, waits…
            butterflyDirector.lookAt(ang, 0.6);
            gsap.delayedCall(1.1, () => {
              if (exitedRef.current) return;
              gsap.to(bf, {
                motionPath: {
                  path: [
                    { x: np.x, y: np.y },
                    {
                      x: np.x + (basePoint.x - np.x) * 0.45,
                      y: np.y + (basePoint.y - np.y) * 0.4 - 22,
                    },
                    { x: basePoint.x, y: basePoint.y },
                  ],
                  curviness: 1,
                  alignOrigin: [0.5, 0.5],
                  autoRotate: AUTO_ROTATE,
                },
                duration: 1.6,
                ease: "sine.inOut",
                onComplete: () => {
                  if (exitedRef.current) return;
                  butterflyDirector.lookAt(0, 0.5);
                  bob.play();
                  patrol.restart();
                },
              });
            });
          },
        });
      };

      /* ---------------- scroll exit ---------------- */
      const beginExit = () => {
        if (exitedRef.current) return;
        exitedRef.current = true;
        story.pause();
        bob.pause();
        patrol.pause();

        const p0 = butterflyDirector.getPosition();
        const exitPath: Point[] = [
          { x: p0.x, y: p0.y },
          { x: p0.x + 150, y: p0.y - 260 },
          { x: p0.x + 230, y: p0.y - 560 },
          { x: p0.x + 300, y: -200 },
        ];

        // glowing dotted trail
        butterflyDirector.trailReset();
        butterflyDirector.trailFlow();

        let acc = 0;
        gsap.to(bf, {
          motionPath: {
            path: exitPath,
            alignOrigin: [0.5, 0.5],
            autoRotate: AUTO_ROTATE,
          },
          duration: 2.4,
          ease: "power2.in",
          onUpdate: () => {
            acc += 1;
            if (acc % 2 === 0) {
              const p = butterflyDirector.getPosition();
              butterflyDirector.trailAdd(p.x, p.y);
            }
          },
          onComplete: () => {
            // The butterfly never leaves the document — it rests off-stage.
            butterflyDirector.setVisible(false);
            butterflyDirector.trailFade(1.8, 0.5);

            const nx = Math.min(0.96, Math.max(0.04, (p0.x + 300) / window.innerWidth));
            butterflyStore.setExited(nx, 0.04);
            if (typeof window !== "undefined") {
              window.dispatchEvent(
                new CustomEvent(BUTTERFLY_EXIT_EVENT, { detail: { x: nx, y: 0.04 } })
              );
            }
          },
        });

      };

      startleFnRef.current = startleButterfly;
      beginExitFnRef.current = beginExit;
    }, svg);

    /* Freeze the butterfly's idle life while Chapter One is off-screen */
    ungate = gateSectionWhenNear(svg, [], {
      pauseOnly: idleLife,
      onActivate: () => {
        // Never wake the idle life after the chapter has exited — the exit
        // flight owns the butterfly once the visitor scrolls away.
        if (!exitedRef.current && idleActiveRef.current) idleLife.forEach((t) => t.play());
      },
    });

    /* Keep the flight paths in sync with the layout (rare mid-story resizes) */
    const onResize = () => {
      convert();
      const story = storyTlRef.current;
      if (exitedRef.current) return;
      if (story && story.progress() === 0) {
        butterflyDirector.setPosition(px.entry[0].x, px.entry[0].y);
      } else if (idleActiveRef.current) {
        butterflyDirector.setPosition(basePoint.x, basePoint.y);
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ungate();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      svg: svgRef.current as SVGSVGElement,
      getButterflyPoint: () => butterflyDirector.getPosition(),
      startle: (cx: number, cy: number) => startleFnRef.current(cx, cy),
      beginExit: () => beginExitFnRef.current(),
    }),
    []
  );

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
    />
  );
});

export default GardenScene;
