"use client";

import { useEffect, useRef, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "./Header";
import OpeningText from "./OpeningText";
import FollowHint from "./FollowHint";
import SoundToggle from "./SoundToggle";
import GardenScene, { type SceneHandle } from "./GardenScene";
import HeroButterflyJourney from "./HeroButterflyJourney";
import ScrollSnap from "@/components/shared/ScrollSnap";

/**
 * SECTION ONE — the opening scene of the SenJun story.
 *
 * A split layout: the story on the left, the animated garden illustration on
 * the right. Lenis gives the scroll its slow, soft weight; as soon as the
 * visitor scrolls, the butterfly begins its upward flight into Section Two.
 */
export default function SectionOne() {
  const [scrolled, setScrolled] = useState(false);
  const sceneRef = useRef<SceneHandle>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const exitedRef = useRef(false);
  const rafPending = useRef(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenisRef.current = lenis;
    // Exposed for ScrollSnap's one-scroll-one-page glide
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    // Keep ScrollTrigger (used by later chapters) in sync with Lenis
    lenis.on("scroll", ScrollTrigger.update);

    let rafId = 0;
    const raf = (time: number) => {
      // Lenis intercepts the wheel and animates the scroll itself — if its
      // raf loop ever threw, the page would silently refuse to scroll.
      // Keep the loop alive no matter what.
      try {
        lenis.raf(time);
      } catch {
        /* never let the scroll driver die */
      }
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 14);
      // As soon as scrolling begins, the butterfly leaves…
      if (y > 80 && !exitedRef.current) {
        exitedRef.current = true;
        sceneRef.current?.beginExit();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // When the tab is hidden, stop ALL animation work (GSAP + CSS) so the
    // page can't grind to a halt in the background.
    const onVis = () => {
      const hidden = document.hidden;
      document.documentElement.classList.toggle("anim-paused", hidden);
      if (hidden) gsap.globalTimeline.pause();
      else gsap.globalTimeline.play();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
      document.documentElement.classList.remove("anim-paused");
      gsap.globalTimeline.play();
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  const handleNav = (hash: string) => {
    const target = document.querySelector(hash);
    if (!target) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target as HTMLElement, { offset: 0, duration: 1.05 });
    } else {
      (target as HTMLElement).scrollIntoView({ behavior: "smooth" });
    }
  };

  // Butterfly curiosity — throttled to one check per animation frame
  const onMove = (e: React.MouseEvent) => {
    if (rafPending.current) return;
    rafPending.current = true;
    requestAnimationFrame(() => {
      rafPending.current = false;
      sceneRef.current?.startle(e.clientX, e.clientY);
    });
  };

  return (
    <div onMouseMove={onMove}>
      <Header scrolled={scrolled} onNav={handleNav} />

      <section
        id="top"
        aria-label="Welcome to SenJun"
        className="relative flex min-h-[100svh] flex-col-reverse overflow-hidden bg-cream lg:flex-row"
      >
        {/* Story — left */}
        <div className="relative z-10 flex flex-col justify-center px-7 pb-28 pt-8 sm:px-12 lg:w-[44%] lg:pb-24 lg:pt-36">
          <OpeningText />
        </div>

        {/* Illustration — right, and larger than the text */}
        {/* No overflow clip on purpose: the artwork bleeds a little past the
            column and its left-edge mask dissolves it into the cream. */}
        <div className="senjun-hero-media relative h-[48vh] w-full shrink-0 sm:h-[54vh] lg:h-auto lg:w-[56%]">
          <img
            src="/images/senjun-hero.png"
            alt="SenJun community arriving home"
            className="senjun-hero-image"
          />
          {/* Chapter One's choreography layer — invisible now, but it still
              owns the butterfly's flight in this scene's coordinates. */}
          <GardenScene ref={sceneRef} />
        </div>

        {/* Middle transition — a small butterfly leading the visitor from the
            story into the artwork (desktop only; decorative). */}
        <HeroButterflyJourney />

        {/* One scroll = one segment — Section One snaps like the rest */}
        <ScrollSnap />

        <FollowHint />
        <SoundToggle />
      </section>
    </div>
  );
}
