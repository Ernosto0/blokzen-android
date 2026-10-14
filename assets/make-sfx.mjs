// Synthesizes the shared clear-sound samples (impact, whoosh, shimmer, chime, coins, tick) and writes them as small
// mono Ogg Vorbis files into src/assets/sfx. The game layers them under every theme's own clear sound.
//   node assets/make-sfx.mjs   (needs ffmpeg with libvorbis; SFX_IMPACT=pop|crystal|wood picks the clear's impact, SFX_OUT another folder)
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SR = 44100, TAU = Math.PI * 2;
let seed = 7;
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const range = (a, b) => a + rnd() * (b - a);
const buf = sec => new Float32Array(Math.ceil(sec * SR));

// a sine (with optional pitch sweep) under an exponential decay, added into out at a start time
function partial(out, { f, to = f, at = 0, dur, amp, attack = 0.002, tau = dur / 4, sweep = dur }) {
  const i0 = Math.floor(at * SR), n = Math.min(Math.ceil(dur * SR), out.length - i0);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR, fr = t < sweep ? f * Math.pow(to / f, t / sweep) : to;
    ph += TAU * fr / SR;
    const env = (t < attack ? t / attack : 1) * Math.exp(-(t - Math.min(t, attack)) / tau);
    out[i0 + i] += Math.sin(ph) * env * amp;
  }
}
// white noise through a resonant band-pass whose centre sweeps from f0 to f1, shaped by env(t)
function noiseBand(out, { at = 0, dur, f0, f1, q = 1, amp, env }) {
  const i0 = Math.floor(at * SR), n = Math.min(Math.ceil(dur * SR), out.length - i0);
  let lp = 0, bp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR, fc = f0 * Math.pow(f1 / f0, t / dur), F = 2 * Math.sin(Math.PI * Math.min(fc, SR / 6) / SR);
    const x = rnd() * 2 - 1, hp = x - lp - bp / q; bp += F * hp; lp += F * bp; // state-variable filter
    out[i0 + i] += bp * env(t / dur) * amp;
  }
}
// a small Schroeder reverb: four combs in parallel, two all-passes in series
function reverb(x, wet = 0.3, size = 1) {
  const y = new Float32Array(x.length);
  for (const [d, g] of [[1557, 0.8], [1617, 0.79], [1491, 0.81], [1422, 0.78]]) {
    const L = Math.round(d * size), b = new Float32Array(L); let k = 0;
    for (let i = 0; i < x.length; i++) { const o = b[k]; b[k] = x[i] + o * g; y[i] += o / 4; k = (k + 1) % L; }
  }
  for (const [d, g] of [[225, 0.5], [556, 0.5]]) {
    const b = new Float32Array(d); let k = 0;
    for (let i = 0; i < y.length; i++) { const o = b[k], v = y[i] + o * g; b[k] = v; y[i] = o - v * g; k = (k + 1) % d; }
  }
  return x.map((v, i) => v * (1 - wet) + y[i] * wet);
}
function finish(x, peak = 0.89, fadeMs = 30) {
  const n = Math.round(fadeMs / 1000 * SR);
  for (let i = 0; i < n; i++) x[x.length - 1 - i] *= i / n; // no click at the end
  let m = 0; for (const v of x) m = Math.max(m, Math.abs(v));
  return x.map(v => v / (m || 1) * peak);
}

