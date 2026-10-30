"use client";

/**
 * Ambient sound — synthesized in the browser with the Web Audio API.
 * No audio assets required. Muted by default; the visitor opts in via the
 * floating "Ambient sound" toggle. Everything is kept extremely soft:
 * filtered brown-noise "wind" + occasional tiny bird chirps.
 */

type WindowWithWebkit = Window & { webkitAudioContext?: typeof AudioContext };

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let windGain: GainNode | null = null;
let windSrc: AudioBufferSourceNode | null = null;
let windLfo: OscillatorNode | null = null;
let birdTimer: number | null = null;
let enabled = false;
const listeners = new Set<(on: boolean) => void>();

function ensure(): boolean {
  if (typeof window === "undefined") return false;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as WindowWithWebkit).webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return true;
}

function startWind() {
  if (!ctx || !master) return;
  const length = Math.floor(2 * ctx.sampleRate);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02; // brown-ish noise
    data[i] = last * 3.4;
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 460;

  windGain = ctx.createGain();
  windGain.gain.value = 0;
  windSrc = src;

  src.connect(filter);
  filter.connect(windGain);
  windGain.connect(master);
  src.start();

  const now = ctx.currentTime;
  windGain.gain.linearRampToValueAtTime(0.09, now + 5);

  // Slow swell so it never feels mechanical
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.06;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.028;
  lfo.connect(lfoGain);
  lfoGain.connect(windGain.gain);
  lfo.start();
  windLfo = lfo;
}

function chirp() {
  if (!ctx || !master || ctx.state !== "running") return;
  const t = ctx.currentTime;
  const notes = [2600, 3150, 2750, 3400];
  notes.forEach((freq, i) => {
    const start = t + i * 0.085;
    const osc = ctx!.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq * (0.92 + Math.random() * 0.16), start);
    osc.frequency.linearRampToValueAtTime(freq * 1.25, start + 0.045);
    const g = ctx!.createGain();
    g.gain.setValueAtTime(0.0001, start);
    g.gain.linearRampToValueAtTime(0.014, start + 0.022);
    g.gain.exponentialRampToValueAtTime(0.0001, start + 0.1);
    osc.connect(g);
    g.connect(master!);
    osc.start(start);
    osc.stop(start + 0.13);
  });
}

function scheduleBirds() {
  birdTimer = window.setInterval(() => {
    if (Math.random() < 0.85) chirp();
  }, 9000);
}

function stopAll() {
  if (birdTimer) {
    window.clearInterval(birdTimer);
    birdTimer = null;
  }
  if (ctx && windGain) {
    windGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    try {
      windSrc?.stop(ctx.currentTime + 0.9);
      windLfo?.stop(ctx.currentTime + 0.9);
    } catch {
      /* already stopped */
    }
    windSrc = null;
    windLfo = null;
  }
}

function emit() {
  listeners.forEach((cb) => cb(enabled));
}

export const ambientSound = {
  get enabled() {
    return enabled;
  },
  subscribe(cb: (on: boolean) => void) {
    listeners.add(cb);
    cb(enabled);
    return () => {
      listeners.delete(cb);
    };
  },
  async toggle(): Promise<boolean> {
    if (!ensure()) return enabled;
    if (enabled) {
      stopAll();
      enabled = false;
    } else {
      enabled = true;
      startWind();
      scheduleBirds();
    }
    emit();
    return enabled;
  },
};
