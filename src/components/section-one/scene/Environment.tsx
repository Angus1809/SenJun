"use client";

import { Daisy, Lavender, GrassTuft } from "@/components/shared/Flora";

/**
 * The garden environment:
 * - a winding stone pathway up to a small house that is only partially
 *   visible (curiosity, not focus),
 * - trees (some swaying), a wooden fence, lavender, white daisies,
 *   tiny grass tufts.
 */

const DAISIES: Array<[number, number, number]> = [
  [470, 908, 1],
  [548, 848, 0.9],
  [372, 936, 0.8],
  [628, 766, 0.85],
  [288, 926, 0.75],
  [662, 706, 0.7],
];

const LAVENDER: Array<[number, number, number]> = [
  [296, 880, 1],
  [512, 796, 0.9],
  [598, 700, 0.8],
  [252, 938, 0.75],
  [452, 862, 0.7],
];

const GRASS_TUFTS: Array<[number, number, number]> = [
  [336, 952, 1],
  [426, 944, 0.9],
  [492, 900, 0.8],
  [556, 836, 0.8],
  [612, 736, 0.7],
  [668, 662, 0.7],
  [384, 910, 0.7],
  [470, 866, 0.65],
  [634, 798, 0.6],
];

export default function Environment() {
  return (
    <g aria-hidden="true">
      {/* ---- Foreground grass field ---- */}
      <path
        d="M 0 780 C 320 756 640 770 1000 784 L 1000 1000 L 0 1000 Z"
        fill="#CBE0B6"
      />
      <path
        d="M 0 840 C 340 822 680 834 1000 846 L 1000 1000 L 0 1000 Z"
        fill="#BFD6A6"
        opacity={0.85}
      />

      {/* ---- Distant house (partially visible — who lives there?) ---- */}
      <g transform="translate(668 556)">
        <circle cx={-6} cy={-16} r={46} fill="url(#houseGlow)" opacity={0.55} />
        <rect x={-30} y={-18} width={60} height={32} rx={2} fill="#F5ECD8" stroke="#E2D5B6" strokeWidth={0.8} />
        {/* Chimney + smoke-free roof */}
        <rect x={14} y={-30} width={6} height={13} fill="#9C6849" />
        <path
          d="M -36 -16 L 0 -36 L 36 -16 L 30 -14 L 0 -30 L -30 -14 Z"
          fill="#A9714F"
          stroke="#966043"
          strokeWidth={0.6}
        />
        {/* Warm window */}
        <rect x={-17} y={-8} width={10} height={12} rx={1} fill="#F6D889" opacity={0.92} />
        <rect
          x={-17}
          y={-8}
          width={10}
          height={12}
          rx={1}
          fill="none"
          stroke="#C9A86B"
          strokeWidth={0.7}
        />
        <path d="M -12 -8 L -12 4 M -17 -2 L -7 -2" stroke="#C9A86B" strokeWidth={0.6} />
        {/* Door */}
        <rect x={4} y={-10} width={10} height={16} rx={1} fill="#8A6A44" />
        <circle cx={12} cy={-2} r={0.8} fill="#E9D9BC" />
      </g>

      {/* ---- Trees ---- */}
      {/* Far-left tree (no sway — too distant) */}
      <g transform="translate(128 520) scale(0.5)">
        <path d="M -4 0 C -3 -14 0 -20 0 -26 C 4 -20 5 -12 5 -4 C 2 -6 0 -4 -4 0 Z" fill="#8A6740" />
        <circle cx={0} cy={-34} r={20} fill="#8DAF8E" />
        <circle cx={-13} cy={-28} r={12} fill="#9CBE98" />
        <circle cx={12} cy={-27} r={11} fill="#9CBE98" />
      </g>

      {/* Mid tree behind the girl */}
      <g transform="translate(240 706) scale(0.72)" className="sway-tree">
        <path d="M -5 0 C -4 -20 -2 -32 -3 -42 C 4 -34 7 -22 6 -8 C 2 -12 0 -6 -5 0 Z" fill="#8A6740" />
        <circle cx={-2} cy={-52} r={26} fill="#8DB38F" />
        <circle cx={-18} cy={-44} r={16} fill="#A0C09B" />
        <circle cx={15} cy={-42} r={14} fill="#A0C09B" />
        <circle cx={6} cy={-66} r={14} fill="#9DBB96" />
      </g>

      {/* Big foreground tree (right) — partially hides the house */}
      <g transform="translate(742 618)" className="sway-tree">
        <path
          d="M -7 0 C -6 -22 -3 -36 -4 -50 C -2 -58 4 -58 6 -48 C 8 -36 9 -20 8 -4 C 4 -10 2 -4 -7 0 Z"
          fill="#7A5A38"
        />
        <circle cx={-4} cy={-62} r={30} fill="#6E9879" />
        <circle cx={-26} cy={-52} r={20} fill="#7FA98A" />
        <circle cx={20} cy={-50} r={19} fill="#7FA98A" />
        <circle cx={8} cy={-80} r={22} fill="#8DB38F" />
        <circle cx={-16} cy={-76} r={14} fill="#94B89A" />
        <circle cx={26} cy={-68} r={12} fill="#94B89A" />
      </g>

      {/* Small tree behind the house (adds depth + hides a bit more) */}
      <g transform="translate(622 548) scale(0.42)">
        <path d="M -4 0 C -3 -12 0 -16 0 -22 C 3 -16 4 -10 4 -4 C 1 -5 0 -3 -4 0 Z" fill="#8A6740" />
        <circle cx={0} cy={-28} r={18} fill="#8FB390" />
        <circle cx={-10} cy={-23} r={11} fill="#9FC29A" />
      </g>

      {/* Bushes near the path */}
      <g transform="translate(432 886)">
        <ellipse cx={0} cy={0} rx={16} ry={10} fill="#8FB390" />
        <ellipse cx={-9} cy={-4} rx={10} ry={7} fill="#A2C29C" />
      </g>
      <g transform="translate(560 802)">
        <ellipse cx={0} cy={0} rx={13} ry={8} fill="#8FB390" />
        <ellipse cx={7} cy={-3} rx={8} ry={6} fill="#A2C29C" />
      </g>

      {/* ---- Winding stone pathway ---- */}
      <g>
        <ellipse cx={420} cy={944} rx={30} ry={12} fill="#E8DFC8" stroke="#D6C9A9" strokeWidth={1} />
        <ellipse cx={452} cy={902} rx={27} ry={11} fill="#E4DAC2" stroke="#D3C5A4" strokeWidth={1} transform="rotate(-8 452 902)" />
        <ellipse cx={496} cy={856} rx={30} ry={12} fill="#E8DFC8" stroke="#D6C9A9" strokeWidth={1} transform="rotate(-16 496 856)" />
        <ellipse cx={538} cy={808} rx={26} ry={10} fill="#E2D8BF" stroke="#D1C3A2" strokeWidth={1} transform="rotate(-24 538 808)" />
        <ellipse cx={576} cy={758} rx={29} ry={11} fill="#E8DFC8" stroke="#D6C9A9" strokeWidth={1} transform="rotate(-32 576 758)" />
        <ellipse cx={608} cy={706} rx={25} ry={10} fill="#E4DAC2" stroke="#D3C5A4" strokeWidth={1} transform="rotate(-38 608 706)" />
        <ellipse cx={640} cy={654} rx={27} ry={10} fill="#E8DFC8" stroke="#D6C9A9" strokeWidth={1} transform="rotate(-40 640 654)" />
        <ellipse cx={660} cy={604} rx={22} ry={9} fill="#E2D8BF" stroke="#D1C3A2" strokeWidth={1} />
        {/* Stone highlights */}
        <ellipse cx={420} cy={942} rx={14} ry={5} fill="#F4EDD8" opacity={0.7} />
        <ellipse cx={496} cy={854} rx={15} ry={5} fill="#F4EDD8" opacity={0.7} />
        <ellipse cx={576} cy={756} rx={14} ry={5} fill="#F4EDD8" opacity={0.7} />
        <ellipse cx={640} cy={652} rx={13} ry={5} fill="#F4EDD8" opacity={0.7} />
      </g>

      {/* ---- Wooden fence (left of the path) ---- */}
      <g opacity={0.95}>
        <path
          d="M 316 932 Q 402 880 488 806"
          stroke="#B09368"
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 322 916 Q 408 864 494 790"
          stroke="#B09368"
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
        {[
          [322, 926, 318, 912],
          [356, 901, 352, 886],
          [390, 876, 386, 861],
          [424, 852, 420, 837],
          [458, 827, 454, 812],
          [492, 802, 488, 787],
        ].map(([x, y, px, py]) => (
          <g key={x}>
            <path
              d={`M ${px} ${py} C ${px - 1} ${py - 14} ${px + 2} ${py - 28} ${px} ${py - 34} C ${px + 3} ${py - 27} ${px + 4} ${py - 14} ${px + 2} ${py} Z`}
              fill="#B99B72"
            />
            <path d={`M ${px + 3} ${py - 22} Q ${px + 7} ${py - 20} ${px + 9} ${py - 16}`} stroke="#C9AC82" strokeWidth={1.4} fill="none" />
            <circle cx={x} cy={y} r={1.4} fill="#9A7D55" />
          </g>
        ))}
      </g>

      {/* ---- Flowers & grass ---- */}
      {DAISIES.map(([x, y, s]) => (
        <Daisy key={`d${x}`} x={x} y={y} s={s} />
      ))}
      {LAVENDER.map(([x, y, s]) => (
        <Lavender key={`l${x}`} x={x} y={y} s={s} />
      ))}
      {GRASS_TUFTS.map(([x, y, s]) => (
        <GrassTuft key={`g${x}`} x={x} y={y} s={s} />
      ))}
    </g>
  );
}
