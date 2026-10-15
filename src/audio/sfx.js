import { THEMES } from '../themes/catalog.js';
import { rand } from '../core/util.js';
import { KITS } from '../themes/registry.js';
import { BOOM_GROUPS } from './booms.js';

// recorded sounds (made by assets/make-sfx.mjs): a clear burst per material group, the clean-board coins, the score tick
const SAMPLES = Object.fromEntries([...Object.keys(BOOM_GROUPS).map(g => 'boom-' + g), 'coins', 'tick'].map(k => [k, new URL(`../assets/sfx/${k}.ogg`, import.meta.url).href]));

/* ---------- Sound (synthesized, timbre follows the theme) ---------- */
export const Sfx = {
  ctx: null, out: null, send: null, noise: null, muted: false, vol: 1, snd: THEMES[0].snd, samples: {},
  setVol(v) { this.vol = v; if (this.out) this.out.gain.setTargetAtTime(0.7 * v, this.ctx.currentTime, 0.02); },
  unlock() {
    if (this.ctx) { if (this.ctx.state !== 'running' && this.ctx.state !== 'closed') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      try { if (navigator.audioSession) navigator.audioSession.type = 'ambient'; } catch (e) {} // iOS 17+: let the player's music keep playing
      const ctx = new AC();
      try { const b = ctx.createBuffer(1, 1, 22050), s0 = ctx.createBufferSource(); s0.buffer = b; s0.connect(ctx.destination); s0.start(0); } catch (e) {} // iOS: prime the output inside the gesture
      if (ctx.state !== 'running') { try { ctx.resume(); } catch (e) {} }
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14; comp.ratio.value = 4;
      const g = ctx.createGain(); g.gain.value = 0.7 * this.vol;
      g.connect(comp); comp.connect(ctx.destination);
      // echo bus for "wet" themes
      const send = ctx.createGain(), d = ctx.createDelay(1), fb = ctx.createGain(), wet = ctx.createGain(), lp = ctx.createBiquadFilter();
      d.delayTime.value = 0.19; fb.gain.value = 0.33; wet.gain.value = 0.4; lp.type = 'lowpass'; lp.frequency.value = 3200;
      send.connect(d); d.connect(lp); lp.connect(fb); fb.connect(d); lp.connect(wet); wet.connect(g);
      const len = ctx.sampleRate * 0.5;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const dd = buf.getChannelData(0);
      for (let i = 0; i < len; i++) dd[i] = Math.random() * 2 - 1;
      this.ctx = ctx; this.out = g; this.send = send; this.noise = buf;
      this.loadSamples();
    } catch (e) { this.ctx = null; }
  },
  loadSamples() {
    const c = this.ctx;
    for (const [k, url] of Object.entries(SAMPLES)) {
      fetch(url).then(r => r.arrayBuffer())
        .then(b => new Promise((res, rej) => { const p = c.decodeAudioData(b, res, rej); if (p && p.then) p.then(res, rej); })) // old WebViews only take callbacks
        .then(buf => { this.samples[k] = buf; }).catch(() => {});
    }
  },
  // play a loaded sample; false when it is not there yet, so the caller can fall back to the synth
  play(name, { vol = 1, rate = 1, when = 0, wet = false, bright = 0 } = {}) {
    const b = this.samples[name];
    if (!b) return false;
    const c = this.ctx, s = c.createBufferSource(), g = c.createGain();
    s.buffer = b; s.playbackRate.value = rate; g.gain.value = vol;
    if (bright > 0) { // a high shelf (in dB): the same sample, sharper
      const sh = c.createBiquadFilter(); sh.type = 'highshelf'; sh.frequency.value = 2500; sh.gain.value = bright;
      s.connect(sh); sh.connect(g);
    } else s.connect(g);
    g.connect(this.out);
    if (wet && this.snd.echo) g.connect(this.send);
    s.start(c.currentTime + when);
    return true;
  },
  suspend() { if (this.ctx && this.ctx.state === 'running') this.ctx.suspend().catch(() => {}); }, // app in the background: stop the audio clock and any tail still playing
  ok() { return this.ctx && !this.muted; },
  tone(freq, { type = 'sine', dur = 0.15, vol = 0.2, attack = 0.004, to = null, when = 0, detune = 0, wet = false } = {}) {
    const c = this.ctx, t = c.currentTime + when;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
    o.detune.value = detune;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.out);
    if (wet && this.snd.echo) g.connect(this.send);
    o.start(t); o.stop(t + dur + 0.05);
  },
  hiss({ dur = 0.1, vol = 0.1, type = 'lowpass', freq = 1200, to = null, when = 0, q = 0.7 } = {}) {
    const c = this.ctx, t = c.currentTime + when;
    const s = c.createBufferSource(); s.buffer = this.noise;
    const f = c.createBiquadFilter(); f.type = type; f.Q.value = q;
    f.frequency.setValueAtTime(freq, t);
    if (to) f.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(this.out);
    s.start(t); s.stop(t + dur + 0.02);
  },
  // snap a frequency to the nearest note of the theme's pentatonic scale (the one the clear melody walks), in whatever octave it falls;
  // kits run their "scattered" pitches through this so the sparkle around the melody stays in its key
  key(f) {
    const st = 12 * Math.log2(f / this.snd.root), oct = Math.floor(st / 12), w = st - oct * 12;
    let best = 0;
    for (const d of [0, 2, 4, 7, 9, 12]) if (Math.abs(d - w) < Math.abs(best - w)) best = d;
    return this.snd.root * Math.pow(2, oct + best / 12);
  },
  note(f, { vol = 0.15, dur = 0.34, when = 0 } = {}) {
    const s = this.snd, v = vol * (s.gain || 1), d = s.pluck ? dur * 0.55 : dur;
    this.tone(f, { type: s.wave, dur: d, vol: v, when, wet: true, attack: s.pluck ? 0.002 : 0.004 });
    if (s.bell) this.tone(f * 2.76, { type: 'sine', dur: d * 0.6, vol: v * 0.32, when, wet: true });
    else if (s.marimba) this.tone(f * 4, { type: 'sine', dur: 0.07, vol: v * 0.35, when });
    else this.tone(f * 2, { type: 'sine', dur: d * 0.65, vol: v * 0.3, when, detune: 7 });
  },
  // honey: a thick drop landing (rising "blop"), and a low sticky squelch under it
  plop(f, { when = 0, vol = 0.14, dur = 0.08 } = {}) { this.tone(f, { type: 'sine', dur, vol, to: f * 2.3, when, attack: 0.006 }); },
  goo({ when = 0, vol = 0.1, dur = 0.12 } = {}) { this.hiss({ dur, vol, type: 'lowpass', freq: 900, to: 220, when, q: 4 }); },
  pick() {
    if (!this.ok()) return;
    const kit = KITS[this.snd.kit]; if (kit) { kit.pick(); return; }
    this.tone(this.snd.root, { type: 'triangle', dur: 0.07, vol: 0.1, to: this.snd.root * 1.45 });
  },
  place() {
    if (!this.ok()) return;
    const kit = KITS[this.snd.kit]; if (kit) { kit.place(); return; }
    const k = this.snd.root / 523.25;
    this.tone(220 * k, { dur: 0.14, vol: 0.4, to: 90 * k });
    this.hiss({ dur: 0.05, vol: 0.12, type: 'bandpass', freq: 2200, q: 1.2 });
    this.tone(1500, { type: 'triangle', dur: 0.03, vol: 0.04 });
  },
  clear(lines, combo) {
    if (!this.ok()) return;
    const scale = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31];
    const start = Math.min(Math.max(combo, 1) - 1, 7);
    const n = Math.min(lines + 2, 6);
    for (let i = 0; i < n; i++) this.note(this.snd.root * Math.pow(2, scale[start + i] / 12), { when: i * 0.055 });
    this.shimmer(lines, combo);
    const kit = KITS[this.snd.kit]; if (kit) { kit.clear(n, combo); return; }
    this.hiss({ dur: 0.38, vol: 0.06, type: 'highpass', freq: 3000, to: 9000, when: 0.02 });
    this.tone(140, { dur: 0.22, vol: 0.3, to: 60 });
  },
  // the drag would clear lines: a soft glassy chime, one step higher for every extra line
  preview(lines) {
    if (!this.ok()) return;
    const f = this.snd.root * 2 * Math.pow(2, [0, 4, 7, 12][Math.min(lines, 4) - 1] / 12);
    this.tone(f, { type: 'sine', dur: 0.22, vol: 0.05, attack: 0.01, wet: true });
    this.tone(f * 2.76, { type: 'sine', dur: 0.12, vol: 0.018, attack: 0.006, when: 0.01 });
    this.hiss({ dur: 0.16, vol: 0.02, type: 'highpass', freq: 6000, to: 9500 });
  },
  // laid under every clear: the burst of the theme's material group. The bursts have no pitch of their own (the melody and the
  // theme kit carry the notes), so a higher combo makes the burst sharper and a touch louder instead of shifting its pitch;
  // each extra line adds a smaller, slightly darker echo of it
  shimmer(lines, combo) {
    const name = 'boom-' + (this.snd.boom || 'soft'), step = Math.min(Math.max(combo, 1) - 1, 8);
    if (!this.samples[name]) { this.tone(160, { type: 'sine', dur: 0.12, vol: 0.08, to: 90, attack: 0.004 }); return; } // a soft thump until the samples load
    const jit = 1 + (Math.random() - 0.5) * 0.06; // a hair of variation, so repeated clears do not sound stamped
    this.play(name, { vol: 0.36 * (1 + step * 0.025), rate: jit, bright: step * 0.7 });
    for (let i = 1; i < Math.min(lines, 4); i++) this.play(name, { vol: 0.36 * Math.pow(0.6, i), rate: jit * (1 - i * 0.07), when: i * 0.075, bright: step * 0.7 });
  },
  themeChange() {
    if (!this.ok()) return;
    this.hiss({ dur: 0.9, vol: 0.07, type: 'bandpass', freq: 300, to: 7000, q: 0.8 });
    const r = this.snd.root / 2;
    [0, 4, 7, 12, 16, 19].forEach((st, i) => this.note(r * Math.pow(2, st / 12), { when: 0.12 + i * 0.075, vol: 0.12, dur: 0.5 }));
    this.tone(r * 4, { type: 'sine', dur: 0.9, vol: 0.05, when: 0.6, wet: true });
  },
  fullClear() {
    if (!this.ok()) return;
    const r = this.snd.root;
    [0, 4, 7, 12, 16, 19, 24].forEach((st, i) => this.note(r * Math.pow(2, st / 12), { when: 0.25 + i * 0.06, vol: 0.13, dur: 0.45 }));
    [12, 16, 19].forEach(st => this.note(r * Math.pow(2, st / 12), { when: 0.75, vol: 0.09, dur: 0.9 }));
    this.hiss({ dur: 1.1, vol: 0.06, type: 'highpass', freq: 2500, to: 10000, when: 0.25 });
    this.tone(90, { dur: 0.5, vol: 0.35, to: 40, when: 0.2 });
    this.play('coins', { vol: 0.18, when: 0.22, wet: true }); // the gold rain
  },
  // a score spark lands on the counter: a tiny tick, a step higher for each one. The sparks land while the clear melody is still ringing,
  // so the steps climb the theme's own pentatonic scale instead of a chromatic run
  orb(i) {
    if (!this.ok()) return;
    let base = this.snd.root; while (base >= 1760) base /= 2; while (base < 880) base *= 2; // the root, folded into the tick's bright register
    const f = base * Math.pow(2, [0, 2, 4, 7, 9, 12, 14, 16, 19, 21][Math.min(i, 9)] / 12);
    if (!this.play('tick', { vol: 0.07, rate: f / 2093 })) this.tone(f, { dur: 0.06, vol: 0.02 });
  },
  bad() { if (!this.ok()) return; this.tone(160, { type: 'square', dur: 0.09, vol: 0.04, to: 110 }); },
  deal() { if (!this.ok()) return; const kit = KITS[this.snd.kit]; if (kit) { kit.deal(); return; } this.hiss({ dur: 0.2, vol: 0.05, type: 'bandpass', freq: 500, to: 2600, q: 0.9 }); },
  over() { if (!this.ok()) return; [0.75, 0.63, 0.5, 0.375].forEach((k, i) => this.note(this.snd.root * k, { when: i * 0.15, vol: 0.13, dur: 0.4 })); },
  record() { if (!this.ok()) return; [1, 1.26, 1.5, 2].forEach((k, i) => this.note(this.snd.root * k, { when: 0.7 + i * 0.09, vol: 0.12, dur: 0.3 })); },
  // zen: the board breathes out; an airy sweep down, then three soft rising notes
  breath() {
    if (!this.ok()) return;
    this.hiss({ dur: 1.3, vol: 0.05, type: 'bandpass', freq: 2600, to: 380, q: 0.7 });
    const r = this.snd.root / 2;
    [0, 7, 12].forEach((st, i) => this.note(r * Math.pow(2, st / 12), { when: 0.4 + i * 0.18, vol: 0.08, dur: 0.7 }));
  },
  star(n) { if (!this.ok()) return; const up = [1, 1.26, 1.5, 2, 2.52].slice(0, 2 + n); up.forEach((k, i) => this.note(this.snd.root * k, { when: i * 0.07, vol: 0.11, dur: 0.32 })); },
};
// small instruments the theme kits are built from
Object.assign(Sfx, {
  tink(f, { when = 0, vol = 0.1, dur = 0.25 } = {}) { // metal / glass ping with inharmonic partials
    this.tone(f, { type: 'sine', dur, vol, when, attack: 0.002, wet: true });
    this.tone(f * 2.76, { type: 'sine', dur: dur * 0.5, vol: vol * 0.5, when, attack: 0.002 });
    this.tone(f * 5.4, { type: 'sine', dur: dur * 0.3, vol: vol * 0.25, when, attack: 0.002 });
  },
  knock(f, { when = 0, vol = 0.25 } = {}) { // hollow wooden knock
    this.tone(f, { type: 'sine', dur: 0.08, vol, when, to: f * 0.85, attack: 0.002 });
    this.tone(f * 2.3, { type: 'triangle', dur: 0.03, vol: vol * 0.3, when, attack: 0.001 });
    this.hiss({ dur: 0.02, vol: vol * 0.4, type: 'bandpass', freq: f * 3, q: 2, when });
  },
  crunch({ when = 0, vol = 0.12, n = 4 } = {}) { // crisp bite: a few short noise grains
    let t = when;
    for (let i = 0; i < n; i++) { this.hiss({ dur: rand(0.015, 0.045), vol: vol * rand(0.5, 1), type: 'bandpass', freq: rand(1500, 4500), q: 1.5, when: t }); t += rand(0.012, 0.03); }
  },
  pop({ when = 0, vol = 0.2, f = 700 } = {}) {
    this.hiss({ dur: 0.025, vol: vol * 0.8, type: 'highpass', freq: 1500, when });
    this.tone(f, { type: 'sine', dur: 0.06, vol, to: f * 0.3, when, attack: 0.001 });
  },
  squelch({ when = 0, vol = 0.14, dur = 0.18 } = {}) {
    this.hiss({ dur, vol, type: 'bandpass', freq: 250, to: 1400, q: 6, when });
    this.tone(140, { type: 'sine', dur, vol: vol * 1.6, to: 320, when, attack: 0.01 });
  },
  rustle({ when = 0, vol = 0.08, dur = 0.12 } = {}) {
    for (let i = 0; i < 3; i++) this.hiss({ dur: dur * rand(0.4, 0.8), vol: vol * rand(0.6, 1), type: 'bandpass', freq: rand(2500, 5000), q: 0.8, when: when + i * dur * 0.3 });
  },
  blip(f, { to = null, when = 0, vol = 0.08, dur = 0.08 } = {}) { this.tone(f, { type: 'square', dur, vol, to, when, attack: 0.001 }); },
  thud({ when = 0, vol = 0.3, f = 120 } = {}) { this.tone(f, { dur: 0.16, vol, to: f * 0.45, when }); },
});
// per-theme sound kits; each one replaces pick / place / deal and the noise layer of a clear (the melody always plays)

