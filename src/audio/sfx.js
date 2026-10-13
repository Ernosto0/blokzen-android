import { THEMES } from '../themes/catalog.js';
import { rand } from '../core/util.js';

/* ---------- Sound (synthesized, timbre follows the theme) ---------- */
export const Sfx = {
  ctx: null, out: null, send: null, noise: null, muted: false, vol: 1, snd: THEMES[0].snd,
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
    } catch (e) { this.ctx = null; }
  },
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
    const kit = KITS[this.snd.kit]; if (kit) { kit.clear(n, combo); return; }
    this.hiss({ dur: 0.38, vol: 0.06, type: 'highpass', freq: 3000, to: 9000, when: 0.02 });
    this.tone(140, { dur: 0.22, vol: 0.3, to: 60 });
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
export const KITS = (S => ({
  honey: {
    pick() { S.plop(330, { vol: 0.09, dur: 0.06 }); },
    place() { S.plop(170, { vol: 0.34, dur: 0.12 }); S.tone(120, { dur: 0.18, vol: 0.28, to: 55 }); S.goo({ vol: 0.12, dur: 0.14, when: 0.01 }); },
    clear(n) {
      S.hiss({ dur: 0.6, vol: 0.09, type: 'lowpass', freq: 1100, to: 260, when: 0.02, q: 3 });
      for (let i = 0; i < n + 1; i++) S.plop(rand(420, 760), { when: 0.08 + i * 0.075 + Math.random() * 0.03, vol: 0.11 });
      S.tone(120, { dur: 0.26, vol: 0.28, to: 50 });
    },
    deal() { S.goo({ vol: 0.07, dur: 0.22 }); },
  },
  gold: {
    pick() { S.tink(2400, { vol: 0.05, dur: 0.12 }); },
    place() { S.thud({ vol: 0.25, f: 150 }); S.tink(rand(1900, 2300), { vol: 0.12 }); S.tink(rand(2600, 3000), { vol: 0.07, when: 0.04 }); },
    clear(n) { for (let i = 0; i < n * 3 + 2; i++) S.tink(rand(1800, 3400), { when: 0.04 + i * 0.045 + Math.random() * 0.02, vol: 0.07, dur: 0.18 }); S.thud({ vol: 0.25, f: 110 }); },
    deal() { S.tink(2600, { vol: 0.04, dur: 0.1 }); S.tink(3100, { vol: 0.03, dur: 0.1, when: 0.05 }); },
  },
  glass: {
    pick() { S.tink(3200, { vol: 0.05, dur: 0.1 }); },
    place() { S.thud({ vol: 0.2, f: 180 }); S.tink(rand(2600, 3200), { vol: 0.1, dur: 0.3 }); },
    clear(n) {
      S.hiss({ dur: 0.35, vol: 0.12, type: 'highpass', freq: 4000, to: 9000 });
      for (let i = 0; i < n * 3 + 3; i++) S.tink(rand(2500, 5200), { when: 0.02 + Math.random() * 0.35, vol: 0.06, dur: 0.15 });
      S.thud({ vol: 0.2, f: 140 });
    },
    deal() { S.tink(4200, { vol: 0.03, dur: 0.2 }); },
  },
  choco: {
    pick() { S.crunch({ vol: 0.05, n: 2 }); },
    place() { S.thud({ vol: 0.3, f: 110 }); S.crunch({ vol: 0.1, n: 3 }); },
    clear(n) {
      for (let i = 0; i < Math.min(n + 1, 4); i++) S.crunch({ when: i * 0.11, vol: 0.13, n: 6 });
      S.hiss({ dur: 0.5, vol: 0.06, type: 'lowpass', freq: 800, to: 300, when: 0.1, q: 2 });
    },
    deal() { S.rustle({ vol: 0.05 }); },
  },
  slime: {
    pick() { S.squelch({ vol: 0.06, dur: 0.1 }); },
    place() { S.squelch({ vol: 0.14, dur: 0.2 }); S.thud({ vol: 0.2, f: 90 }); },
    clear(n) { for (let i = 0; i < n + 1; i++) S.squelch({ when: i * 0.08, vol: 0.12, dur: 0.16 }); S.plop(300, { when: 0.1, vol: 0.1 }); },
    deal() { S.squelch({ vol: 0.05, dur: 0.14 }); },
  },
  wood: {
    pick() { S.knock(900, { vol: 0.08 }); },
    place() { S.knock(rand(520, 620), { vol: 0.3 }); S.thud({ vol: 0.2, f: 130 }); },
    clear(n) { for (let i = 0; i < n + 2; i++) S.knock(500 + i * 90, { when: i * 0.06, vol: 0.18 }); },
    deal() { S.knock(1100, { vol: 0.06 }); S.knock(1300, { vol: 0.05, when: 0.06 }); },
  },
  gum: {
    pick() { S.pop({ vol: 0.06, f: 900 }); },
    place() { S.thud({ vol: 0.22, f: 160 }); S.hiss({ dur: 0.08, vol: 0.08, type: 'lowpass', freq: 900 }); },
    clear(n) { for (let i = 0; i < n + 2; i++) S.pop({ when: 0.04 + i * 0.07, vol: 0.18, f: rand(500, 900) }); },
    deal() { S.hiss({ dur: 0.3, vol: 0.06, type: 'bandpass', freq: 400, to: 1800, q: 2 }); },
  },
  chip: {
    pick() { S.blip(880, { to: 1320, dur: 0.05, vol: 0.05 }); },
    place() { S.blip(330, { to: 110, dur: 0.1, vol: 0.09 }); S.hiss({ dur: 0.04, vol: 0.06, type: 'highpass', freq: 3000 }); },
    clear(n) { S.hiss({ dur: 0.3, vol: 0.1, type: 'lowpass', freq: 3000, to: 200, q: 1 }); S.blip(220, { to: 55, dur: 0.25, vol: 0.08 }); for (let i = 0; i < n; i++) S.blip(1760, { when: 0.3 + i * 0.05, dur: 0.03, vol: 0.04 }); },
    deal() { S.blip(660, { to: 990, dur: 0.06, vol: 0.04 }); },
  },
  crystal: {
    pick() { S.tink(1760, { vol: 0.05, dur: 0.3 }); },
    place() { S.thud({ vol: 0.22, f: 130 }); S.tink(rand(1200, 1600), { vol: 0.1, dur: 0.6 }); },
    clear(n) { for (let i = 0; i < n * 2 + 3; i++) S.tink(rand(2000, 4000), { when: 0.05 + i * 0.05, vol: 0.05, dur: 0.5 }); S.thud({ vol: 0.2, f: 100 }); },
    deal() { S.tink(2350, { vol: 0.035, dur: 0.4 }); },
  },
  cup: {
    pick() { S.tink(1500, { vol: 0.05, dur: 0.12 }); },
    place() { S.thud({ vol: 0.22, f: 140 }); S.tink(rand(1300, 1500), { vol: 0.12, dur: 0.25 }); },
    clear(n) {
      for (let i = 0; i < n + 3; i++) S.tink(i % 2 ? 1900 : 1600, { when: 0.03 + i * 0.07, vol: 0.07, dur: 0.12 });
      S.hiss({ dur: 0.5, vol: 0.07, type: 'lowpass', freq: 1200, to: 400, q: 1, when: 0.05 });
    },
    deal() { S.tink(1700, { vol: 0.04, dur: 0.15 }); },
  },
  spooky: {
    pick() { S.tone(240, { dur: 0.1, vol: 0.06, to: 180 }); },
    place() { S.thud({ vol: 0.32, f: 80 }); S.tone(95, { type: 'sawtooth', dur: 0.14, vol: 0.025, to: 70, when: 0.02 }); },
    clear() {
      S.tone(660, { dur: 0.7, vol: 0.08, to: 392, wet: true, attack: 0.05 });
      S.tone(664, { dur: 0.7, vol: 0.06, to: 396, attack: 0.05 });
      S.hiss({ dur: 0.9, vol: 0.07, type: 'bandpass', freq: 400, to: 900, q: 3 });
      S.thud({ vol: 0.25, f: 70 });
    },
    deal() { S.hiss({ dur: 0.4, vol: 0.05, type: 'bandpass', freq: 500, to: 300, q: 3 }); },
  },
  jingle: {
    pick() { S.tink(2800, { vol: 0.04, dur: 0.1 }); },
    place() { S.thud({ vol: 0.22, f: 150 }); for (let i = 0; i < 4; i++) S.tink(rand(2500, 4200), { when: i * 0.025, vol: 0.04, dur: 0.12 }); },
    clear(n) { for (let i = 0; i < n * 4 + 4; i++) S.tink(rand(2500, 4500), { when: Math.random() * 0.5, vol: 0.04, dur: 0.14 }); },
    deal() { S.tink(3000, { vol: 0.03, dur: 0.1 }); S.tink(3600, { vol: 0.03, dur: 0.1, when: 0.04 }); },
  },
  stone: {
    pick() { S.knock(1400, { vol: 0.05 }); },
    place() { S.knock(rand(380, 450), { vol: 0.3 }); S.hiss({ dur: 0.04, vol: 0.08, type: 'bandpass', freq: 2000, q: 1.5 }); },
    clear(n) { S.hiss({ dur: 0.7, vol: 0.05, type: 'highpass', freq: 6000, to: 10000, when: 0.05 }); for (let i = 0; i < n + 1; i++) S.knock(700 - i * 60, { when: i * 0.07, vol: 0.14 }); },
    deal() { S.knock(1600, { vol: 0.04 }); },
  },
  paper: {
    pick() { S.rustle({ vol: 0.04, dur: 0.06 }); },
    place() { S.rustle({ vol: 0.09 }); S.thud({ vol: 0.12, f: 200 }); },
    clear() { S.hiss({ dur: 0.3, vol: 0.1, type: 'bandpass', freq: 600, to: 4000, q: 1 }); S.rustle({ vol: 0.08, dur: 0.3, when: 0.1 }); },
    deal() { S.rustle({ vol: 0.05, dur: 0.2 }); },
  },
  juicy: {
    pick() { S.plop(400, { vol: 0.06, dur: 0.06 }); },
    place() { S.squelch({ vol: 0.09, dur: 0.12 }); S.crunch({ vol: 0.07, n: 2 }); S.thud({ vol: 0.18, f: 140 }); },
    clear(n) {
      S.crunch({ vol: 0.12, n: 5 });
      S.hiss({ dur: 0.35, vol: 0.09, type: 'lowpass', freq: 2200, to: 500, q: 2, when: 0.05 });
      for (let i = 0; i < n + 1; i++) S.plop(rand(500, 800), { when: 0.12 + i * 0.07, vol: 0.09 });
    },
    deal() { S.plop(520, { vol: 0.05, dur: 0.05 }); },
  },
}))(Sfx);
