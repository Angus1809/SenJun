"use client";

import type { Ref } from "react";
import { Daisy, Lavender, PinkFlower, GrassTuft } from "@/components/shared/Flora";

/**
 * Chapter Four scene — the final destination, at golden hour.
 *
 * The journey that began at sunrise ends at sunset. A handcrafted home stands
 * at the end of the path: wood and stone, warm lights glowing through the
 * windows, flower pots by the door, a large tree beside it, wind chimes,
 * lanterns, a kettle steaming, slippers neatly placed, a cat asleep near the
 * entrance. The door opens and warm light pours out. This is SenJun.
 *
 * The butterfly's final resting place is the flowering plant by the door —
 * scene point BUTTERFLY_REST — where it lands and never leaves.
 */

export type HomeSceneProps = {
  sceneRef: Ref<SVGSVGElement>;
  doorRef: Ref<SVGGElement>;
  girlRef: Ref<SVGGElement>;
};

/** Where the butterfly rests forever — the flowering plant by the door. */
export const BUTTERFLY_REST = { x: 574, y: 588 };

const HomeScene = function HomeScene({ sceneRef, doorRef, girlRef }: HomeSceneProps) {
  return (
    <svg
      ref={sceneRef}
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Golden hour at SenJun — a warm handcrafted home at the end of a stone path, with glowing windows, lanterns, flower pots, and a large tree beside it"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="homeSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F7D9BE" />
          <stop offset="52%" stopColor="#F3BCA0" />
          <stop offset="100%" stopColor="#E99D8C" />
        </linearGradient>
        <radialGradient id="sunGlow4" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE3A6" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#FFD98C" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFD98C" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="windowGlow4" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F6D889" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#F6D889" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#F6D889" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="doorLight4" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE7A0" stopOpacity="1" />
          <stop offset="60%" stopColor="#FFDD7E" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFDD7E" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ---- Sunset sky ---- */}
      <rect x={0} y={0} width={1200} height={800} fill="url(#homeSky)" />

      {/* ---- Sun low on the horizon ---- */}
      <circle cx={300} cy={470} r={240} fill="url(#sunGlow4)" />
      <circle cx={300} cy={470} r={56} fill="#FFE9B0" />
      <circle cx={300} cy={470} r={26} fill="#FFF6D8" />
      <g data-ambient="rays4" opacity={0.35} fill="#FFF3D6">
        <path d="M 300 470 L 560 330 L 590 396 Z" opacity={0.1} />
        <path d="M 300 470 L 580 470 L 566 528 Z" opacity={0.1} />
        <path d="M 300 470 L 480 640 L 424 666 Z" opacity={0.1} />
      </g>

      {/* ---- Stars — become visible as evening deepens ---- */}
      <g data-stars opacity={0.35} aria-hidden="true">
        <circle className="star-twinkle" cx={120} cy={90} r={1.4} fill="#FFF6E0" />
        <circle className="star-twinkle" style={{ animationDelay: "0.9s" }} cx={260} cy={140} r={1.1} fill="#FFF6E0" />
        <circle className="star-twinkle" style={{ animationDelay: "1.7s" }} cx={430} cy={70} r={1.5} fill="#FFF6E0" />
        <circle className="star-twinkle" style={{ animationDelay: "0.4s" }} cx={560} cy={120} r={1.1} fill="#FFF6E0" />
        <circle className="star-twinkle" style={{ animationDelay: "2.1s" }} cx={700} cy={60} r={1.4} fill="#FFF6E0" />
        <circle className="star-twinkle" style={{ animationDelay: "1.2s" }} cx={830} cy={110} r={1.2} fill="#FFF6E0" />
        <circle className="star-twinkle" style={{ animationDelay: "0.7s" }} cx={980} cy={70} r={1.4} fill="#FFF6E0" />
        <circle className="star-twinkle" style={{ animationDelay: "1.9s" }} cx={1090} cy={140} r={1.1} fill="#FFF6E0" />
      </g>

      {/* ---- Soft clouds ---- */}
      <g data-ambient="cloud4" opacity={0.75}>
        <g fill="#FFE9DC" opacity={0.9}>
          <ellipse cx={180} cy={180} rx={85} ry={14} />
          <ellipse cx={230} cy={170} rx={46} ry={11} />
          <ellipse cx={130} cy={175} rx={38} ry={9} />
        </g>
      </g>
      <g data-ambient="cloud4" opacity={0.55}>
        <g fill="#FFE4D2" opacity={0.85}>
          <ellipse cx={940} cy={210} rx={90} ry={13} />
          <ellipse cx={990} cy={200} rx={48} ry={10} />
          <ellipse cx={890} cy={205} rx={40} ry={8} />
        </g>
      </g>

      {/* ---- Dusk hills ---- */}
      <path
        d="M 0 520 C 260 470 540 500 760 535 C 980 565 1100 540 1200 512 L 1200 800 L 0 800 Z"
        fill="#D8B494"
        opacity={0.9}
      />
      <path
        d="M 0 590 C 300 545 620 560 900 595 C 1020 615 1120 600 1200 590 L 1200 800 L 0 800 Z"
        fill="#C49A78"
      />
      <path d="M 0 640 Q 400 610 800 635 Q 1000 650 1200 632 L 1200 800 L 0 800 Z" fill="#B0865F" />

      {/* ---- Ground lawn ---- */}
      <path
        d="M 0 590 Q 300 570 620 585 Q 900 600 1200 578 L 1200 800 L 0 800 Z"
        fill="#A9BE8E"
      />
      <path
        d="M 0 640 Q 350 625 660 645 Q 920 660 1200 640 L 1200 800 L 0 800 Z"
        fill="#93A878"
      />

      {/* ---- The large tree beside the house ---- */}
      <g transform="translate(455 606)" aria-hidden="true">
        <ellipse cx={10} cy={8} rx={110} ry={16} fill="#5C4632" opacity={0.25} />
        <path
          d="M -14 0 C -12 -50 -9 -100 -7 -140 C -5 -168 8 -168 10 -140 C 12 -100 15 -50 17 0 Z"
          fill="#6B4C2E"
        />
        <path d="M -7 0 C -6 -60 -4 -110 -3 -140" stroke="#7C5A3A" strokeWidth={3.4} fill="none" opacity={0.6} />
        <path d="M 6 -120 C 45 -115 85 -100 118 -82" stroke="#6B4C2E" strokeWidth={9} fill="none" strokeLinecap="round" />
        <g className="sway-tree">
          <circle cx={-30} cy={-210} r={95} fill="#5F7A5A" />
          <circle cx={55} cy={-230} r={85} fill="#6E8A66" />
          <circle cx={-95} cy={-185} r={70} fill="#6E8A66" />
          <circle cx={15} cy={-165} r={72} fill="#7D9674" />
          <circle cx={-55} cy={-265} r={62} fill="#819A78" />
          <circle cx={95} cy={-195} r={58} fill="#7D9674" />
          <circle cx={-105} cy={-135} r={48} fill="#789069" />
          <circle cx={-20} cy={-250} r={30} fill="#93A888" opacity={0.55} />
        </g>
      </g>

      {/* ---- THE HOUSE — handcrafted, warm, welcoming ---- */}
      <g data-scene="house" transform="translate(640 604)" aria-hidden="true">
        <ellipse cx={0} cy={8} rx={140} ry={14} fill="#4E3A26" opacity={0.28} />

        {/* Stone base */}
        <rect x={-74} y={-10} width={148} height={13} rx={2} fill="#B49A7C" stroke="#9C8266" strokeWidth={1} />
        <path d="M -60 -10 L -58 3 M -30 -10 L -32 3 M 4 -10 L 6 3 M 40 -10 L 38 3 M 66 -10 L 68 3" stroke="#9C8266" strokeWidth={1.2} opacity={0.7} />

        {/* Wooden wall */}
        <rect x={-70} y={-86} width={140} height={76} fill="#B08A5E" stroke="#96693E" strokeWidth={1.4} />
        <path d="M -52 -86 L -52 -10 M -34 -86 L -34 -10 M -16 -86 L -16 -10 M 2 -86 L 2 -10 M 20 -86 L 20 -10 M 38 -86 L 38 -10 M 56 -86 L 56 -10" stroke="#96693E" strokeWidth={1} opacity={0.35} />

        {/* Roof */}
        <path d="M -96 -84 L 0 -154 L 96 -84 Z" fill="#7A4E34" stroke="#66402A" strokeWidth={1.5} />
        <path d="M -84 -84 L 0 -146 L 84 -84 Z" fill="#8A5A38" opacity={0.85} />
        <rect x={-98} y={-86} width={196} height={5} rx={2.5} fill="#5C3A24" />
        {/* Chimney */}
        <rect x={48} y={-140} width={16} height={26} fill="#8A5A38" stroke="#6B422B" strokeWidth={1} />
        <rect x={46} y={-142} width={20} height={4} rx={1.5} fill="#6B422B" />

        {/* Left window — warm glow + curtains + flower pot */}
        <g transform="translate(-44 -66)">
          <ellipse data-window-glow cx={0} cy={0} rx={60} ry={55} fill="url(#windowGlow4)" opacity={0.35} />
          <rect x={-12} y={-14} width={24} height={28} rx={1} fill="#F6C97B" stroke="#6B4C2E" strokeWidth={2.2} />
          <path d="M 0 -14 L 0 14 M -12 0 L 12 0" stroke="#6B4C2E" strokeWidth={1.6} />
          <g className="curtain-sway">
            <path d="M -12 -14 L -5 -14 L -7 2 L -12 4 Z" fill="#F3DFC9" opacity={0.9} />
            <path d="M 12 -14 L 5 -14 L 7 2 L 12 4 Z" fill="#F3DFC9" opacity={0.9} />
          </g>
          {/* Flower pot on the sill */}
          <g transform="translate(0 18)">
            <path d="M -7 0 L 7 0 L 5 9 L -5 9 Z" fill="#B25F4A" stroke="#96452F" strokeWidth={0.8} />
            <circle cx={-3} cy={-2} r={2.2} fill="#7D9674" />
            <circle cx={3} cy={-3} r={2.2} fill="#7D9674" />
          </g>
        </g>

        {/* Right window */}
        <g transform="translate(44 -66)">
          <ellipse data-window-glow cx={0} cy={0} rx={60} ry={55} fill="url(#windowGlow4)" opacity={0.35} />
          <rect x={-12} y={-14} width={24} height={28} rx={1} fill="#F6C97B" stroke="#6B4C2E" strokeWidth={2.2} />
          <path d="M 0 -14 L 0 14 M -12 0 L 12 0" stroke="#6B4C2E" strokeWidth={1.6} />
          <g className="curtain-sway">
            <path d="M -12 -14 L -5 -14 L -7 2 L -12 4 Z" fill="#F3DFC9" opacity={0.9} />
            <path d="M 12 -14 L 5 -14 L 7 2 L 12 4 Z" fill="#F3DFC9" opacity={0.9} />
          </g>
          <g transform="translate(0 18)">
            <path d="M -7 0 L 7 0 L 5 9 L -5 9 Z" fill="#B25F4A" stroke="#96452F" strokeWidth={0.8} />
            <circle cx={-3} cy={-2} r={2.2} fill="#7D9674" />
            <circle cx={3} cy={-3} r={2.2} fill="#7D9674" />
          </g>
        </g>

        {/* Porch lantern glow — brightens when the sign is hovered */}
        <ellipse data-porch-glow cx={-4} cy={-40} rx={120} ry={70} fill="#F6D889" opacity={0.12} />

        {/* Door — opens at the right moment; warm light pours out */}
        <g transform="translate(-38 0)">
          <rect x={0} y={-54} width={34} height={54} fill="#3A2E24" />
          <rect data-door-glow x={-8} y={-58} width={52} height={60} fill="#FFE7A0" opacity={0.28} />
          <circle data-door-glow cx={-2} cy={-26} r={95} fill="url(#doorLight4)" opacity={0.5} />
          <g ref={doorRef}>
            <rect x={1} y={-54} width={32} height={54} rx={1.5} fill="#8A5A38" stroke="#6B422B" strokeWidth={1.4} />
            <rect x={6} y={-47} width={22} height={18} rx={1} fill="none" stroke="#6B422B" strokeWidth={1.2} />
            <rect x={6} y={-22} width={22} height={15} rx={1} fill="none" stroke="#6B422B" strokeWidth={1.2} />
            <circle cx={28} cy={-26} r={2} fill="#F6D889" />
          </g>
        </g>

        {/* Slippers, neatly placed by the door */}
        <g transform="translate(-14 -2)">
          <path d="M -8 2 Q -9 -3 -3 -4 L 3 -4 Q 7 -3 6 2 L 3 4 L -5 4 Z" fill="#B25F4A" opacity={0.9} />
          <path d="M 9 2 Q 8 -3 14 -4 L 20 -4 Q 24 -3 23 2 L 20 4 L 12 4 Z" fill="#B25F4A" opacity={0.9} />
        </g>

        {/* Kettle releasing evening tea steam */}
        <g transform="translate(40 -8)">
          <path className="steam" d="M 0 0 Q -3 -6 0 -12" stroke="#D9C39A" strokeWidth={1.4} fill="none" strokeLinecap="round" />
          <path className="steam" style={{ animationDelay: "1.2s" }} d="M 6 0 Q 9 -6 6 -12" stroke="#D9C39A" strokeWidth={1.4} fill="none" strokeLinecap="round" />
          <path d="M -8 0 C -10 -7 -5 -9 0 -9 C 5 -9 10 -7 8 0 Z" fill="#7E929C" stroke="#5A6A72" strokeWidth={0.8} />
          <path d="M -3 -9 Q 0 -13 3 -9" stroke="#5A6A72" strokeWidth={1} fill="none" />
          <ellipse cx={0} cy={1} rx={12} ry={2.6} fill="#5A6A72" opacity={0.5} />
        </g>

        {/* Wind chimes under the eave */}
        <g transform="translate(28 -84)">
          <line x1={0} y1={0} x2={0} y2={16} stroke="#8A6740" strokeWidth={1.6} />
          <g className="chime">
            <line x1={-6} y1={16} x2={6} y2={16} stroke="#8A6740" strokeWidth={2} />
            <line x1={-4} y1={16} x2={-5} y2={38} stroke="#B99B72" strokeWidth={1.4} />
            <line x1={0} y1={16} x2={0} y2={41} stroke="#B99B72" strokeWidth={1.4} />
            <line x1={4} y1={16} x2={5} y2={38} stroke="#B99B72" strokeWidth={1.4} />
            <rect x={-6} y={36} width={5} height={7} rx={2} fill="#C9A87E" />
            <rect x={-1.5} y={39} width={5} height={7} rx={2} fill="#C9A87E" />
            <rect x={3} y={36} width={5} height={7} rx={2} fill="#C9A87E" />
          </g>
        </g>

        {/* Lanterns flanking the door */}
        <g transform="translate(-58 -56)">
          <line x1={0} y1={0} x2={0} y2={12} stroke="#6B4C2E" strokeWidth={1.4} />
          <circle className="glow-breathe" cx={0} cy={20} r={16} fill="#F6D889" opacity={0.5} />
          <path d="M -6 14 L 6 14 L 4.5 24 L -4.5 24 Z" fill="#F6D889" stroke="#C9A86B" strokeWidth={0.8} opacity={0.95} />
          <rect x={-3} y={10} width={6} height={2.4} rx={1.2} fill="#8A5A38" />
        </g>
        <g transform="translate(58 -56)">
          <line x1={0} y1={0} x2={0} y2={12} stroke="#6B4C2E" strokeWidth={1.4} />
          <circle className="glow-breathe" cx={0} cy={20} r={16} fill="#F6D889" opacity={0.5} />
          <path d="M -6 14 L 6 14 L 4.5 24 L -4.5 24 Z" fill="#F6D889" stroke="#C9A86B" strokeWidth={0.8} opacity={0.95} />
          <rect x={-3} y={10} width={6} height={2.4} rx={1.2} fill="#8A5A38" />
        </g>
      </g>

      {/* ---- Flowering plant by the door — the butterfly's final home ---- */}
      <g transform="translate(572 606)" aria-hidden="true">
        <path d="M -10 0 L 10 0 L 8 12 L -8 12 Z" fill="#B25F4A" stroke="#96452F" strokeWidth={1} />
        <path d="M -8 -2 Q 0 -12 6 -2" stroke="#5F7A4A" strokeWidth={2} fill="none" />
        <PinkFlower x={-4} y={-14} s={1.1} />
        <PinkFlower x={6} y={-10} s={0.9} />
        <Daisy x={1} y={-4} s={0.8} />
      </g>

      {/* ---- Sleeping cat near the entrance ---- */}
      <g transform="translate(748 614)" aria-hidden="true">
        <g className="cat-sleep">
          <ellipse cx={0} cy={4} rx={15} ry={9} fill="#B98B62" />
          <circle cx={12} cy={-1} r={7.5} fill="#B98B62" />
          <polygon points="9,-7 11,-12 13,-6" fill="#B98B62" />
          <path d="M -14 2 Q -20 -2 -18 -9" stroke="#B98B62" strokeWidth={3.2} fill="none" strokeLinecap="round" />
          <path d="M -15 0 Q -20 -6 -19 -10" stroke="#A8784E" strokeWidth={2.4} fill="none" strokeLinecap="round" />
          <path d="M 9 1 Q 11 3 14 2" stroke="#8A5A38" strokeWidth={0.8} fill="none" opacity={0.6} />
        </g>
      </g>

      {/* ---- Stone path from the viewer up to the door ---- */}
      <path
        d="M 600 900 Q 640 800 634 660 Q 632 630 612 610"
        stroke="#CBB794"
        strokeWidth={54}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 600 900 Q 640 800 634 660 Q 632 630 612 610"
        stroke="#E2D2AE"
        strokeWidth={42}
        fill="none"
        strokeLinecap="round"
      />
      {[
        [598, 840, 5],
        [622, 772, -4],
        [632, 706, 3],
        [622, 640, -3],
      ].map(([x, y, r]) => (
        <ellipse key={x} cx={x} cy={y} rx={15} ry={5.5} fill="#F4E8CF" opacity={0.75} transform={`rotate(${r} ${x} ${y})`} />
      ))}

      {/* ---- The welcoming resident — steps out once the door opens ----
           A single transparent cut-out (girl + her wooden Welcome board) so the
           two can never drift apart. She stands BESIDE the doorway, just to the
           right of the entrance: her board clears the door frame (x ≥ 637 vs the
           door's 602–636), her head clears the right window sill, wind chimes and
           eave, and her shoes rest on the lawn just in front of the stone base.
           preserveAspectRatio="meet" is SVG's object-fit: contain — the aspect
           ratio is kept and nothing is ever stretched or cropped, while scene
           coordinates keep her locked to the cottage at every viewport. */}
      {/* Hidden from first paint so she can never flash into view before the
          welcome plays; the welcome timeline (or settleWelcome for reduced
          motion) reveals her, and GSAP's inline style overrides this. */}
      <g ref={girlRef} aria-hidden="true" style={{ opacity: 0 }}>
        <ellipse cx={663} cy={614} rx={23} ry={4} fill="#5C4632" opacity={0.16} />
        <image
          href="/images/senjun-welcome-girl.png"
          x={637}
          y={566}
          width={53.3}
          height={50}
          preserveAspectRatio="xMidYMid meet"
        />
      </g>

      {/* ---- Bench under the tree ---- */}
      <g transform="translate(430 720)" aria-hidden="true">
        <rect x={-30} y={-16} width={60} height={4.5} rx={2.2} fill="#B9855A" />
        <rect x={-30} y={-24} width={60} height={4.5} rx={2.2} fill="#A9714F" />
        <rect x={-28} y={-12} width={5} height={12} rx={2} fill="#8A5A38" />
        <rect x={23} y={-12} width={5} height={12} rx={2} fill="#8A5A38" />
      </g>

      {/* ---- Small garden patch (left) ---- */}
      <g aria-hidden="true">
        <path d="M 330 760 Q 380 742 430 744 Q 466 748 468 768 Q 400 782 340 776 Z" fill="#6E5A3E" opacity={0.55} />
        <Daisy x={352} y={754} s={0.85} />
        <Daisy x={412} y={756} s={0.8} />
        <PinkFlower x={382} y={746} s={0.9} />
        <Lavender x={342} y={746} s={0.85} />
        <Lavender x={442} y={748} s={0.75} />
        <GrassTuft x={400} y={772} s={0.9} />
      </g>

      {/* ---- Bird bath (right) ---- */}
      <g transform="translate(858 700)" aria-hidden="true">
        <rect x={-2} y={-2} width={4} height={16} rx={2} fill="#A9A294" />
        <ellipse cx={0} cy={-6} rx={13} ry={4} fill="#C4BFAE" stroke="#A9A294" strokeWidth={1} />
        <path d="M -9 -8 Q -11 -14 -6 -16" className="mini-butterfly-wing" stroke="#9FB89A" strokeWidth={1.6} fill="none" opacity={0.8} />
      </g>

      {/* ---- Distant birds ---- */}
      <g data-ambient="bird4" transform="translate(0 230)" opacity={0.5}>
        <g fill="none" stroke="#9A6E5C" strokeWidth={1.5} strokeLinecap="round">
          <path d="M 0 0 Q 5 -5 10 0 Q 15 -5 20 0" />
        </g>
      </g>
      <g data-ambient="bird4" transform="translate(0 280)" opacity={0.42}>
        <g fill="none" stroke="#9A6E5C" strokeWidth={1.3} strokeLinecap="round">
          <path d="M 0 0 Q 4 -4 8 0 Q 12 -4 16 0" />
        </g>
      </g>

      {/* ---- Flora around the path ---- */}
      <Daisy x={540} y={700} s={0.85} />
      <Daisy x={700} y={676} s={0.9} />
      <Daisy x={320} y={700} s={0.9} />
      <PinkFlower x={660} y={700} s={0.85} />
      <PinkFlower x={500} y={660} s={0.9} />
      <Lavender x={770} y={700} s={0.85} />
      <Lavender x={470} y={730} s={0.8} />
      <GrassTuft x={580} y={660} s={0.9} />
      <GrassTuft x={720} y={730} s={0.85} />

    </svg>
  );
};

export default HomeScene;
