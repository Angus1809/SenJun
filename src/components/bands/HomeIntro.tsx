"use client";

import PhotoFrame from "@/components/shared/PhotoFrame";
import ScrollSnap from "@/components/shared/ScrollSnap";

/**
 * HOME — the editorial bridge between the illustrated opening and the story.
 *
 * The first segment is a full-height split of copy and artwork with no room
 * for a real photograph, so the property introduces itself in the transition
 * right after it: one prominent rounded-rectangle photo of the house, a thin
 * warm-beige border, a peach sheet offset behind it, the short welcome copy
 * and a link onward to the rooms gallery.
 *
 * The band is a real snap stop (registered in ScrollSnap's SEGMENTS), so the
 * one-gesture-per-segment rhythm of the site glides to it instead of jumping
 * clean over it. `z-[39]` keeps it above the fixed butterfly layer (z-38) and
 * below the mobile menu (z-40) and navbar (z-50).
 */
export default function HomeIntro() {
  return (
    <section
      id="home-intro"
      aria-label="A Little Place to Call Home"
      className="relative z-[39] flex min-h-[92svh] items-center bg-cream"
    >
      {/* pt-24 clears the 81px (65px mobile) translucent header bar, so the
          first line of every band is readable at rest rather than behind it. */}
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-10 px-6 pt-24 pb-16 sm:px-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        {/* The house itself — a tall rounded rectangle, crop kept gentle so the
            staircase and the plant at its foot stay readable. */}
        <PhotoFrame
          src="/images/building.png"
          alt="A festive collage: the SenJun building lit up for Diwali, a flower rangoli on the lawn, marigold garlands along the doorstep and a hand-lettered Happy Diwali sign"
          ratio="aspect-[3/4]"
          variant="main"
          width={347}
          height={465}
          position="center"
          className="mx-auto w-full max-w-[400px] lg:mx-0 lg:max-w-none"
        />

        <div className="max-w-[560px]">
          <p className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.42em] text-deep/55 sm:text-[0.75rem]">
            SenJun Luxury Colive
          </p>

          <h2 className="mt-4 font-display text-[2.1rem] font-medium leading-[1.12] text-deep sm:text-[2.75rem] lg:text-[3.15rem]">
            A Little Place to Call Home
          </h2>

          <p className="mt-5 font-body text-[0.98rem] leading-[1.75] text-deep/70 sm:text-[1.05rem]">
            SenJun is a shared home rather than a place you merely sleep. Mornings
            open slowly, the common rooms stay warm and lived-in, and every corner
            has already been made comfortable by the people who got here first.
          </p>

          <a
            href="#rooms"
            className="group mt-7 inline-flex items-center gap-2 rounded-full bg-deep px-7 py-4 text-base font-semibold tracking-wide text-cream shadow-[0_14px_30px_-14px_rgba(51,68,78,0.55)] transition-all duration-300 hover:-translate-y-1 hover:bg-deep/90 hover:shadow-[0_22px_40px_-14px_rgba(51,68,78,0.6)]"
          >
            Explore the rooms
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

      <ScrollSnap />
    </section>
  );
}
