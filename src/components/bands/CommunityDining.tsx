"use client";

import PhotoFrame from "@/components/shared/PhotoFrame";
import ScrollSnap from "@/components/shared/ScrollSnap";

/**
 * COMMUNITY — the real dining room behind Chapter Three's courtyard.
 *
 * `dining.png` is confirmed as the communal eating space (long dark tables,
 * pale chairs, a tropical mural on the back wall), so it carries this band as
 * one wide, prominent rounded rectangle on the left — the larger column, no
 * decorations anywhere over it, so the tables and chairs stay fully readable.
 * The copy sits to its right, which keeps the layout alternating against the
 * text-left band before it.
 */
export default function CommunityDining() {
  return (
    <section
      id="community-dining"
      aria-label="Good Spaces. Better Connections."
      className="relative z-[39] flex min-h-[92svh] items-center bg-cream"
    >
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-10 px-6 pt-24 pb-16 sm:px-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
        <PhotoFrame
          src="/images/dining.png"
          alt="The shared dining room: long dark tables with pale blue chairs in front of a tropical-leaf mural"
          ratio="aspect-[3/2]"
          variant="main"
          width={855}
          height={576}
          position="center"
          caption="The shared dining room"
          className="mx-auto w-full max-w-[720px] lg:mx-0 lg:max-w-none"
        />

        <div className="max-w-[520px]">
          <p className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.42em] text-deep/55 sm:text-[0.75rem]">
            Life together
          </p>

          <h2 className="mt-4 font-display text-[2.1rem] font-medium leading-[1.12] text-deep sm:text-[2.6rem] lg:text-[3rem]">
            Good Spaces.
            <br />
            Better Connections.
          </h2>

          <p className="mt-5 font-body text-[0.98rem] leading-[1.75] text-deep/70 sm:text-[1.05rem]">
            The table is where a colive stops being a building. Meals run long,
            chairs get pulled closer, and the room fills up without anyone
            arranging it. Shared living works when the space makes meeting people
            the easy option.
          </p>
        </div>
      </div>

      <ScrollSnap />
    </section>
  );
}
