// Synthesizes the clear sounds and writes them as small mono Ogg Vorbis files into src/assets/sfx:
//   boom-<group>  the burst of a clear, one per material group (src/audio/booms.js says which theme uses which)
//   coins         the shower of coins on a clean board
//   tick          a score spark landing on the counter
//   node assets/make-sfx.mjs   (needs ffmpeg with libvorbis; SFX_OUT writes them to another folder)
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
// a struck object: a few modes (frequency ratio, decay, level) ringing together, plus a click
function modal(out, { f, at = 0, modes, amp = 1, dur = 0.6 }) {
  for (const [r, tau, g] of modes) partial(out, { f: f * r, at, dur, amp: amp * g, attack: 0.001, tau });
}
// one short burst of noise through a band-pass at f, quick attack, exponential decay
function tick(out, { at = 0, f, q = 2, amp, tau = 0.01 }) {
  noiseBand(out, { at, dur: tau * 6, f0: f, f1: f, q, amp, env: u => Math.min(1, u * 40) * Math.exp(-u * 6) });
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
// the booms are levelled by loudness over their first 150 ms (the hit), not by their peak, so no group jumps out
function level(x, target = 0.16) {
  const n = Math.min(x.length, Math.round(0.15 * SR));
  let e = 0; for (let i = 0; i < n; i++) e += x[i] * x[i];
  const k = target / (Math.sqrt(e / n) || 1);
  let m = 0; for (const v of x) m = Math.max(m, Math.abs(v * k));
  return finish(x.map(v => v * k * Math.min(1, 0.95 / m)), Math.min(0.95, m), 25);
}
const S = {};
const BOOMS = {
  wood() { // wooden blocks knocked loose: one hollow knock, then a few smaller ones tumbling
    const x = buf(0.5), W = [[1, 0.09, 1], [2.71, 0.035, 0.45], [4.95, 0.018, 0.2]];
    modal(x, { f: 330, modes: W });
    tick(x, { f: 2400, q: 1.5, amp: 0.5, tau: 0.004 });
    [0.045, 0.085, 0.13, 0.19].forEach((at, i) => { modal(x, { at, f: range(480, 820), modes: W, amp: 0.55 - i * 0.1 }); tick(x, { at, f: 2800, amp: 0.25 - i * 0.04, tau: 0.003 }); });
    return level(reverb(x, 0.08, 0.6));
  },
  glass() { // a pane breaking: a bright crack, a burst of shards, a few tinkles after
    const x = buf(0.8);
    noiseBand(x, { dur: 0.06, f0: 6500, f1: 4000, q: 0.7, amp: 0.7, env: u => Math.exp(-u * 5) });
    for (let i = 0; i < 26; i++) {
      const at = Math.pow(rnd(), 2.2) * 0.5, f = range(2600, 7200), a = 0.5 * (1 - at * 1.4) * range(0.4, 1);
      partial(x, { f, at, dur: 0.3, amp: a, attack: 0.001, tau: range(0.03, 0.09) });
      partial(x, { f: f * 2.76, at, dur: 0.12, amp: a * 0.3, attack: 0.001, tau: 0.02 });
    }
    return level(reverb(x, 0.22), 0.12);
  },
  stone() { // a stone block cracking apart: a low thud, a gritty crunch and pebbles skittering off
    const x = buf(0.5);
    partial(x, { f: 130, to: 70, dur: 0.3, amp: 0.8, attack: 0.002, tau: 0.06, sweep: 0.12 });
    noiseBand(x, { dur: 0.2, f0: 900, f1: 450, q: 1, amp: 0.8, env: u => Math.min(1, u * 80) * Math.exp(-u * 6) });
    for (let i = 0; i < 9; i++) { const at = 0.03 + Math.pow(rnd(), 1.5) * 0.3; tick(x, { at, f: range(1400, 3600), q: 3, amp: 0.45 * (1 - at * 2), tau: 0.005 }); modal(x, { at, f: range(900, 1700), modes: [[1, 0.012, 0.3]] }); }
    return level(reverb(x, 0.06, 0.5));
  },
  metal() { // a struck metal plate: a clang with a slow beat in it, and a couple of bolts bouncing off
    const x = buf(0.9), M = [[1, 0.3, 1], [2.76, 0.18, 0.5], [5.4, 0.09, 0.28], [8.93, 0.05, 0.14]];
    modal(x, { f: 520, modes: M, dur: 0.9 }); modal(x, { f: 523.5, modes: M, amp: 0.6, dur: 0.9 });
    tick(x, { f: 5000, q: 1, amp: 0.4, tau: 0.003 });
    [0.12, 0.2, 0.26].forEach((at, i) => modal(x, { at, f: range(1800, 2800), modes: [[1, 0.06, 0.3 - i * 0.07], [2.4, 0.03, 0.1]] }));
    return level(reverb(x, 0.15), 0.13);
  },
  paper() { // paper crumpled and torn: a quick rip, then a crackle of folds
    const x = buf(0.45);
    noiseBand(x, { dur: 0.1, f0: 900, f1: 3800, q: 2, amp: 0.6, env: u => Math.sin(Math.PI * u) });
    for (let i = 0; i < 18; i++) { const at = 0.04 + rnd() * 0.26; tick(x, { at, f: range(1500, 5500), q: 1.4, amp: range(0.2, 0.6) * (1 - at * 2), tau: range(0.004, 0.012) }); }
    return level(x, 0.13);
  },
  soft() { // a cushion puffing out: an airy poof with a soft round body, nothing hard
    const x = buf(0.45);
    noiseBand(x, { dur: 0.36, f0: 1100, f1: 220, q: 0.5, amp: 1, env: u => Math.min(1, u * 30) * Math.exp(-u * 5) });
    partial(x, { f: 200, to: 130, dur: 0.25, amp: 0.45, attack: 0.012, tau: 0.07 });
    return level(x, 0.15);
  },
  water() { // a splash: a burst of bubbles bloop up through a short wash
    const x = buf(0.5);
    noiseBand(x, { dur: 0.22, f0: 1800, f1: 500, q: 0.6, amp: 0.45, env: u => Math.min(1, u * 60) * Math.exp(-u * 6) });
    for (let i = 0; i < 6; i++) { const at = Math.pow(rnd(), 1.4) * 0.2, f = range(320, 760); partial(x, { f, to: f * 2.4, at, dur: 0.12, amp: 0.6 * (1 - at * 2), attack: 0.004, tau: 0.03, sweep: 0.05 }); }
    return level(reverb(x, 0.1, 0.7));
  },
  electro() { // an arcade explosion: crushed noise falling in pitch and a square blip diving under it
    const x = buf(0.45);
    let hold = 0, v = 0;
    for (let i = 0; i < x.length; i++) { const t = i / SR, step = Math.round(2 + t * 90); if (hold-- <= 0) { v = rnd() * 2 - 1; hold = step; } x[i] += Math.round(v * 4) / 4 * Math.exp(-t / 0.11) * 0.7; }
    for (let i = 0; i < Math.round(0.16 * SR); i++) { const t = i / SR, f = 880 * Math.pow(110 / 880, t / 0.16); x[i] += (Math.sin(TAU * f * t * 0.5) > 0 ? 0.3 : -0.3) * Math.exp(-t / 0.08); }
    return level(x, 0.14);
  },
  magic() { // a spell going off: an airy rush and a quick spray of bell notes, rising
    const x = buf(0.9), P = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];
    noiseBand(x, { dur: 0.3, f0: 1500, f1: 6500, q: 0.8, amp: 0.35, env: u => Math.sin(Math.PI * u) });
    P.forEach((st, i) => { const f = 1046.5 * Math.pow(2, st / 12), at = i * 0.022 + rnd() * 0.01; partial(x, { f, at, dur: 0.5, amp: 0.35 * (1 - i * 0.05), attack: 0.002, tau: 0.13 }); partial(x, { f: f * 2.76, at, dur: 0.2, amp: 0.08, attack: 0.001, tau: 0.04 }); });
    return level(reverb(x, 0.3), 0.12);
  },
  drum() { // a hand drum: a slap on the rim, then a deep tom
    const x = buf(0.55);
    tick(x, { f: 950, q: 1.2, amp: 0.8, tau: 0.008 }); partial(x, { f: 330, dur: 0.1, amp: 0.4, attack: 0.001, tau: 0.025 });
    partial(x, { f: 150, to: 82, at: 0.06, dur: 0.45, amp: 1, attack: 0.002, tau: 0.13, sweep: 0.15 });
    tick(x, { at: 0.06, f: 420, q: 1, amp: 0.45, tau: 0.01 });
    return level(reverb(x, 0.1, 0.6));
  },
};
Object.entries(BOOMS).forEach(([name, make], i) => { seed = 201 + i; S['boom-' + name] = make(); }); // each sound has its own seed, so changing one leaves the others as they are
seed = 105;
S.coins = (() => { // a shower of coins for a clean board: metallic clinks with inharmonic partials
  const x = buf(1.8);
  for (let i = 0; i < 26; i++) {
    const at = Math.pow(rnd(), 1.3) * 1.3, f = range(1700, 3300), a = range(0.4, 1) * (1 - at / 1.8);
    for (const [m, g, tau] of [[1, 1, 0.16], [2.32, 0.5, 0.09], [4.25, 0.3, 0.05], [6.63, 0.15, 0.03]]) partial(x, { f: f * m, at, dur: 0.4, amp: a * g * 0.4, attack: 0.001, tau: tau * range(0.7, 1.3) });
    noiseBand(x, { at, dur: 0.02, f0: 6000, f1: 4000, q: 1, amp: a * 0.3, env: u => 1 - u });
  }
  return finish(reverb(x, 0.25));
})();
seed = 106;
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
