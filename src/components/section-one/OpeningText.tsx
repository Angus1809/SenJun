"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Opening copy — the story unfolds in three stepped statements, each one
 * smaller, quieter and indented a little further right, then the buttons.
 * Timeline (absolute seconds — a gentle fade + rise, one step at a time):
 *   0.10s — HOME ISN'T ALWAYS WHERE YOU WERE BORN.   (the statement)
 *   0.35s — Sometimes... home is where someone waits. (the feeling)
 *   0.60s — Welcome to SenJun...                      (the introduction)
 *   0.85s — Buttons
 */
export default function OpeningText() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.fromTo(
        "[data-reveal='1']",
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 1.3 },
        0.1
      )
        .fromTo(
          "[data-reveal='2']",
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 1.15 },
          0.35
        )
        .fromTo(
          "[data-reveal='3']",
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 1.2 },
          0.6
        )
        .fromTo(
          "[data-reveal='4']",
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.9 },
          0.85
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="max-w-xl">
      {/* Step 1 — the statement */}
      <h1
        data-reveal="1"
        className="reveal-line font-hand text-[2.5rem] font-semibold leading-[1.15] text-deep sm:text-6xl lg:max-w-[480px] lg:text-[3.5rem]"
      >
        HOME ISN&rsquo;T ALWAYS
        <br />
        WHERE YOU WERE BORN.
      </h1>

      {/* Step 2 — the feeling (larger and semi-bold now, still stepped to
          the right): 24–30px desktop, weight 600, two handwritten lines. */}
      <p
        data-reveal="2"
        className="reveal-line ml-5 mt-10 max-w-[400px] font-hand text-[1.5rem] font-semibold italic leading-[1.6] text-deep/85 sm:ml-7 sm:text-[1.65rem] lg:ml-9 lg:mt-12 lg:text-[1.8rem]"
      >
        Sometimes... home is where
        <br />
        someone waits for you.
      </p>

      {/* Step 3 — the introduction (quieter still, stepped further right):
          ~18px desktop, weight 600, ~440px measure — clearly below step 2
          in the hierarchy. */}
      <p
        data-reveal="3"
        className="reveal-line ml-9 mt-9 max-w-[440px] font-hand text-[1rem] font-semibold leading-[1.7] text-[#7E8D7B] sm:ml-14 sm:text-[1.0625rem] lg:ml-20 lg:mt-10 lg:text-[1.15rem]"
      >
        Welcome to SenJun. A home built with love, shared with everyone who
        walks through its doors.
      </p>

      {/* Buttons — back on the base line, below the story. Both read as the
          nav's "Book a Visit": dark pill, white text, soft shadow, lift on
          hover (16/28 padding, 16px semibold type ≈ 56px tall). */}
      <div
        data-reveal="4"
        className="reveal-line mt-8 flex flex-wrap items-center gap-4 lg:mt-9"
      >
        <a
          href="#rooms"
          className="group inline-flex items-center rounded-full bg-deep px-7 py-4 text-base font-semibold tracking-wide text-cream shadow-[0_14px_30px_-14px_rgba(51,68,78,0.55)] transition-all duration-300 hover:-translate-y-1 hover:bg-deep/90 hover:shadow-[0_22px_40px_-14px_rgba(51,68,78,0.6)]"
        >
          Find Your Room
        </a>
        <a
          href="#our-story"
          className="group inline-flex items-center gap-2 rounded-full bg-deep px-7 py-4 text-base font-semibold tracking-wide text-cream shadow-[0_14px_30px_-14px_rgba(51,68,78,0.55)] transition-all duration-300 hover:-translate-y-1 hover:bg-deep/90 hover:shadow-[0_22px_40px_-14px_rgba(51,68,78,0.6)]"
        >
          Our Story
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            <path
              d="M2 7h10M8 3l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
