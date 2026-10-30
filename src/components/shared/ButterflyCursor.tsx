"use client";

import { useEffect, useRef } from "react";

/**
 * ButterflyCursor — a small blue butterfly that replaces the native arrow.
 *
 * Desktop only: the effect refuses to run unless `pointer: fine` matches,
 * the `senjun-cursor-on` class (which hides the native arrow) is added by
 * the same script, and CSS hides the butterfly outright on coarse pointers
 * — so touch devices keep normal behaviour.
 *
 * Movement: a rAF loop eases the butterfly a fraction of a second behind
 * the pointer (no snapping, no excessive lag) and banks it gently with
 * horizontal velocity. Hovering anything clickable grows it slightly and
 * speeds up its flutter; a click gives one 220ms pulse. Everything is
 * pointer-transparent and aria-hidden, so clicks, focus rings, keyboard
 * navigation and text selection are untouched. Under `prefers-reduced-motion`
 * the follower snaps without rotation and all animation is disabled.
 *
 * This is NOT the storytelling butterfly — the journey guide and the
 * global narrator keep their own SVGs, untouched.
 */

/** Everything that should read as "clickable" for the hover flutter. */
const HOVERABLE =
  'a, button, [role="button"], [role="link"], [role="menuitem"], input, textarea, select, summary, label, [data-scene], [data-cursor="hover"]';

/** Delicate blue butterfly — same silhouette as the site's mini butterfly,
    drawn at 34×26 so it reads clearly against the warm cream backgrounds
    without ever growing into an obstruction. */
function ButterflySvg() {
  return (
    <svg
      className="senjun-cursor-bf"
      width="34"
      height="26"
      viewBox="0 0 26 20"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* Left wings */}
      <g className="senjun-wing" fill="#4E97E0" stroke="rgba(30,64,110,0.45)" strokeWidth="0.7">
        <path d="M12 8 C 8 3, 1 2, 1 6 C 1 9, 6 11, 12 11 Z" />
        <path d="M12 11 C 8 12, 4 15, 5 17 C 6 18.5, 10 15, 12 12.5 Z" />
      </g>
      {/* Right wings */}
      <g
        className="senjun-wing senjun-wing--r"
        fill="#7AB6EE"
        stroke="rgba(30,64,110,0.45)"
        strokeWidth="0.7"
      >
        <path d="M14 8 C 18 3, 25 2, 25 6 C 25 9, 20 11, 14 11 Z" />
        <path d="M14 11 C 18 12, 22 15, 21 17 C 20 18.5, 16 15, 14 12.5 Z" />
      </g>
      {/* Body + antennae */}
      <ellipse
        cx="13"
        cy="10.5"
        rx="1.3"
        ry="3.6"
        fill="#EDF5FE"
        stroke="rgba(30,64,110,0.4)"
        strokeWidth="0.5"
      />
      <path
        d="M12.4 7 C 11.6 5.6, 10.7 4.8, 9.7 4.4 M13.6 7 C 14.4 5.6, 15.3 4.8, 16.3 4.4"
        stroke="rgba(30,64,110,0.5)"
        strokeWidth="0.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default function ButterflyCursor() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const wrap = wrapRef.current;
    if (!fine.matches || !wrap) return;

    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    root.classList.add("senjun-cursor-on");

    // Raw pointer vs. eased follower
    let mx = -200;
    let my = -200;
    let x = -200;
    let y = -200;
    let rot = 0;
    let visible = false;
    let clickTimer = 0;

    const show = () => {
      if (visible) return;
      visible = true;
      x = mx;
      y = my; // first frame sits on the pointer, no fly-in from nowhere
      wrap.classList.add("is-visible");
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      show();
    };

    const onOut = (e: MouseEvent) => {
      if (e.relatedTarget) return; // still inside the document
      visible = false;
      wrap.classList.remove("is-visible", "is-hover");
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const hit = target?.closest?.(HOVERABLE);
      wrap.classList.toggle("is-hover", Boolean(hit));
    };

    const onDown = () => {
      wrap.classList.remove("is-click");
      void wrap.offsetWidth; // restart the pulse animation
      wrap.classList.add("is-click");
      window.clearTimeout(clickTimer);
      clickTimer = window.setTimeout(() => wrap.classList.remove("is-click"), 260);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });

    let raf = 0;
    const tick = () => {
      if (visible) {
        if (reduced.matches) {
          // Static follower — position only, no lag, no banking
          x = mx;
          y = my;
          rot = 0;
        } else {
          const dx = mx - x;
          const dy = my - y;
          // A soft trailing ease — roughly a tenth of a second behind
          x += dx * 0.22;
          y += dy * 0.22;
          // Gentle banking with horizontal travel, clamped so it never spins
          const bank = Math.max(-12, Math.min(12, dx * 0.5));
          rot += (bank - rot) * 0.12;
        }
        // Center the 34×26 box on the pointer (17, 13)
        wrap.style.transform = `translate3d(${(x - 17).toFixed(2)}px, ${(
          y - 13
        ).toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(clickTimer);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      root.classList.remove("senjun-cursor-on");
    };
  }, []);

  return (
    <div ref={wrapRef} className="senjun-cursor" aria-hidden="true">
      <div className="senjun-cursor-scale">
        <ButterflySvg />
      </div>
    </div>
  );
}
