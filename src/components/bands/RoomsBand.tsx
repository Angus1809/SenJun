"use client";

import PhotoFrame from "@/components/shared/PhotoFrame";
import ScrollSnap from "@/components/shared/ScrollSnap";

/**
 * ROOMS — the real-photo gallery, and the true target of the navbar's
 * "Rooms" link (it used to point at a porch signboard that no longer exists).
 *
 * `rooms.png` turned out to be a corridor of room doors rather than a room
 * interior, so `Bedroom1.png` takes the large featured slot and `rooms.png`
 * becomes a supporting image. `Bedroom2.png` and the first bedroom both sit in
 * 4/3 frames at matching widths per row, and the smaller tile in each row is
 * centred vertically instead of stretched, so nothing is cropped away and no
 * row ever looks broken.
 *
 * `washing.png` closes the gallery as the facilities tile — deliberately the
 * smallest photograph on the page, with a short factual caption. The real
 * SenJun visiting card sits up in the header as a small brand detail, right
 * before the Contact chapter.
 */
export default function RoomsBand() {
  return (
    <section
      id="rooms"
      aria-label="Find Your Space"
      className="relative z-[39] flex min-h-[92svh] items-center bg-cream"
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 pt-24 pb-16 sm:px-10">
        {/* Heading + the real card */}
        <div className="grid items-end gap-7 lg:grid-cols-12">
          <div className="max-w-[660px] lg:col-span-8">
            <p className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.42em] text-deep/55 sm:text-[0.75rem]">
              Rooms
            </p>

            <h2 className="mt-4 font-display text-[2.1rem] font-medium leading-[1.12] text-deep sm:text-[2.75rem] lg:text-[3.15rem]">
              Find Your Space
            </h2>

            <p className="mt-5 font-body text-[0.98rem] leading-[1.75] text-deep/70 sm:text-[1.05rem]">
              Beds, wardrobes, desks and windows — photographed exactly as they
              are, so you know what you are looking at before you arrive. The
              rest is best decided while standing in the room.
            </p>

            <a
              href="#contact"
              className="group mt-7 inline-flex items-center gap-2 rounded-full bg-deep px-7 py-4 text-base font-semibold tracking-wide text-cream shadow-[0_14px_30px_-14px_rgba(51,68,78,0.55)] transition-all duration-300 hover:-translate-y-1 hover:bg-deep/90 hover:shadow-[0_22px_40px_-14px_rgba(51,68,78,0.6)]"
            >
              Book a Visit
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

          {/* The real visiting card, kept small — a brand detail that lands
              one chapter before Contact, never stretched into a logo. */}
          <PhotoFrame
            src="/images/senjun.png"
            alt="The SenJun card standing in a wooden holder beside a glass bowl of marigolds and a stack of novels"
            ratio="aspect-[7/9]"
            variant="support"
            width={687}
            height={871}
            position="center"
            className="w-full max-w-[220px] lg:col-span-4 lg:justify-self-end"
          />
        </div>

        {/* Gallery */}
        <div className="mt-10 grid grid-cols-1 items-start gap-6 sm:mt-12 lg:grid-cols-12">
          <PhotoFrame
            src="/images/Bedroom1.png"
            alt="A bedroom with a dark wooden double bed, white bedding, sunflower-print cushions, an air conditioner and a curtained window"
            ratio="aspect-[4/3]"
            variant="main"
            width={812}
            height={631}
            position="center"
            className="w-full lg:col-span-7"
          />

          <PhotoFrame
            src="/images/Bedroom2.png"
            alt="A twin bedroom with two beds, a wooden study desk, a wardrobe, a ceiling fan and a window"
            ratio="aspect-[4/3]"
            variant="main"
            width={776}
            height={647}
            position="center"
            className="w-full lg:col-span-5 lg:self-center"
          />

          <PhotoFrame
            src="/images/rooms.png"
            alt="A corridor lined with wooden room doors and small black cabinets, lit by warm pendant lights"
            ratio="aspect-[4/3]"
            variant="support"
            width={721}
            height={572}
            position="center"
            caption="Room doors along the corridor"
            className="w-full lg:col-span-7"
          />

          <PhotoFrame
            src="/images/washing.png"
            alt="The washing and handwash area: wall-mounted soap dispensers and a black rack of labelled sponges above the taps"
            ratio="aspect-[4/3]"
            variant="support"
            width={857}
            height={642}
            position="center"
            caption="The washing and handwash area"
            className="w-full lg:col-span-5 lg:self-center"
          />
        </div>
      </div>

      <ScrollSnap />
    </section>
  );
}
