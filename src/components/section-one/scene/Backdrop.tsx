"use client";

/**
 * The sky of the opening scene — early Sunday morning, 6:30 AM.
 * Warm cream fading into golden light at the horizon, soft drifting clouds,
 * tiny birds far away, and hazy rolling hills.
 */
export default function Backdrop() {
  return (
    <g aria-hidden="true">
      {/* Sky */}
      <rect x={0} y={0} width={1000} height={1000} fill="url(#skyGrad)" />

      {/* Sun + warm glow */}
      <circle cx={770} cy={330} r={190} fill="url(#sunGlow)" opacity={0.65} />
      <circle cx={770} cy={330} r={44} fill="#F8E4AC" opacity={0.95} />
      <circle cx={770} cy={330} r={20} fill="#FFF8E1" opacity={0.85} />

      {/* Light rays — rotate ever so slowly */}
      <g data-ambient="rays" opacity={0.5}>
        <g fill="#FFFDF2" opacity={0.07}>
          <path d="M 770 330 L 1052 222 L 1048 300 Z" />
          <path d="M 770 330 L 1034 396 L 990 452 Z" />
          <path d="M 770 330 L 930 528 L 868 552 Z" />
          <path d="M 770 330 L 1000 100 L 1012 178 Z" />
          <path d="M 770 330 L 800 60 L 884 82 Z" />
        </g>
      </g>

      {/* Drifting clouds */}
      <g data-ambient="cloud" opacity={0.7}>
        <g fill="#FFFFFF" opacity={0.85}>
          <ellipse cx={205} cy={140} rx={70} ry={16} />
          <ellipse cx={245} cy={128} rx={44} ry={14} />
          <ellipse cx={162} cy={132} rx={36} ry={12} />
        </g>
      </g>
      <g data-ambient="cloud" opacity={0.5}>
        <g fill="#FFFFFF" opacity={0.8}>
          <ellipse cx={640} cy={205} rx={84} ry={15} />
          <ellipse cx={695} cy={192} rx={48} ry={12} />
          <ellipse cx={590} cy={198} rx={42} ry={11} />
        </g>
      </g>
      <g data-ambient="cloud" opacity={0.6}>
        <g fill="#FFFFFF" opacity={0.85}>
          <ellipse cx={900} cy={120} rx={62} ry={13} />
          <ellipse cx={936} cy={110} rx={38} ry={11} />
          <ellipse cx={866} cy={114} rx={30} ry={9} />
        </g>
      </g>
      <g data-ambient="cloud" opacity={0.45}>
        <g fill="#FFFFFF" opacity={0.8}>
          <ellipse cx={380} cy={400} rx={90} ry={13} />
          <ellipse cx={430} cy={389} rx={46} ry={10} />
        </g>
      </g>

      {/* Tiny birds in the distance */}
      <g data-ambient="bird" transform="translate(0 246)" opacity={0.55}>
        <g fill="none" stroke="#9AA093" strokeWidth={1.5} strokeLinecap="round">
          <path d="M 0 0 Q 5 -5 10 0 Q 15 -5 20 0" />
        </g>
      </g>
      <g data-ambient="bird" transform="translate(0 302)" opacity={0.5}>
        <g fill="none" stroke="#9AA093" strokeWidth={1.3} strokeLinecap="round">
          <path d="M 0 0 Q 4 -4 8 0 Q 12 -4 16 0" />
        </g>
      </g>

      {/* Hazy hills */}
      <path
        d="M 0 600 C 180 540 360 560 520 596 C 700 634 840 620 1000 584 L 1000 760 L 0 760 Z"
        fill="#C9DAC2"
        opacity={0.85}
      />
      <path
        d="M 0 640 C 260 588 520 606 760 652 C 880 676 940 668 1000 660 L 1000 800 L 0 800 Z"
        fill="#B7CDB0"
        opacity={0.9}
      />
      {/* Warm mid-ground */}
      <path
        d="M 0 700 C 300 660 640 678 1000 706 L 1000 860 L 0 860 Z"
        fill="#CBDDB9"
      />
    </g>
  );
}
