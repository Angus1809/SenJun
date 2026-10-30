"use client";

/**
 * Tiny centered hint at the bottom of Section One:
 * "Follow the Butterfly", a fluttering mini butterfly, and a wheel cue.
 */
export default function FollowHint() {
  return (
    <div className="hint-in pointer-events-none absolute inset-x-0 bottom-5 z-20 flex flex-col items-center gap-2.5 sm:bottom-7">
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.34em] text-deep/55">
        Follow the Butterfly
      </p>

      {/* Mini animated butterfly icon */}
      <svg
        width="26"
        height="20"
        viewBox="0 0 26 20"
        fill="none"
        aria-hidden="true"
        className="text-sun drop-shadow-[0_0_6px_rgba(246,216,137,0.9)]"
      >
        <g className="mini-butterfly-wing" fill="#FFFDF7" stroke="#A9D8EE" strokeWidth="0.8">
          <path d="M12 8 C 8 3, 1 2, 1 6 C 1 9, 6 11, 12 11 Z" />
          <path d="M12 11 C 8 12, 4 15, 5 17 C 6 18.5, 10 15, 12 12.5 Z" />
        </g>
        <g className="mini-butterfly-wing mini-butterfly-wing--r" fill="#FFFDF7" stroke="#A9D8EE" strokeWidth="0.8">
          <path d="M14 8 C 18 3, 25 2, 25 6 C 25 9, 20 11, 14 11 Z" />
          <path d="M14 11 C 18 12, 22 15, 21 17 C 20 18.5, 16 15, 14 12.5 Z" />
        </g>
        <ellipse cx="13" cy="10.5" rx="1.3" ry="3.6" fill="#F2E3CE" />
      </svg>

      {/* Mouse-wheel hint */}
      <div
        aria-hidden="true"
        className="mt-1 flex h-9 w-px items-start justify-center overflow-hidden rounded-full bg-deep/15"
      >
        <span className="wheel-dot mt-0.5 block h-2 w-1 rounded-full bg-deep/50" />
      </div>
    </div>
  );
}
