import { milestone, THEMES } from './catalog.js';
import { mode } from '../modes/registry.js';
import { mixHex } from '../core/color.js';
import { THEME_KEY } from '../core/constants.js';
import { Sfx } from '../audio/sfx.js';
import { buzz } from '../platform/haptics.js';
import { setBarsLight } from '../platform/systembars.js';
import { store } from '../core/store.js';
import { $, elScore, metaTheme } from '../ui/dom.js';
import { state, discovered, earned, fresh, settings, theme, THEME_DUR } from '../core/state.js';
import { FINALES, META_V, TH } from './progress.js';
import { clamp01, inOut, rand } from '../core/util.js';
import { L } from '../render/layout.js';
import { fxParticle } from '../render/render.js';
import { AMBIENTS } from './registry.js';
import { t } from '../i18n/index.js';

/* ---------- Theme switching ---------- */
export function applyDomColors(now) {
  const m = clamp01((now - theme.t0) / THEME_DUR);
  if (m >= 1 && theme.domDone) return;
  const a = THEMES[theme.prev], b = TH(), e = inOut(m), st = document.documentElement.style;
  const mixK = k => (a[k].startsWith('#') && b[k].startsWith('#')) ? mixHex(a[k], b[k], e) : (e < 0.5 ? a[k] : b[k]);
  for (const k of ['bg', 'board', 'fg', 'muted', 'accent', 'ink', 'btn']) st.setProperty('--' + k, mixK(k));
  st.setProperty('--surface', e < 0.5 ? a.surface : b.surface);
  st.colorScheme = b.light ? 'light' : 'dark';
  setBarsLight(!!b.light);
  metaTheme.content = mixK('bg');
  theme.domDone = m >= 1;
}
export function setTheme(i, now, { show = true, sound = true, unlocked = false, finale = false } = {}) {
  if (i === theme.cur && now - theme.t0 >= THEME_DUR && !unlocked) return;
  theme.prev = theme.cur; theme.cur = i; theme.t0 = now; theme.domDone = false; theme.prevMode = theme.mode;
  state.ambPrev = state.ambCur; state.ambCur = AMBIENTS[THEMES[i].amb](THEMES[i]);
  Sfx.snd = THEMES[i].snd;
  if (show) {
    state.banner = { name: t(THEMES[i].name), sub: finale ? t(FINALES[THEMES[i].id] || 'KOLEKSİYON FİNALİ') : unlocked ? t('YENİ TEMA AÇILDI') : t('TEMA'), t0: now + 120, dur: finale ? 3600 : unlocked ? 2300 : 1900 };
    burst(now);
  }
  if (sound) { Sfx.themeChange(); buzz([12, 50, 12]); }
  updateRing();
}
export function snapTheme(i) { // instant, no animation
  theme.prev = theme.cur = i; theme.t0 = -1e9; theme.domDone = false; theme.prevMode = theme.mode;
  state.ambCur = AMBIENTS[THEMES[i].amb](THEMES[i]); state.ambPrev = null;
  Sfx.snd = THEMES[i].snd;
}
export function burst(now) {
  if (state.REDUCED) return;
  const th = TH(), cx = L.bx + L.B / 2, cy = L.by + L.B / 2;
  for (let i = 0; i < 36; i++) {
    const ang = Math.random() * Math.PI * 2, v = rand(0.8, 2.2) * L.cell * 4;
    state.particles.push(fxParticle(th.fx, { x: cx, y: cy, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v - L.cell * 3, life: -0.12, max: rand(0.7, 1.1),
      size: L.cell * rand(0.12, 0.24), rot: Math.random() * 6, vr: rand(-8, 8), color: i % 3 ? th.blocks[i % 7] : th.accent }));
  }
}
// every clear: a beam of light runs along each finished line and a shockwave rings out from where the piece landed;
// k (1..2) grows with the lines and the combo
export function lineBlast(rows, cols, x, y, k, now) {
  const t0 = now + 50;
  for (const r of rows) state.beams.push({ row: r, t0 });
  for (const c of cols) state.beams.push({ col: c, t0 });
  if (state.REDUCED) return;
  const lines = rows.length + cols.length;
  const rad = L.cell * (2.2 + lines * 0.7) * Math.sqrt(k), g = TH().snd.boom;
  if (g === 'soft' || g === 'electro') return; // puffs and pixels carry the moment alone
  if (g === 'drum') for (let i = 0; i < 3; i++) state.rings.push({ x, y, t0: t0 + i * 90, dur: 560, rad: rad * (1 - i * 0.12), w: L.cell * 0.1 }); // three beats
  else if (g === 'water') for (let i = 0; i < 2; i++) state.rings.push({ x, y, t0: t0 + i * 130, dur: 700, rad: rad * (1 - i * 0.2), w: L.cell * 0.08, color: '#bfe6ff' }); // ripples
  else state.rings.push({ x, y, t0, dur: 520, rad, w: L.cell * 0.14 });
}
// a clean board: two golden rings sweep out from the middle and a shower of spinning coins and stars falls over it
export const GOLD = '#ffd24a';
export function goldRain(now) {
  const cx = L.bx + L.B / 2, cy = L.by + L.B / 2;
  state.rings.push({ x: cx, y: cy, t0: now + 80, dur: 1000, rad: L.B * 0.75, w: L.cell * 0.22, color: GOLD });
  if (state.REDUCED) return;
  for (let i = 0; i < 30; i++) {
    const coin = i % 3 !== 0;
    state.particles.push({ kind: coin ? 'goldCoin' : 'star', x: L.bx + Math.random() * L.B, y: L.by - L.cell * rand(0.2, 1.4),
      vx: rand(-0.5, 0.5) * L.cell, vy: rand(0.5, 2.5) * L.cell, g: coin ? 0.4 : 0.15, drag: 0.5, wob: coin ? 0 : 0.5, glow: false, ph: Math.random() * 6.28,
      life: -rand(0.12, 1), max: rand(1.4, 2), size: L.cell * (coin ? rand(0.24, 0.34) : rand(0.16, 0.26)), rot: Math.random() * 6, vr: rand(-3, 3), color: coin ? GOLD : '#fff0a8' });
  }
}
// the points of a clear fly up as glowing sparks from the cleared cells to the score counter, which counts up as they land
export function scoreOrbs(cells, pts, color, now) {
  if (state.REDUCED || !pts) return;
  const r = elScore.getBoundingClientRect();
  if (!r.width) return; // no counter on screen
  const tx = r.left + r.width / 2, ty = r.top + r.height / 2;
  const n = Math.min(cells.length, 10, 3 + Math.round(Math.log2(1 + pts / 40))), pick = cells.slice().sort(() => Math.random() - 0.5).slice(0, n);
  const each = Math.floor(pts / n);
  pick.forEach(([cr, cc], i) => {
    const sx = L.ox + L.gx + (cc + 0.5) * L.cell, sy = L.oy + L.gy + (cr + 0.5) * L.cell;
    state.orbs.push({ sx, sy, tx, ty, mx: sx + rand(-1, 1) * L.cell * 2.5, my: Math.min(sy, ty) + (sy - ty) * rand(0.15, 0.45),
      t0: now + 90 + i * 25, dur: rand(360, 460), val: i === n - 1 ? pts - each * (n - 1) : each, i, color: i % 3 ? color : GOLD, size: L.cell * rand(0.16, 0.22) });
  });
}
// themes with fx.edge celebrate a finished row or column from the board's edges: confetti shoots out of both ends of every line
export function edgeBurst(rows, cols) {
  const th = TH();
  if (!th.fx.edge || state.REDUCED) return;
  const n = Math.min(7, 4 + rows.length + cols.length), c = L.cell;
  const shoot = (x, y, ang) => {
    for (let i = 0; i < n; i++) {
      const a = ang + rand(-0.55, 0.55), v = rand(1.2, 2.6) * c * 4;
      state.particles.push(fxParticle(th.fx, { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - c * 2, life: -rand(0.05, 0.3), max: rand(0.9, 1.5),
        size: c * rand(0.22, 0.38), rot: Math.random() * 6, vr: rand(-4, 4), color: i % 3 ? th.blocks[(Math.random() * 7) | 0] : th.accent }));
    }
  };
  for (const r of rows) { const y = L.gy + (r + 0.5) * c; shoot(L.bx, y, Math.PI); shoot(L.bx + L.B, y, 0); }
  for (const k of cols) { const x = L.gx + (k + 0.5) * c; shoot(x, L.by, -Math.PI / 2); shoot(x, L.by + L.B, Math.PI / 2); }
}
export function pickStartTheme() {
  if (!settings.auto) return settings.fixed;
  const pool = [...discovered];
  if (pool.length <= 1) return pool[0] || 0;
  const others = pool.filter(i => i !== theme.cur);
  return others[(Math.random() * others.length) | 0];
}
export function updateRing() {
  const r = $('ringRect');
  if (!settings.auto || mode().themeLocked) { r.style.strokeDashoffset = 100; return; } // a puzzle level never changes the theme
  const a = milestone(theme.stage), b = milestone(theme.stage + 1);
  r.style.strokeDashoffset = 100 * (1 - clamp01((state.score - a) / (b - a)));
}
export function saveMeta() { store.set(THEME_KEY, { v: META_V, disc: [...earned], fresh: [...fresh], auto: settings.auto, fixed: settings.fixed, block: settings.block }); }
export function setBlockMode(mode, now) {
  if (mode === theme.mode) return;
  settings.block = mode; saveMeta();
  theme.prevMode = theme.mode; theme.mode = mode;
  theme.prev = theme.cur; theme.t0 = now; state.ambPrev = null;
  if (Sfx.ok()) { Sfx.hiss({ dur: 0.5, vol: 0.06, type: 'bandpass', freq: 600, to: 5000, q: 0.8 }); Sfx.note(Sfx.snd.root, { when: 0.15, vol: 0.1 }); }
  buzz(12);
}
