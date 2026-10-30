"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import gsap from "gsap";

/**
 * The name reveal — the emotional payoff of the whole story.
 *
 * "S E N J U N" — then the two halves gently part: "Senior" and "Junior"
 * appear, the two people whose journey built this home. Then the hidden
 * suffixes fade and the halves merge back into "SenJun". No flashy effects —
 * slow, elegant, handwritten.
 *
 * Exposes play() / reset() so the chapter's scroll timeline can trigger it at
 * the right moment (and restore it if the timeline is rebuilt).
 */

export type LogoRevealHandle = {
  play: () => void;
  reset: () => void;
};

/* One font size keeps the letter geometry exact; the whole reveal scales
   down as a unit on small screens so the split never overlaps. */
const FONT_SIZE = "text-[2.6rem]";

const LogoReveal = forwardRef<LogoRevealHandle>(function LogoReveal(_props, ref) {
  const halfL = useRef<HTMLSpanElement>(null);
  const halfR = useRef<HTMLSpanElement>(null);
  const sufL = useRef<HTMLSpanElement>(null);
  const sufR = useRef<HTMLSpanElement>(null);
  const plus = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useImperativeHandle(ref, () => ({
    play() {
      tlRef.current?.kill();
      const L = halfL.current;
      const R = halfR.current;
      const sL = sufL.current;
      const sR = sufR.current;
      const p = plus.current;
      if (!L || !R || !sL || !sR || !p) return;

      const tl = gsap.timeline({ defaults: { ease: "sine.inOut" } });
      tlRef.current = tl;
      tl.to(L, { left: 76, duration: 1.7, ease: "sine.inOut" }, 0.5)
        .to(R, { left: 446, duration: 1.7, ease: "sine.inOut" }, 0.5)
        .to(sL, { opacity: 1, left: 168, duration: 1.4, ease: "sine.out" }, 1.1)
        .to(sR, { opacity: 1, left: 516, duration: 1.4, ease: "sine.out" }, 1.1)
        .to(p, { opacity: 0.85, duration: 1.2 }, 1.3)
        .to({}, { duration: 2.4 })
        .to(sL, { opacity: 0, duration: 0.8 }, 5.3)
        .to(sR, { opacity: 0, duration: 0.8 }, 5.3)
        .to(p, { opacity: 0, duration: 0.8 }, 5.3)
        .to(L, { left: 218, duration: 1.4, ease: "sine.inOut" }, 5.5)
        .to(R, { left: 318, duration: 1.4, ease: "sine.inOut" }, 5.5);
    },
    reset() {
      tlRef.current?.kill();
      tlRef.current = null;
      const L = halfL.current;
      const R = halfR.current;
      const sL = sufL.current;
      const sR = sufR.current;
      const p = plus.current;
      if (!L || !R || !sL || !sR || !p) return;
      gsap.set([L, R], { clearProps: "left" });
      gsap.set([sL, sR], { opacity: 0, clearProps: "left" });
      gsap.set(p, { opacity: 0 });
    },
  }));

  return (
    <div
      aria-hidden="true"
      className={`relative h-[120px] w-[min(84vw,620px)] origin-center select-none font-hand font-bold leading-none text-deep ${FONT_SIZE} scale-[0.6] sm:scale-100`}
    >
      {/* Soft warm halo behind the reveal */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sun/40 blur-3xl" />

      {/* "Sen" half */}
      <span
        ref={halfL}
        style={{ top: "50%", left: 218, marginTop: "-0.7em" }}
        className="absolute drop-shadow-[0_2px_10px_rgba(253,248,242,0.9)]"
      >
        Sen
      </span>
      {/* "ior" suffix — completes "Senior" */}
      <span
        ref={sufL}
        style={{ top: "50%", left: 168, marginTop: "-0.7em", opacity: 0 }}
        className="absolute text-deep/85"
      >
        ior
      </span>

      {/* "+" between the two lives */}
      <span
        ref={plus}
        style={{ top: "50%", left: 314, marginTop: "-0.72em", opacity: 0 }}
        className="absolute text-deep/60"
      >
        +
      </span>

      {/* "ior" suffix — completes "Junior" */}
      <span
        ref={sufR}
        style={{ top: "50%", left: 516, marginTop: "-0.7em", opacity: 0 }}
        className="absolute text-deep/85"
      >
        ior
      </span>

      {/* "Jun" half */}
      <span
        ref={halfR}
        style={{ top: "50%", left: 318, marginTop: "-0.7em" }}
        className="absolute drop-shadow-[0_2px_10px_rgba(253,248,242,0.9)]"
      >
        Jun
      </span>
    </div>
  );
});

export default LogoReveal;