const S = {};
// the layer under every clear. Three softer takes; SFX_IMPACT picks which one is written as impact.ogg (pop by default)
const IMPACTS = {
  pop() { // a round bubble pop: a short rising sine with a soft low body under it
    const x = buf(0.3);
    partial(x, { f: 420, to: 760, dur: 0.3, amp: 1, attack: 0.003, tau: 0.045, sweep: 0.05 });
    partial(x, { f: 840, to: 1300, dur: 0.15, amp: 0.25, attack: 0.002, tau: 0.025, sweep: 0.04 });
    partial(x, { f: 170, to: 120, dur: 0.25, amp: 0.45, attack: 0.006, tau: 0.06 });
    return finish(x, 0.85, 15);
  },
  crystal() { // a light glassy crunch: a few bright pings close together, a little air
    const x = buf(0.45);
    for (let i = 0; i < 5; i++) { const at = i * 0.012 + rnd() * 0.01, f = range(1800, 3200); partial(x, { f, at, dur: 0.35, amp: 0.5, attack: 0.001, tau: range(0.05, 0.1) }); partial(x, { f: f * 2.76, at, dur: 0.15, amp: 0.15, attack: 0.001, tau: 0.03 }); }
    noiseBand(x, { dur: 0.08, f0: 6000, f1: 3500, q: 1, amp: 0.25, env: u => Math.exp(-u * 5) });
    return finish(reverb(x, 0.2), 0.8, 20);
  },
  wood() { // a soft wooden thock, like a block set down on a felt table
    const x = buf(0.3);
    partial(x, { f: 520, to: 430, dur: 0.3, amp: 1, attack: 0.002, tau: 0.035 });
    partial(x, { f: 1270, dur: 0.12, amp: 0.3, attack: 0.001, tau: 0.015 });
    partial(x, { f: 210, dur: 0.2, amp: 0.4, attack: 0.004, tau: 0.04 });
    noiseBand(x, { dur: 0.03, f0: 2500, f1: 1500, q: 1.5, amp: 0.2, env: u => 1 - u });
    return finish(x, 0.85, 15);
  },
};
S.impact = IMPACTS[process.env.SFX_IMPACT || 'pop']();
S.whoosh = (() => { // air rushing past: a band of noise sweeping up, swelling then gone
  const x = buf(0.55);
  noiseBand(x, { dur: 0.55, f0: 380, f1: 4200, q: 1.6, amp: 1, env: u => Math.sin(Math.PI * Math.pow(u, 0.6)) ** 2 });
  noiseBand(x, { dur: 0.55, f0: 900, f1: 7000, q: 3, amp: 0.4, env: u => Math.sin(Math.PI * u) ** 3 });
  return finish(x);
})();
S.shimmer = (() => { // a sparkling tail: glassy pings scattered over a second, thinning out, in a small room
  const x = buf(1.3);
  for (let i = 0; i < 34; i++) {
    const at = Math.pow(rnd(), 1.7) * 0.85, f = range(2400, 6800), a = 0.5 * (1 - at / 1.1) * range(0.5, 1);
    partial(x, { f, at, dur: 0.35, amp: a, attack: 0.002, tau: range(0.04, 0.12) });
    partial(x, { f: f * 2.76, at, dur: 0.2, amp: a * 0.3, attack: 0.001, tau: 0.03 });
  }
  noiseBand(x, { dur: 0.9, f0: 7000, f1: 11000, q: 0.7, amp: 0.08, env: u => Math.exp(-u * 4) });
  return finish(reverb(x, 0.35));
})();
S.chime = (() => { // a bright bell arpeggio (C, E, G, C) for big combos
  const x = buf(1.4);
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
    const at = i * 0.07;
    partial(x, { f: f * 2, at, dur: 1.2, amp: 0.6, attack: 0.002, tau: 0.32 });
    partial(x, { f: f * 2 * 2.76, at, dur: 0.6, amp: 0.22, attack: 0.001, tau: 0.09 });
    partial(x, { f: f * 2 * 5.4, at, dur: 0.3, amp: 0.08, attack: 0.001, tau: 0.04 });
  });
  return finish(reverb(x, 0.3));
})();
S.coins = (() => { // a shower of coins for a clean board: metallic clinks with inharmonic partials
  const x = buf(1.8);
  for (let i = 0; i < 26; i++) {
    const at = Math.pow(rnd(), 1.3) * 1.3, f = range(1700, 3300), a = range(0.4, 1) * (1 - at / 1.8);
    for (const [m, g, tau] of [[1, 1, 0.16], [2.32, 0.5, 0.09], [4.25, 0.3, 0.05], [6.63, 0.15, 0.03]]) partial(x, { f: f * m, at, dur: 0.4, amp: a * g * 0.4, attack: 0.001, tau: tau * range(0.7, 1.3) });
    noiseBand(x, { at, dur: 0.02, f0: 6000, f1: 4000, q: 1, amp: a * 0.3, env: u => 1 - u });
  }
  return finish(reverb(x, 0.25));
})();
S.tick = (() => { // a tiny glass tick: a score spark landing on the counter
  const x = buf(0.18);
  partial(x, { f: 2093, dur: 0.18, amp: 1, attack: 0.001, tau: 0.035 });
  partial(x, { f: 2093 * 2.76, dur: 0.1, amp: 0.35, attack: 0.001, tau: 0.015 });
  return finish(x, 0.8, 10);
})();

function wav(x) {
  const b = Buffer.alloc(44 + x.length * 2);
  b.write('RIFF', 0); b.writeUInt32LE(36 + x.length * 2, 4); b.write('WAVEfmt ', 8); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(x.length * 2, 40);
  x.forEach((v, i) => b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v)) * 32767), 44 + i * 2));
  return b;
}
const out = process.env.SFX_OUT || new URL('../src/assets/sfx/', import.meta.url).pathname, tmp = join(tmpdir(), 'blokzen-sfx');
mkdirSync(out, { recursive: true }); mkdirSync(tmp, { recursive: true });
for (const [name, x] of Object.entries(S)) {
  const w = join(tmp, name + '.wav');
  writeFileSync(w, wav(x));
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', w, '-c:a', 'libvorbis', '-q:a', '5', join(out, name + '.ogg')]);
  console.log(name, (x.length / SR).toFixed(2) + 's');
}
rmSync(tmp, { recursive: true, force: true });
