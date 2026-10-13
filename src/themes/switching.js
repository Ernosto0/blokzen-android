import { milestone, THEMES } from './catalog.js';
import { mode } from '../modes/registry.js';
import { mixHex } from '../core/color.js';
import { THEME_KEY } from '../core/constants.js';
import { Sfx } from '../audio/sfx.js';
import { buzz } from '../platform/haptics.js';
import { store } from '../core/store.js';
import { $, metaTheme } from '../ui/dom.js';
import { state, discovered, earned, fresh, settings, theme, THEME_DUR } from '../core/state.js';
import { FINALES, META_V, TH } from './progress.js';
import { clamp01, inOut, rand } from '../core/util.js';
import { L } from '../render/layout.js';
import { fxParticle } from '../render/render.js';
import { AMBIENTS } from './registry.js';

/* ---------- Theme switching ---------- */
export function applyDomColors(now) {
  const m = clamp01((now - theme.t0) / THEME_DUR);
  if (m >= 1 && theme.domDone) return;
  const a = THEMES[theme.prev], b = TH(), e = inOut(m), st = document.documentElement.style;
  const mixK = k => (a[k].startsWith('#') && b[k].startsWith('#')) ? mixHex(a[k], b[k], e) : (e < 0.5 ? a[k] : b[k]);
  for (const k of ['bg', 'board', 'fg', 'muted', 'accent', 'ink', 'btn']) st.setProperty('--' + k, mixK(k));
  st.setProperty('--surface', e < 0.5 ? a.surface : b.surface);
  st.colorScheme = b.light ? 'light' : 'dark';
  metaTheme.content = mixK('bg');
  theme.domDone = m >= 1;
}
export function setTheme(i, now, { show = true, sound = true, unlocked = false, finale = false } = {}) {
  if (i === theme.cur && now - theme.t0 >= THEME_DUR && !unlocked) return;
  theme.prev = theme.cur; theme.cur = i; theme.t0 = now; theme.domDone = false; theme.prevMode = theme.mode;
  state.ambPrev = state.ambCur; state.ambCur = AMBIENTS[THEMES[i].amb](THEMES[i]);
  Sfx.snd = THEMES[i].snd;
  if (show) {
    state.banner = { name: THEMES[i].name, sub: finale ? FINALES[THEMES[i].id] || 'KOLEKSİYON FİNALİ' : unlocked ? 'YENİ TEMA AÇILDI' : 'TEMA', t0: now + 120, dur: finale ? 3600 : unlocked ? 2300 : 1900 };
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
