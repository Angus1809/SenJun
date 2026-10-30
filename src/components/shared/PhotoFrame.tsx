"use client";

/**
 * PhotoFrame — the ONE place real photography enters the storybook.
 *
 * Every photograph in the site is mounted through this component so the
 * illustrated world and the real one share a single treatment:
 *
 *   • a warm-beige hairline border and a soft, low shadow (never a heavy
 *     picture-frame outline),
 *   • a muted peach backing rectangle offset a few pixels behind the image —
 *     the "second sheet of paper" that makes the photo feel pinned into a
 *     scrapbook rather than pasted on,
 *   • a fixed aspect-ratio box, so the page geometry is settled BEFORE the
 *     bytes arrive and nothing below ever jumps while an image loads,
 *   • native lazy-loading + async decoding for everything below the fold.
 *
 * Radius follows the shape system: `main` photographs read as large rounded
 * rectangles (≈22px), `support` photographs slightly tighter (≈16px). Images
 * that must stay wholly recognisable (a bookshelf, a corridor) use `contain`;
 * everything else uses `cover` with an explicit `position` that protects the
 * bed, the table or the staircase from being cropped away.
 */

type PhotoFrameProps = {
  /** Path under /public, e.g. "/images/Bedroom1.png" */
  src: string;
  alt: string;
  /** Tailwind aspect utility. Reserves the box before load. */
  ratio: string;
  variant?: "main" | "support";
  /** object-position — protects the subject when cover must crop. */
  position?: string;
  fit?: "cover" | "contain";
  caption?: string;
  className?: string;
  /** Overrides the preset radius — e.g. "rounded-t-[150px]" for an arch. */
  radius?: string;
  /** Intrinsic pixel size of the file — keeps the pre-CSS hint truthful. */
  width?: number;
  height?: number;
  /** Above-the-fold images opt out of lazy loading. */
  eager?: boolean;
};

const RADIUS = {
  main: "rounded-[22px]",
  support: "rounded-[16px]",
} as const;

const BACKING = {
  main: "rounded-[26px]",
  support: "rounded-[20px]",
} as const;

export default function PhotoFrame({
  src,
  alt,
  ratio,
  variant = "support",
  position = "center",
  fit = "cover",
  caption,
  className = "",
  radius,
  width = 900,
  height = 900,
  eager = false,
}: PhotoFrameProps) {
  const boxRadius = radius ?? RADIUS[variant];
  const backRadius = radius ?? BACKING[variant];

  return (
    <figure className={`relative pr-3 pb-3 ${className}`}>
      {/* The offset peach sheet — sits behind and just below-right of the photo */}
      <span
        aria-hidden="true"
        className={`absolute left-3 top-3 right-0 bottom-0 bg-[#F2D9AE] ${backRadius} shadow-[0_14px_34px_-26px_rgba(90,60,30,0.7)]`}
      />

      <div
        className={`relative overflow-hidden border border-[#D9C3A0] bg-[#EFE3CB] shadow-[0_26px_56px_-34px_rgba(90,60,30,0.6)] transition-transform duration-500 ease-out will-change-transform hover:-translate-y-1 ${boxRadius} ${ratio}`}
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className={`block h-full w-full ${
            fit === "contain" ? "object-contain" : "object-cover"
          } transition-transform duration-[900ms] ease-out`}
          style={{ objectPosition: position }}
        />
      </div>

      {caption && (
        <figcaption className="relative mt-3 pr-3 font-hand text-[1.05rem] leading-snug text-deep/70 sm:text-[1.15rem]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
