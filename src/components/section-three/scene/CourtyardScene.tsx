"use client";

import type { Ref } from "react";
import { Daisy, Lavender, GrassTuft, PinkFlower } from "@/components/shared/Flora";

/**
 * Chapter Three scene — the courtyard, the heart of SenJun.
 *
 * The pathway opens into a warm courtyard with a large tree at its center —
 * the symbolic heart where people gather. Four wooden benches, each with its
 * own small group of residents (chatting, working on a laptop, sharing a book,
 * resting alone with a cat), a small garden, string lights, a clothes line,
 * wind chimes, a bicycle being mended, a cat and a stray puppy. Tiny scenes of
 * everyday life happen everywhere at once. In the distance, for the first
 * time, the silhouette of the house appears — a warm light, still unknown.
 */

export type CourtyardSceneProps = {
  sceneRef: Ref<SVGSVGElement>;
};

/**
 * Four bench groups — the seating heart of the courtyard.
 *
 * Each PNG was cut from `public/images/segment3.png` (one bench scene per
 * file) so the full sheet is never rendered, and each one carries its bench
 * *and* its residents as a single composition — nobody can float or overlap
 * because they were drawn that way. Coordinates are in viewBox units (0 0 1200
 * 800) and position each group's *centre-x* and *ground-line* — because the
 * scene uses `preserveAspectRatio="xMidYMid slice"`, that locks every bench to
 * the courtyard at any viewport without JS. `w`/`h` derive from each cut's true
 * aspect ratio so nothing is stretched.
 */
const SEAT_GROUPS = [
  // Back left, in the canopy's shade — one resident unwinding with a cat
  { id: "sg4", src: "/images/segment3-seat-4.png", nw: 566, nh: 492, cx: 305, ground: 658, w: 148 },
  // Back centre-left — two residents deep in conversation
  { id: "sg1", src: "/images/segment3-seat-1.png", nw: 564, nh: 509, cx: 472, ground: 636, w: 148 },
  // Front right — one resident working quietly on a laptop
  { id: "sg2", src: "/images/segment3-seat-2.png", nw: 342, nh: 509, cx: 706, ground: 688, w: 98 },
  // Front far right — a pair sharing a book and a phone
  { id: "sg3", src: "/images/segment3-seat-3.png", nw: 551, nh: 521, cx: 878, ground: 680, w: 146 },
];

