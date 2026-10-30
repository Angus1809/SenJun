"use client";

import { forwardRef } from "react";
import type { Ref } from "react";
import { Daisy, Lavender, GrassTuft, PinkFlower } from "@/components/shared/Flora";

/**
 * Chapter Two scene — the journey continues.
 *
 * Afternoon sunlight, a winding path through the garden, large trees, a small
 * wooden bridge over a gentle stream. Tiny symbolic objects along the way hint
 * at companionship — a shared umbrella, two coffee cups on a bench, books, a
 * bicycle, flowers growing together, lanterns — no explanations. The house
 * stays hidden; the destination remains a promise. The chapter ends at an
 * old wooden signpost whose board reads "Way to SenJun" — the marker the
 * travellers have been walking toward.
 */

export type PathwaySceneProps = {
  sceneRef: Ref<SVGSVGElement>;
};

const PathwayScene = forwardRef<SVGSVGElement, PathwaySceneProps>(
  function PathwayScene({ sceneRef }, _ref) {
    return (
      <svg
        ref={sceneRef}
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="A warm afternoon pathway through the garden — a wooden bridge crosses a stream, and an old signpost reading Way to SenJun stands in the distance"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="afternoonSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDF6E7" />
            <stop offset="52%" stopColor="#FBE9C8" />
            <stop offset="100%" stopColor="#F7DC9C" />
          </linearGradient>
          <radialGradient id="sunGlow2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F8D47E" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#F8D47E" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F8D47E" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="streamGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A9D4E4" />
            <stop offset="100%" stopColor="#8FC0D4" />
          </linearGradient>
        </defs>

        {/* ---- Sky, sun, rays ---- */}
        <rect x={0} y={0} width={1200} height={800} fill="url(#afternoonSky)" />
        <circle cx={950} cy={205} r={210} fill="url(#sunGlow2)" />
        <circle cx={950} cy={205} r={46} fill="#F9E3A8" opacity={0.95} />
        <circle cx={950} cy={205} r={20} fill="#FFF8E1" opacity={0.85} />
        <g data-ambient="rays2" opacity={0.4} fill="#FFFDF2">
          <path d="M 950 205 L 1230 90 L 1226 170 Z" opacity={0.08} />
          <path d="M 950 205 L 1220 250 L 1176 306 Z" opacity={0.08} />
          <path d="M 950 205 L 1110 400 L 1048 424 Z" opacity={0.08} />
          <path d="M 950 205 L 1180 -40 L 1192 40 Z" opacity={0.08} />
        </g>

        {/* Drifting clouds */}
        <g data-ambient="cloud2" opacity={0.7}>
          <g fill="#FFFFFF" opacity={0.9}>
            <ellipse cx={300} cy={130} rx={80} ry={15} />
            <ellipse cx={345} cy={118} rx={46} ry={13} />
            <ellipse cx={255} cy={124} rx={38} ry={11} />
          </g>
        </g>
        <g data-ambient="cloud2" opacity={0.5}>
          <g fill="#FFFFFF" opacity={0.85}>
            <ellipse cx={700} cy={170} rx={70} ry={13} />
            <ellipse cx={742} cy={160} rx={40} ry={11} />
          </g>
        </g>

        {/* ---- Distant hills ---- */}
        <path
          d="M 0 560 C 220 500 420 520 620 560 C 820 600 1020 570 1200 540 L 1200 800 L 0 800 Z"
          fill="#C3D8B6"
          opacity={0.9}
        />
        <path
          d="M 0 620 C 300 560 640 590 900 630 C 1020 648 1120 640 1200 636 L 1200 800 L 0 800 Z"
          fill="#AFCBA1"
        />

        {/* ---- Large trees ---- */}
        {/* Left tree */}
        <g transform="translate(150 640)" className="sway-tree">
          <path
            d="M -6 0 C -5 -24 -2 -40 -3 -54 C -1 -64 6 -64 8 -52 C 10 -38 11 -20 10 -4 C 6 -10 3 -4 -6 0 Z"
            fill="#7A5A38"
          />
          <circle cx={-4} cy={-68} r={34} fill="#6E9879" />
          <circle cx={-30} cy={-56} r={22} fill="#7FA98A" />
          <circle cx={24} cy={-54} r={21} fill="#7FA98A" />
          <circle cx={10} cy={-90} r={24} fill="#8DB38F" />
          <circle cx={-18} cy={-86} r={16} fill="#94B89A" />
        </g>
        {/* Right tree */}
        <g transform="translate(1052 630)" className="sway-tree">
          <path
            d="M -6 0 C -5 -26 -2 -42 -3 -56 C -1 -66 6 -66 8 -54 C 10 -40 11 -22 10 -4 C 6 -10 3 -4 -6 0 Z"
            fill="#7A5A38"
          />
          <circle cx={-4} cy={-70} r={36} fill="#6E9879" />
          <circle cx={-32} cy={-58} r={23} fill="#7FA98A" />
          <circle cx={26} cy={-56} r={22} fill="#7FA98A" />
          <circle cx={10} cy={-92} r={25} fill="#8DB38F" />
          <circle cx={-20} cy={-88} r={16} fill="#94B89A" />
          <circle cx={40} cy={-74} r={14} fill="#94B89A" />
        </g>
        {/* Small mid tree behind the bridge */}
        <g transform="translate(690 566) scale(0.5)">
          <path d="M -4 0 C -3 -12 0 -16 0 -22 C 3 -16 4 -10 4 -4 C 1 -5 0 -3 -4 0 Z" fill="#8A6740" />
          <circle cx={0} cy={-28} r={18} fill="#8FB390" />
          <circle cx={-10} cy={-23} r={11} fill="#9FC29A" />
        </g>

        {/* ---- Stream ---- */}
        <g>
          <path
            d="M 140 628 Q 400 636 700 628 Q 950 622 1060 630 L 1060 652 Q 700 660 400 650 Q 220 644 140 650 Z"
            fill="url(#streamGrad)"
            opacity={0.95}
          />
          <path
            className="stream-shimmer"
            d="M 220 642 Q 460 650 700 644"
            stroke="#D8EEF6"
            strokeWidth={2.2}
            fill="none"
            strokeLinecap="round"
          />
          <path
            className="stream-shimmer"
            style={{ animationDelay: "1.1s" }}
            d="M 340 654 Q 540 658 760 652"
            stroke="#BFE0EE"
            strokeWidth={1.6}
            fill="none"
            strokeLinecap="round"
          />
          <path
            className="stream-shimmer"
            style={{ animationDelay: "2s" }}
            d="M 560 634 Q 720 630 900 636"
            stroke="#D8EEF6"
            strokeWidth={1.4}
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* ---- Winding pathway (ribbon) ---- */}
        <path
          d="M 300 868 Q 430 770 540 664 Q 585 618 620 612 Q 700 610 760 520 Q 800 462 832 424"
          stroke="#E9E0C9"
          strokeWidth={36}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 300 868 Q 430 770 540 664 Q 585 618 620 612 Q 700 610 760 520 Q 800 462 832 424"
          stroke="#DDD0AE"
          strokeWidth={36}
          fill="none"
          strokeLinecap="round"
          opacity={0.55}
        />
        <path
          d="M 300 868 Q 430 770 540 664 Q 585 618 620 612 Q 700 610 760 520 Q 800 462 832 424"
          stroke="#F4EDD8"
          strokeWidth={27}
          fill="none"
          strokeLinecap="round"
        />
        {/* Stone highlights */}
        {[
          [352, 808, 0],
          [420, 742, 6],
          [486, 692, -4],
          [556, 636, 8],
          [636, 610, -6],
          [712, 552, 5],
          [784, 490, -4],
          [820, 448, 3],
        ].map(([x, y, r]) => (
          <ellipse
            key={x}
            cx={x}
            cy={y}
            rx={13}
            ry={5}
            fill="#FFF9E9"
            opacity={0.7}
            transform={`rotate(${r} ${x} ${y})`}
          />
        ))}

        {/* ---- Wooden bridge ---- */}
        <g>
          {/* Deck arc */}
          <path
            d="M 448 622 Q 555 592 668 620"
            stroke="#A9714F"
            strokeWidth={12}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 448 622 Q 555 592 668 620"
            stroke="#C08C5E"
            strokeWidth={8}
            fill="none"
            strokeLinecap="round"
          />
          {/* Planks */}
          {[478, 506, 534, 562, 590, 618, 646].map((x) => {
            const y = 606 + (x - 560) * 0.0025;
            return (
              <line
                key={x}
                x1={x - 16}
                y1={y + 1}
                x2={x + 16}
                y2={y + 1}
                stroke="#8A5A38"
                strokeWidth={2}
                opacity={0.65}
              />
            );
          })}
          {/* Rails */}
          <path
            d="M 452 608 Q 555 576 664 606"
            stroke="#8A5A38"
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 452 616 Q 555 584 664 612"
            stroke="#8A5A38"
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          />
          {/* Posts */}
          {[466, 560, 654].map((x) => {
            const y = 608 + (x - 560) * 0.002;
            return <line key={x} x1={x} y1={y - 4} x2={x} y2={y + 12} stroke="#7A4E2E" strokeWidth={3.4} strokeLinecap="round" />;
          })}
        </g>

        {/* ---- Bench with two coffee cups ---- */}
        <g transform="translate(396 688)" aria-hidden="true">
          <ellipse cx={0} cy={4} rx={30} ry={6} fill="#C7B394" opacity={0.2} />
          <rect x={-28} y={-14} width={56} height={4.5} rx={2.2} fill="#A9714F" />
          <rect x={-28} y={-22} width={56} height={4.5} rx={2.2} fill="#B9855A" />
          <rect x={-26} y={-10} width={5} height={12} rx={2} fill="#8A5A38" />
          <rect x={21} y={-10} width={5} height={12} rx={2} fill="#8A5A38" />
          {/* Two cups side by side */}
          <g transform="translate(-10 -26)">
            <path d="M -5 0 Q -6 -8 0 -8 Q 6 -8 5 0 Q 3 2 -1 2 Z" fill="#FFFDF7" stroke="#E7DCC7" strokeWidth={0.6} />
            <path d="M 4 -7 Q 8 -7 7 -4" stroke="#E7DCC7" strokeWidth={0.7} fill="none" />
          </g>
          <g transform="translate(10 -26)">
            <path d="M -5 0 Q -6 -8 0 -8 Q 6 -8 5 0 Q 3 2 -1 2 Z" fill="#FFFDF7" stroke="#E7DCC7" strokeWidth={0.6} />
            <path d="M 4 -7 Q 8 -7 7 -4" stroke="#E7DCC7" strokeWidth={0.7} fill="none" />
          </g>
          {/* Steam curls */}
          <path d="M -10 -34 Q -12 -40 -9 -44" stroke="#D9C39A" strokeWidth={1.2} fill="none" strokeLinecap="round" opacity={0.7} />
          <path d="M 10 -34 Q 12 -40 9 -44" stroke="#D9C39A" strokeWidth={1.2} fill="none" strokeLinecap="round" opacity={0.7} />
        </g>

        {/* ---- Shared umbrella, leaning on the bench ---- */}
        <g transform="translate(352 706)" aria-hidden="true">
          <path
            d="M -26 6 Q -30 -6 -18 -16 Q -2 -30 10 -20 Q 18 -14 12 -6 Q -2 4 -10 2 L -14 -12"
            stroke="#8A6540"
            strokeWidth={2.4}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M -30 -8 Q -12 -20 8 -18 Q 24 -16 26 -4 Q 18 -8 6 -10 Q -12 -12 -26 -4 Z"
            fill="#F2E3CE"
            stroke="#D9C39A"
            strokeWidth={1}
          />
          <path d="M -16 -10 Q 0 -16 18 -12" stroke="#BBDDEA" strokeWidth={2.4} fill="none" strokeLinecap="round" />
        </g>

        {/* ---- Books on a rock ---- */}
        <g transform="translate(712 668)" aria-hidden="true">
          <ellipse cx={0} cy={6} rx={26} ry={9} fill="#C7B394" opacity={0.25} />
          <ellipse cx={0} cy={2} rx={20} ry={7} fill="#B9A277" />
          <rect x={-15} y={-16} width={30} height={6} rx={1.5} fill="#C96F4A" transform="rotate(-3)" />
          <rect x={-14} y={-11} width={28} height={5} rx={1.4} fill="#7FA9B8" transform="rotate(-1)" />
          <rect x={-12} y={-7} width={24} height={5} rx={1.3} fill="#E5C36A" transform="rotate(2)" />
          <path d="M -2 -15 L -2 -9" stroke="#F2E3CE" strokeWidth={1.4} />
        </g>

        {/* ---- Bicycle, leaning against the right tree ---- */}
        <g transform="translate(998 640)" aria-hidden="true">
          <circle cx={-14} cy={-14} r={13} fill="none" stroke="#8A6740" strokeWidth={2.6} />
          <circle cx={20} cy={-14} r={13} fill="none" stroke="#8A6740" strokeWidth={2.6} />
          <path d="M -14 -14 L 2 -30 L 20 -14 M 2 -30 L -1 -8 M 2 -30 L 7 -6 M -14 -14 L -7 -4 L -1 -8 M 20 -14 L 7 -6" stroke="#8A6740" strokeWidth={2.2} fill="none" strokeLinecap="round" />
          <path d="M 7 -6 L 12 -8" stroke="#B99B72" strokeWidth={2.4} fill="none" strokeLinecap="round" />
          <circle cx={20} cy={-14} r={2.2} fill="#8A6740" />
        </g>

        {/* ---- Lantern arch with two hanging lanterns ---- */}
        <g aria-hidden="true">
          <line x1={236} y1={560} x2={236} y2={462} stroke="#7A5A38" strokeWidth={4} strokeLinecap="round" />
          <line x1={356} y1={560} x2={356} y2={462} stroke="#7A5A38" strokeWidth={4} strokeLinecap="round" />
          <path d="M 236 462 Q 296 436 356 462" stroke="#7A5A38" strokeWidth={3.4} fill="none" strokeLinecap="round" />
          {/* Lantern 1 */}
          <g transform="translate(262 480)">
            <circle className="glow-breathe" r={16} fill="#F6D889" opacity={0.5} />
            <rect x={-5} y={-9} width={10} height={2} rx={1} fill="#8A5A38" />
            <path d="M -6 0 L 6 0 L 4.5 10 L -4.5 10 Z" fill="#F6D889" stroke="#C9A86B" strokeWidth={0.8} opacity={0.95} />
            <path d="M -3 -9 L -3 -14 M 3 -9 L 3 -14" stroke="#8A5A38" strokeWidth={1.4} />
          </g>
          {/* Lantern 2 */}
          <g transform="translate(330 488)">
            <circle className="glow-breathe" style={{ animationDelay: "1.4s" }} r={16} fill="#F6D889" opacity={0.5} />
            <rect x={-5} y={-9} width={10} height={2} rx={1} fill="#8A5A38" />
            <path d="M -6 0 L 6 0 L 4.5 10 L -4.5 10 Z" fill="#F6D889" stroke="#C9A86B" strokeWidth={0.8} opacity={0.95} />
            <path d="M -3 -9 L -3 -14 M 3 -9 L 3 -14" stroke="#8A5A38" strokeWidth={1.4} />
          </g>
        </g>

        {/* ---- Two daisies growing together (intertwined stems) ---- */}
        <g transform="translate(556 664)" aria-hidden="true">
          <path d="M -6 0 Q -10 -14 -6 -24 M 4 0 Q 8 -12 6 -22" stroke="#7FA96F" strokeWidth={1.4} fill="none" />
          <path d="M -6 -10 Q 0 -8 6 -12" stroke="#7FA96F" strokeWidth={1} fill="none" />
          <g transform="translate(-6 -26) scale(0.85)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <ellipse key={deg} cx={0} cy={-6.2} rx={2.7} ry={1.7} fill="#FFFFFF" stroke="#EFE7D8" strokeWidth={0.4} transform={`rotate(${deg})`} />
            ))}
            <circle r={2.7} fill="#F2D06B" />
          </g>
          <g transform="translate(6 -24) scale(0.85)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <ellipse key={deg} cx={0} cy={-6.2} rx={2.7} ry={1.7} fill="#FFFFFF" stroke="#EFE7D8" strokeWidth={0.4} transform={`rotate(${deg})`} />
            ))}
            <circle r={2.7} fill="#F2D06B" />
          </g>
        </g>

        {/* Tiny birds in the distance */}
        <g data-ambient="bird2" transform="translate(0 250)" opacity={0.55}>
          <g fill="none" stroke="#9AA093" strokeWidth={1.5} strokeLinecap="round">
            <path d="M 0 0 Q 5 -5 10 0 Q 15 -5 20 0" />
          </g>
        </g>
        <g data-ambient="bird2" transform="translate(0 300)" opacity={0.5}>
          <g fill="none" stroke="#9AA093" strokeWidth={1.3} strokeLinecap="round">
            <path d="M 0 0 Q 4 -4 8 0 Q 12 -4 16 0" />
          </g>
        </g>

        {/* ---- Distant butterflies (far background) ---- */}
        <g data-ambient="farbf1" transform="translate(180 300) scale(0.6)" aria-hidden="true" opacity={0.75}>
          <path className="mini-butterfly-wing" d="M 0 0 C -5 -6 -11 -5 -12 -1 C -11 2 -5 3 0 2 Z" fill="#FFFDF7" stroke="#A9D8EE" strokeWidth={0.6} />
          <path className="mini-butterfly-wing mini-butterfly-wing--r" d="M 0 0 C 5 -6 11 -5 12 -1 C 11 2 5 3 0 2 Z" fill="#FFFDF7" stroke="#A9D8EE" strokeWidth={0.6} />
        </g>
        <g data-ambient="farbf2" transform="translate(300 240) scale(0.5)" aria-hidden="true" opacity={0.6}>
          <path className="mini-butterfly-wing" d="M 0 0 C -5 -6 -11 -5 -12 -1 C -11 2 -5 3 0 2 Z" fill="#FFFDF7" stroke="#A9D8EE" strokeWidth={0.6} />
          <path className="mini-butterfly-wing mini-butterfly-wing--r" d="M 0 0 C 5 -6 11 -5 12 -1 C 11 2 5 3 0 2 Z" fill="#FFFDF7" stroke="#A9D8EE" strokeWidth={0.6} />
        </g>

        {/* ---- The signpost — the "Way to SenJun" destination marker ---- */}
        <g transform="translate(836 452)" aria-hidden="true">
          <ellipse cx={0} cy={58} rx={18} ry={4} fill="#C7B394" opacity={0.25} />
          <rect x={-5} y={-66} width={10} height={124} rx={4} fill="#8A6740" />
          <rect x={-7} y={-66} width={14} height={8} rx={3} fill="#9C7A52" />
          <rect x={-36} y={-88} width={72} height={38} rx={7} fill="#9C7A52" stroke="#7A5636" strokeWidth={1.2} />
          {/* Handwritten destination text — centred, carved-wood dark */}
          <text
            className="font-hand"
            x={0}
            y={-66}
            textAnchor="middle"
            fontSize={12}
            fontWeight={700}
            fill="#2F1D0B"
          >
            Way to SenJun
          </text>
          {/* Nail */}
          <circle cx={0} cy={-84} r={2} fill="#6B4C2E" />
        </g>

        {/* ---- Flora along the path ---- */}
        <Lavender x={340} y={840} s={1} />
        <Lavender x={470} y={700} s={0.9} />
        <Lavender x={620} y={620} s={0.8} />
        <Lavender x={760} y={500} s={0.85} />
        <Daisy x={400} y={790} s={1} />
        <Daisy x={540} y={650} s={0.9} />
        <Daisy x={680} y={560} s={0.85} />
        <Daisy x={820} y={440} s={0.8} />
        <PinkFlower x={300} y={860} s={1} />
        <PinkFlower x={500} y={680} s={0.9} />
        <PinkFlower x={640} y={590} s={0.8} />
        <PinkFlower x={790} y={480} s={0.85} />
        <GrassTuft x={360} y={820} s={1} />
        <GrassTuft x={460} y={720} s={0.9} />
        <GrassTuft x={580} y={630} s={0.8} />
        <GrassTuft x={700} y={540} s={0.8} />
        <GrassTuft x={800} y={460} s={0.7} />

      </svg>
    );
  }
);

export default PathwayScene;
