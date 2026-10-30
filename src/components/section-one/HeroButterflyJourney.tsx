"use client";

import { motion, useReducedMotion } from "framer-motion";
import Butterfly from "./scene/Butterfly";

/**
 * HeroButterflyJourney — the quiet middle transition of the homepage hero.
 *
 * A tiny butterfly drifting along a dotted curve that leads out of the
 * story on the left and into the artwork on the right (toward the people
 * with their luggage and the house on the hill). Decorative only:
 * pointer-transparent, aria-hidden, and rendered ONLY on desktop — below
 * `lg` the hero stacks, so there is no middle gap to fill.
 *
 * The butterfly is the site's OWN artwork — the same <Butterfly/> SVG the
 * global narrator is built from — drawn at ~46% of its size, so the guide
 * and the narrator can never look like different species.
 */

/** Three leaves. Sparse on purpose — the middle must stay calm. */
const LEAVES = [
  { x: 104, y: 116, dur: "9s", delay: "0s", dx: "7px" },
  { x: 190, y: 170, dur: "11.5s", delay: "1.6s", dx: "-6px" },
  { x: 268, y: 86, dur: "10.2s", delay: "3.1s", dx: "5px" },
];

export default function HeroButterflyJourney() {
  const reduced = useReducedMotion();

  return (
    <div aria-hidden="true" className="senjun-journey">
      <svg viewBox="0 0 320 240" className="h-full w-full" role="presentation">
        {/* Dotted flight trail — organic, never straight, drifting almost
            imperceptibly toward the people and the house. */}
        <path
          className="senjun-journey-trail"
          d="M 14 148 C 52 116, 88 176, 130 152 C 172 128, 208 92, 252 110 C 280 121, 300 136, 316 132"
          fill="none"
          stroke="#8B9C86"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray="0.5 13"
        />

        {/* A few drifting leaves along the way */}
        {LEAVES.map((l) => (
          <path
            key={`${l.x}-${l.y}`}
            className="senjun-journey-leaf"
            d="M0 0 C 2.6 -4.2, 8.4 -4.6, 9.6 -0.2 C 8.4 4.4, 2.6 4.4, 0 0 Z"
            fill="#9DB28F"
            transform={`translate(${l.x} ${l.y})`}
            style={
              { "--jl-dur": l.dur, "--jl-delay": l.delay, "--jl-dx": l.dx } as React.CSSProperties
            }
          />
        ))}

        {/* The note — handwritten, bolded and tracked out a little so it
            reads as a small storytelling instruction, still set along the
            path with the butterfly (two lines, inside the viewBox). */}
        <text className="senjun-journey-phrase font-hand" transform="rotate(-3 22 64)">
          <tspan x={22} y={64}>
            Follow the little things
          </tspan>
          <tspan x={22} y={87}>
            that lead you home.
          </tspan>
        </text>

        {/* The guide — a small, calm drift along the curve (6–9s, mirrored) */}
        <g transform="translate(36 142)">
          <motion.g
            className="senjun-journey-bf"
            initial={{ x: 0, y: 0, rotate: -5 }}
            animate={
              reduced
                ? { x: 0, y: 0, rotate: -5 }
                : {
                    x: [0, 26, 58, 92, 118],
                    y: [0, -15, 3, -20, -7],
                    rotate: [-5, 6, -3, 7, 0],
                  }
            }
            transition={{
              duration: 8,
              repeat: reduced ? 0 : Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          >
            <g transform="scale(0.46)">
              <Butterfly />
            </g>
          </motion.g>
        </g>
      </svg>
    </div>
  );
}