// Longer-lived or filtered sounds some kits need
Object.assign(Sfx, {
  // like hiss(), but the noise loops so a sound can outlast the half-second buffer (thunder, waves)
  hissL({ dur = 1, vol = 0.1, type = 'lowpass', freq = 1200, to = null, when = 0, q = 0.7 } = {}) {
    const c = this.ctx, t = c.currentTime + when;
    const s = c.createBufferSource(); s.buffer = this.noise; s.loop = true;
    const f = c.createBiquadFilter(); f.type = type; f.Q.value = q;
    f.frequency.setValueAtTime(freq, t);
    if (to) f.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + Math.min(0.08, dur * 0.2)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(this.out);
    s.start(t); s.stop(t + dur + 0.02);
  },
  // a sawtooth through a sweeping band-pass: the funk guitar "wah"
  wah(f, { when = 0, vol = 0.05, dur = 0.5 } = {}) {
    const c = this.ctx, t = c.currentTime + when;
    const o = c.createOscillator(), bp = c.createBiquadFilter(), g = c.createGain();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(f, t);
    bp.type = 'bandpass'; bp.Q.value = 6; bp.frequency.setValueAtTime(400, t); bp.frequency.exponentialRampToValueAtTime(2200, t + dur * 0.35); bp.frequency.exponentialRampToValueAtTime(500, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(bp); bp.connect(g); g.connect(this.out);
    o.start(t); o.stop(t + dur + 0.05);
  },
});
