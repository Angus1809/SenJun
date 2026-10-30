"use client";

import { useEffect, useState } from "react";
import { ambientSound } from "@/lib/ambient-sound";

/**
 * Floating toggle for ambient garden sounds (birds + wind).
 * Muted by default — the visitor opts in.
 */
export default function SoundToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const unsub = ambientSound.subscribe(setOn);
    return unsub;
  }, []);

  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? "Mute ambient sounds" : "Enable ambient sounds"}
      onClick={() => void ambientSound.toggle()}
      className="absolute bottom-5 left-5 z-30 flex items-center gap-2.5 rounded-full border border-deep/10 bg-cream/70 px-4 py-2 text-xs font-semibold tracking-wide text-deep/70 backdrop-blur-sm transition-all duration-300 hover:border-leaf/50 hover:text-deep sm:bottom-7"
    >
      <span aria-hidden="true" className="relative flex h-3.5 w-4 items-center">
        <span className="block h-3.5 w-0.5 rounded-full bg-current" />
        <span
          className="block h-2.5 w-0.5 -translate-x-px rounded-full bg-current transition-transform duration-500"
          style={on ? { transform: "rotate(-16deg) translateX(2px)" } : undefined}
        />
        <span
          className="block h-2 w-0.5 -translate-x-px rounded-full bg-current transition-transform duration-500"
          style={on ? { transform: "rotate(-30deg) translateX(5px)" } : undefined}
        />
      </span>
      <span className="hidden sm:inline">Ambient sound</span>
      <span className="sm:hidden">{on ? "On" : "Off"}</span>
    </button>
  );
}