const CourtyardScene = function CourtyardScene({ sceneRef }: CourtyardSceneProps) {
  return (
    <svg
      ref={sceneRef}
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="A warm courtyard at SenJun — a large tree stands at the center, with benches, string lights, and a small garden"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="courtyardSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDF4E0" />
          <stop offset="55%" stopColor="#FBE6C0" />
          <stop offset="100%" stopColor="#F6D69A" />
        </linearGradient>
        <radialGradient id="sunGlow3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F8D47E" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#F8D47E" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#F8D47E" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="houseLightGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F6D889" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#F6D889" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#F6D889" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ---- Sky, sun, clouds ---- */}
      <rect x={0} y={0} width={1200} height={800} fill="url(#courtyardSky)" />
      <circle cx={940} cy={200} r={220} fill="url(#sunGlow3)" />
      <circle cx={940} cy={200} r={46} fill="#F9E3A8" opacity={0.95} />
      <circle cx={940} cy={200} r={20} fill="#FFF8E1" opacity={0.85} />
      <g data-ambient="rays3" opacity={0.4} fill="#FFFDF2">
        <path d="M 940 200 L 1220 90 L 1216 170 Z" opacity={0.08} />
        <path d="M 940 200 L 1210 250 L 1166 306 Z" opacity={0.08} />
        <path d="M 940 200 L 1100 400 L 1038 424 Z" opacity={0.08} />
      </g>
      <g data-ambient="cloud3" opacity={0.7}>
        <g fill="#FFFFFF" opacity={0.9}>
          <ellipse cx={280} cy={120} rx={80} ry={15} />
          <ellipse cx={325} cy={108} rx={46} ry={13} />
          <ellipse cx={235} cy={114} rx={38} ry={11} />
        </g>
      </g>
      <g data-ambient="cloud3" opacity={0.5}>
        <g fill="#FFFFFF" opacity={0.85}>
          <ellipse cx={720} cy={160} rx={70} ry={13} />
          <ellipse cx={762} cy={150} rx={40} ry={11} />
        </g>
      </g>

      {/* ---- Distant hills ---- */}
      <path
        d="M 0 520 C 260 470 520 490 760 530 C 980 562 1100 545 1200 520 L 1200 800 L 0 800 Z"
        fill="#C3D8B6"
        opacity={0.9}
      />
      <path
        d="M 0 580 C 300 530 640 550 900 590 C 1020 610 1120 600 1200 596 L 1200 800 L 0 800 Z"
        fill="#AFCBA1"
      />

      {/* ---- The house — first glimpse, only a silhouette ---- */}
      <g data-house transform="translate(1012 356)" opacity={0}>
        <circle cx={-2} cy={-16} r={120} fill="url(#houseLightGlow)" opacity={0.8} />
        <rect x={-46} y={-22} width={92} height={52} rx={3} fill="#6E5B48" />
        <path d="M -56 -20 L -2 -52 L 52 -20 L 46 -18 L -2 -46 L -50 -18 Z" fill="#5C4B3A" />
        <rect x={26} y={-36} width={8} height={16} fill="#5C4B3A" />
        <rect x={-24} y={-10} width={16} height={22} rx={2} fill="#F6D889" opacity={0.95} />
        <rect x={4} y={-10} width={12} height={20} rx={1.5} fill="#6E5B48" />
        <circle cx={13} cy={0} r={1.4} fill="#F6D889" />
        <path d="M -24 -10 L -8 -10 L -8 12 L -24 12 Z" fill="#FBE3A8" opacity={0.55} />
      </g>

      {/* ---- Ground: lawn + courtyard ---- */}
      <path
        d="M 0 560 Q 300 530 600 545 Q 900 560 1200 540 L 1200 800 L 0 800 Z"
        fill="#CBE0B6"
      />
      <ellipse cx={600} cy={700} rx={330} ry={120} fill="#E9E2CC" opacity={0.85} />
      <ellipse cx={600} cy={700} rx={330} ry={120} fill="none" stroke="#D8CEB2" strokeWidth={2} opacity={0.7} />

      {/* ---- Path from the gate ---- */}
      <path
        d="M 220 860 Q 360 770 480 700 Q 560 660 620 655"
        stroke="#E9E0C9"
        strokeWidth={46}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 220 860 Q 360 770 480 700 Q 560 660 620 655"
        stroke="#F4EDD8"
        strokeWidth={36}
        fill="none"
        strokeLinecap="round"
      />
      {[
        [320, 792, 4],
        [400, 736, -3],
        [480, 688, 6],
        [556, 662, -2],
      ].map(([x, y, r]) => (
        <ellipse key={x} cx={x} cy={y} rx={13} ry={5} fill="#FFF9E9" opacity={0.7} transform={`rotate(${r} ${x} ${y})`} />
      ))}

      {/* ---- THE BIG TREE — the heart ---- */}
      <g data-scene="tree" transform="translate(600 600)" aria-hidden="true">
        {/* Trunk */}
        <path
          d="M -20 0 C -18 -60 -14 -120 -11 -170 C -8 -205 8 -205 11 -170 C 14 -120 18 -60 20 0 Z"
          fill="#7A5A38"
        />
        <path d="M -10 0 C -9 -70 -7 -130 -5 -170" stroke="#8A6A44" strokeWidth={4} fill="none" opacity={0.6} />
        {/* Right branch — for chimes and the butterfly */}
        <path
          d="M 8 -150 C 60 -140 110 -120 150 -95 C 170 -82 185 -66 196 -48"
          stroke="#7A5A38"
          strokeWidth={14}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 8 -150 C 60 -140 110 -120 150 -95 C 170 -82 185 -66 196 -48"
          stroke="#8A6A44"
          strokeWidth={4}
          fill="none"
          opacity={0.5}
        />
        {/* Left branch */}
        <path
          d="M -8 -130 C -70 -122 -130 -100 -170 -70"
          stroke="#7A5A38"
          strokeWidth={11}
          fill="none"
          strokeLinecap="round"
        />
        {/* Canopy */}
        <circle cx={-30} cy={-250} r={120} fill="#6E9879" />
        <circle cx={70} cy={-280} r={105} fill="#7FA98A" />
        <circle cx={-110} cy={-220} r={85} fill="#7FA98A" />
        <circle cx={40} cy={-200} r={90} fill="#8DB38F" />
        <circle cx={-60} cy={-320} r={80} fill="#94B89A" />
        <circle cx={120} cy={-240} r={70} fill="#8DB38F" />
        <circle cx={-130} cy={-160} r={60} fill="#8FB390" />
        {/* Light through the canopy */}
        <circle cx={-20} cy={-300} r={40} fill="#A8C9A0" opacity={0.55} />
        <circle cx={90} cy={-250} r={34} fill="#A8C9A0" opacity={0.5} />
        {/* Bench shadow under the tree */}
        <ellipse cx={-20} cy={40} rx={150} ry={22} fill="#C7B394" opacity={0.18} />
      </g>

      {/* ---- String lights between the tree and posts ---- */}
      <g data-scene="lights" aria-hidden="true">
        <ellipse data-lights-glow cx={585} cy={465} rx={330} ry={55} fill="#F6D889" opacity={0} />
        <line x1={190} y1={430} x2={190} y2={560} stroke="#7A5A38" strokeWidth={4} strokeLinecap="round" />
        <path d="M 190 430 Q 330 480 468 468" stroke="#5A4A38" strokeWidth={1.6} fill="none" />
        {[235, 280, 330, 378, 424, 458].map((x, i) => (
          <g key={x}>
            <line x1={x} y1={458 + Math.sin((x - 200) * 0.02) * 26} x2={x} y2={466 + Math.sin((x - 200) * 0.02) * 26} stroke="#5A4A38" strokeWidth={1} />
            <circle
              className="bulb-glow"
              style={{ animationDelay: `${i * 0.45}s` }}
              cx={x}
              cy={470 + Math.sin((x - 200) * 0.02) * 26}
              r={4.5}
              fill="#F6D889"
            />
          </g>
        ))}
        <line x1={985} y1={420} x2={985} y2={560} stroke="#7A5A38" strokeWidth={4} strokeLinecap="round" />
        <path d="M 740 462 Q 862 492 985 420" stroke="#5A4A38" strokeWidth={1.6} fill="none" />
        {[775, 822, 870, 916, 958].map((x, i) => (
          <g key={x}>
            <line x1={x} y1={480 - (x - 740) * 0.12} x2={x} y2={486 - (x - 740) * 0.12} stroke="#5A4A38" strokeWidth={1} />
            <circle className="bulb-glow" style={{ animationDelay: `${i * 0.5}s` }} cx={x} cy={490 - (x - 740) * 0.12} r={4.5} fill="#F6D889" />
          </g>
        ))}
      </g>

      {/* ---- Clothes line ---- */}
      <g aria-hidden="true">
        <line x1={640} y1={400} x2={812} y2={428} stroke="#5A4A38" strokeWidth={1.4} />
        <line x1={812} y1={428} x2={812} y2={560} stroke="#7A5A38" strokeWidth={3.4} strokeLinecap="round" />
        <g className="clothes-sway">
          <path d="M 662 406 L 684 405 L 682 424 L 664 425 Z" fill="#C6DFEF" stroke="#A9CCE2" strokeWidth={0.7} />
          <path d="M 700 408 L 724 409 L 722 430 L 702 429 Z" fill="#F3DFC9" stroke="#E2D5B6" strokeWidth={0.7} />
          <path d="M 746 412 L 764 413 L 763 428 L 747 427 Z" fill="#E5C36A" stroke="#D3A94F" strokeWidth={0.7} />
        </g>
      </g>

      {/* ---- Wind chimes ---- */}
      <g aria-hidden="true">
        <line x1={472} y1={340} x2={472} y2={368} stroke="#8A6740" strokeWidth={1.6} />
        <g className="chime">
          <line x1={466} y1={368} x2={478} y2={368} stroke="#8A6740" strokeWidth={2} />
          <line x1={468} y1={368} x2={466} y2={392} stroke="#B99B72" strokeWidth={1.4} />
          <line x1={472} y1={368} x2={472} y2={396} stroke="#B99B72" strokeWidth={1.4} />
          <line x1={476} y1={368} x2={478} y2={392} stroke="#B99B72" strokeWidth={1.4} />
          <rect x={463.6} y={390} width={5} height={7} rx={2} fill="#C9A87E" />
          <rect x={469.6} y={394} width={5} height={7} rx={2} fill="#C9A87E" />
          <rect x={475.6} y={390} width={5} height={7} rx={2} fill="#C9A87E" />
        </g>
      </g>

      {/* ---- Garden patch ---- */}
      <g aria-hidden="true">
        <path d="M 240 730 Q 280 706 340 708 Q 396 712 404 742 Q 330 758 256 750 Z" fill="#8F7A5C" opacity={0.55} />
        <Daisy x={270} y={728} s={0.9} />
        <Daisy x={330} y={726} s={0.85} />
        <PinkFlower x={300} y={712} s={1} />
        <PinkFlower x={360} y={734} s={0.85} />
        <Lavender x={252} y={722} s={0.9} />
        <Lavender x={382} y={716} s={0.8} />
        <GrassTuft x={320} y={752} s={1} />
      </g>

      {/* ---- Four bench groups (bench + residents as one composition) ----
           Layered here on purpose: above the tree/ground/garden (so they sit           on the courtyard) but below the bicycle, pets and foreground flora (so           props stay visible and flowers read in front). */}
      <g aria-hidden="true">
        {SEAT_GROUPS.map((g, i) => {
          const h = (g.w * g.nh) / g.nw;
          return (
            <g
              key={g.id}
              className="segment3-seat-group"
              style={{ animationDelay: `${i * 0.9}s` }}
            >
              {/* Soft contact shadow so the bench sits on the ground, not over it */}
              <ellipse
                cx={g.cx}
                cy={g.ground - 1}
                rx={g.w * 0.38}
                ry={g.w * 0.05}
                fill="#7A6242"
                opacity={0.13}
              />
              <image
                className="segment3-seat"
                href={g.src}
                x={g.cx - g.w / 2}
                y={g.ground - h}
                width={g.w}
                height={h}
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
          );
        })}
      </g>

      {/* ---- Bicycle being mended ---- */}
      <g transform="translate(1002 616)" aria-hidden="true">
        <circle cx={-16} cy={-12} r={12} fill="none" stroke="#8A6740" strokeWidth={2.4} />
        <circle cx={18} cy={-12} r={12} fill="none" stroke="#8A6740" strokeWidth={2.4} />
        <path d="M -16 -12 L 2 -28 L 18 -12 M 2 -28 L -1 -6 M 2 -28 L 7 -4 M -16 -12 L -9 -2 L -1 -6 M 18 -12 L 7 -4" stroke="#8A6740" strokeWidth={2.1} fill="none" strokeLinecap="round" />
        <circle cx={18} cy={-12} r={2} fill="#8A6740" />
        <rect x={-6} y={2} width={12} height={3} rx={1.5} fill="#8FA7B8" opacity={0.8} />
      </g>

      {/* ---- Cat — pads across the courtyard ---- */}
      <g data-cat-wrap transform="translate(500 716)" aria-hidden="true">
        <g data-scene="cat" data-cat>
          <ellipse cx={0} cy={14} rx={16} ry={4} fill="#C7B394" opacity={0.25} />
          <ellipse cx={0} cy={2} rx={13} ry={8} fill="#B98B62" />
          <circle cx={13} cy={-3} r={8} fill="#B98B62" />
          <polygon points="8,-9 11,-15 14,-9" fill="#B98B62" />
          <polygon points="15,-9 18,-14 20,-8" fill="#B98B62" />
          <circle cx={15.5} cy={-4.5} r={1.3} fill="#3A2B20" />
          <path d="M -13 0 Q -24 -4 -22 -14" className="cat-tail" stroke="#B98B62" strokeWidth={3.4} fill="none" strokeLinecap="round" />
          <path d="M 9 1 Q 12 3 15 1" stroke="#8A5A38" strokeWidth={0.9} fill="none" />
        </g>
      </g>

      {/* ---- Puppy + bowl ---- */}
      <g data-scene="puppy" aria-hidden="true">
        <g transform="translate(696 716)">
          <ellipse cx={0} cy={12} rx={14} ry={4} fill="#C7B394" opacity={0.25} />
          <ellipse cx={-2} cy={2} rx={11} ry={7} fill="#C9A87E" />
          <circle cx={10} cy={-2} r={7} fill="#C9A87E" />
          <circle cx={12.5} cy={-4} r={1.3} fill="#3A2B20" />
          <path d="M 16 0 Q 20 2 22 6" className="puppy-wag" stroke="#C9A87E" strokeWidth={2.6} fill="none" strokeLinecap="round" />
        </g>
        <ellipse cx={668} cy={724} rx={10} ry={3.4} fill="#8A8578" />
        <ellipse cx={668} cy={722} rx={7.5} ry={2.4} fill="#A9A294" />
      </g>

      {/* ---- Lanterns ---- */}
      <g transform="translate(196 668)" aria-hidden="true">
        <circle className="glow-breathe" r={16} fill="#F6D889" opacity={0.5} />
        <path d="M -6 0 L 6 0 L 4.5 10 L -4.5 10 Z" fill="#F6D889" stroke="#C9A86B" strokeWidth={0.8} opacity={0.95} />
        <rect x={-3} y={-5} width={6} height={2} rx={1} fill="#8A5A38" />
      </g>

      {/* ---- Birds ---- */}
      <g data-ambient="bird3" transform="translate(0 250)" opacity={0.55}>
        <g fill="none" stroke="#9AA093" strokeWidth={1.5} strokeLinecap="round">
          <path d="M 0 0 Q 5 -5 10 0 Q 15 -5 20 0" />
        </g>
      </g>
      <g data-ambient="bird3" transform="translate(0 300)" opacity={0.5}>
        <g fill="none" stroke="#9AA093" strokeWidth={1.3} strokeLinecap="round">
          <path d="M 0 0 Q 4 -4 8 0 Q 12 -4 16 0" />
        </g>
      </g>
      {/* Landed bird near the puppy */}
      <g transform="translate(640 690)" aria-hidden="true" opacity={0.8}>
        <ellipse cx={0} cy={0} rx={4} ry={3} fill="#9FB89A" />
        <circle cx={3} cy={-3} r={2.2} fill="#9FB89A" />
        <path d="M -2 -1 L -5 1" stroke="#8A9C84" strokeWidth={1} strokeLinecap="round" />
      </g>

      {/* ---- Distant butterflies ---- */}
      <g data-ambient="farbf3" transform="translate(300 260) scale(0.55)" aria-hidden="true" opacity={0.7}>
        <path className="mini-butterfly-wing" d="M 0 0 C -5 -6 -11 -5 -12 -1 C -11 2 -5 3 0 2 Z" fill="#FFFDF7" stroke="#A9D8EE" strokeWidth={0.6} />
        <path className="mini-butterfly-wing mini-butterfly-wing--r" d="M 0 0 C 5 -6 11 -5 12 -1 C 11 2 5 3 0 2 Z" fill="#FFFDF7" stroke="#A9D8EE" strokeWidth={0.6} />
      </g>
      <g data-ambient="farbf4" transform="translate(520 220) scale(0.45)" aria-hidden="true" opacity={0.55}>
        <path className="mini-butterfly-wing" d="M 0 0 C -5 -6 -11 -5 -12 -1 C -11 2 -5 3 0 2 Z" fill="#FFFDF7" stroke="#A9D8EE" strokeWidth={0.6} />
        <path className="mini-butterfly-wing mini-butterfly-wing--r" d="M 0 0 C 5 -6 11 -5 12 -1 C 11 2 5 3 0 2 Z" fill="#FFFDF7" stroke="#A9D8EE" strokeWidth={0.6} />
      </g>

      {/* ---- Flora everywhere ---- */}
      <Daisy x={380} y={660} s={1} />
      <Daisy x={580} y={640} s={0.9} />
      <Daisy x={880} y={640} s={0.85} />
      <Daisy x={1000} y={690} s={0.8} />
      <PinkFlower x={430} y={650} s={0.9} />
      <PinkFlower x={620} y={620} s={0.85} />
      <PinkFlower x={840} y={700} s={0.9} />
      <PinkFlower x={180} y={700} s={1} />
      <Lavender x={360} y={640} s={0.9} />
      <Lavender x={820} y={660} s={0.85} />
      <Lavender x={940} y={720} s={0.8} />
      <GrassTuft x={440} y={700} s={1} />
      <GrassTuft x={560} y={670} s={0.9} />
      <GrassTuft x={920} y={680} s={0.85} />

    </svg>
  );
};

export default CourtyardScene;
