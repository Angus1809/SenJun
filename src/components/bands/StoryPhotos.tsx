"use client";

import PhotoFrame from "@/components/shared/PhotoFrame";
import ScrollSnap from "@/components/shared/ScrollSnap";

/**
 * OUR STORY — the two real corners that belong to Chapter Two.
 *
 * `books.png` is a tall rounded rectangle (a shelf that must stay legible, so
 * the crop is essentially nil) with its own caption and a cream sheet offset
 * behind it. `space.png` takes the organic arch shape so the page is not a
 * wall of identical rectangles — it shows the common space: the corridor, a
 * deep-red armchair, the water station and the plant by the lift.
 *
 * Text sits left, photographs right on desktop, and the pair simply stacks on
 * mobile. Registered as a snap stop so the site's one-gesture rhythm reaches
 * it rather than sailing past.
 */
export default function StoryPhotos() {
  return (
    <section
      id="story-photos"
      aria-label="Little Corners, Big Ideas"
      className="relative z-[39] flex min-h-[92svh] items-center bg-cream"
    >
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-start gap-10 px-6 pt-24 pb-16 sm:px-10 lg:grid-cols-2 lg:gap-16">
        {/* Words first — the voice of the chapter */}
        <div className="max-w-[560px] lg:pt-4">
          <p className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.42em] text-deep/55 sm:text-[0.75rem]">
            Around the house
          </p>

          <h2 className="mt-4 font-display text-[2.1rem] font-medium leading-[1.12] text-deep sm:text-[2.6rem] lg:text-[3rem]">
            The Corners In Between
          </h2>

          <p className="mt-5 font-body text-[0.98rem] leading-[1.75] text-deep/70 sm:text-[1.05rem]">
            A home is mostly made of the rooms nobody photographs on purpose: a
            shelf someone keeps topping up, a chair by the window that everyone
            argues over, a quiet stretch of corridor on the way back. These are
            the real ones.
          </p>

          {/* The common space — an organic arch so the shapes stay varied */}
          <PhotoFrame
            src="/images/space.png"
            alt="The shared common space: a corridor lined with doors, a deep-red armchair, a water station and a potted plant beside the lift"
            ratio="aspect-[4/3]"
            radius="rounded-t-[150px] rounded-b-[22px]"
            variant="support"
            width={857}
            height={642}
            position="center"
            caption="The common space, on the way in"
            className="mt-9"
          />
        </div>

        {/* The bookshelf — tall, unmistakably a shelf */}
        <PhotoFrame
          src="/images/books.png"
          alt="Black wall shelves holding a row of novels, two Satvic Food Books stacked on top and a small SenJun card leaning against them"
          ratio="aspect-[3/4]"
          variant="main"
          width={347}
          height={465}
          position="center"
          caption="Little Corners, Big Ideas"
          className="mx-auto w-full max-w-[440px] lg:mx-0 lg:max-w-none"
        />
      </div>

      <ScrollSnap />
    </section>
  );
}
