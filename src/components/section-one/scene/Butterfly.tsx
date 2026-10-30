"use client";

import { forwardRef } from "react";

/**
 * The butterfly — the narrator of the whole website.
 *
 * ONE instance exists in the entire experience. Section One keeps this exact
 * DOM node alive across scroll (see GardenScene) so the character continues
 * seamlessly into Section Two.
 *
 * - White wings, soft blue edges, faint golden glow, semi-transparent.
 * - Wings flap via CSS; flight/motion is driven by GSAP MotionPathPlugin
 *   on the outer <g> (x/y + rotation), so the two never fight.
 */
const Butterfly = forwardRef<SVGGElement>(function Butterfly(_props, ref) {
  return (
    <g ref={ref} data-butterfly aria-hidden="true">
      {/* Golden glow halo */}
      <circle
        className="glow-breathe"
        r={26}
        fill="url(#bfGlow)"
        opacity={0.5}
      />

      {/* Inner group — bobs and "looks around" independently of flight */}
      <g className="bf-inner" opacity={0.96}>
        {/* Left wings */}
        <path
          className="bf-wing bf-wing--left"
          d="M0 -3 C -13 -17 -29 -15 -33 -3 C -29 7 -12 10 0 6 Z"
          fill="url(#wingGrad)"
          stroke="#9FCBE4"
          strokeWidth={1.1}
        />
        <path
          className="bf-wing bf-wing--left bf-wing--hind"
          d="M0 5 C -12 7 -23 15 -21 23 C -13 27 -3 23 0 15 Z"
          fill="url(#wingGrad)"
          stroke="#9FCBE4"
          strokeWidth={0.9}
        />

        {/* Right wings */}
        <path
          className="bf-wing"
          d="M0 -3 C 13 -17 29 -15 33 -3 C 29 7 12 10 0 6 Z"
          fill="url(#wingGrad)"
          stroke="#9FCBE4"
          strokeWidth={1.1}
        />
        <path
          className="bf-wing bf-wing--hind"
          d="M0 5 C 12 7 23 15 21 23 C 13 27 3 23 0 15 Z"
          fill="url(#wingGrad)"
          stroke="#9FCBE4"
          strokeWidth={0.9}
        />

        {/* Body */}
        <g>
        <path
          d="M0 -6 C -1.6 -8 -1.6 -12 0 -14 C 1.6 -12 1.6 -8 0 -6 Z"
          fill="none"
          stroke="#E9D6BC"
          strokeWidth={0.9}
          strokeLinecap="round"
        />
        <circle cx={0} cy={-4} r={1.9} fill="#E9D6BC" />
        <circle cx={0} cy={-1.5} r={0.7} fill="#D9C39A" />
        <ellipse cx={0} cy={8} rx={2.5} ry={7.5} fill="#F2E3CE" />
        <path
          d="M0 0 L -2 3 M0 0 L 2 3"
          stroke="#F2E3CE"
          strokeWidth={0.8}
          strokeLinecap="round"
        />
        </g>
      </g>
    </g>
  );
});

export default Butterfly;
