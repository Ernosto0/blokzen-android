import { TUT_KEY } from '../core/constants.js';
import { mode, MODES } from '../modes/registry.js';
import { Sfx } from '../audio/sfx.js';
import { buzz } from '../platform/haptics.js';
import { store } from '../core/store.js';
import { $ } from './dom.js';
import { state, theme } from '../core/state.js';
import { TH } from '../themes/progress.js';
import { sprite } from '../render/sprites.js';
import { newGame, switchMode } from '../game/flow.js';
import { resetConfirm, syncMute } from '../game/input.js';
import { startTutorial } from './tutorial.js';
import { fmtNum } from '../i18n/index.js';

/* ---------- Main menu ---------- */
export const LOGO = [[1, 1, 0, 0, 5], [0, 1, 3, 3, 5], [2, 2, 3, 3, 5]];
export let menuOpen = false;
export const inProgress = () => !state.over && state.moves > 0;
export const fmtN = n => fmtNum(n | 0);
// size a canvas for its CSS box; returns null when nothing changed since the last draw with this key
export function prepCanvas(c, key) {
  const w = c.clientWidth, h = c.clientHeight;
  if (!w || !h) return null;
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const k = [key, theme.cur, theme.mode, w, h, dpr].join('|');
  if (c.dataset.k === k) return null;
  c.dataset.k = k;
  c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
  const g = c.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
  return { g, w, h, dpr };
}
// logo and the two mode pictures, all drawn with the current theme's blocks
export function drawLogo() {
  let p = prepCanvas($('logo'), 'logo');
  if (p) {
    const { g, w, h, dpr } = p, cs = Math.min(w / 5, h / 3), ox = (w - cs * 5) / 2, oy = (h - cs * 3) / 2, px = Math.ceil(cs * dpr);
    LOGO.forEach((row, r) => row.forEach((v, cc) => { if (v) g.drawImage(sprite(theme.cur, v, px), ox + cc * cs, oy + r * cs, cs, cs); }));
  }
  const th = TH();
  for (const m of Object.values(MODES)) if (m.drawArt) m.drawArt(th);
}

export function resetMenuNew() { for (const m of Object.values(MODES)) if (m.resetNew) m.resetNew(); }
function renderMenu() {
  const actions = $('featuredActions');
  for (const [button, card] of [['menuNew', 'modeClassicCard'], ['zenNew', 'modeZenCard']]) {
    if (actions.contains($(button))) $(card).append($(button));
  }
  for (const m of Object.values(MODES)) if (m.renderCard) m.renderCard();
  const active = $(mode().button).closest('.mode');
  document.querySelectorAll('.mode').forEach(el => el.classList.toggle('featured', el === active));
  // Keep the featured play and optional reset actions together without nesting buttons.
  active.append(actions);
  const reset = active.id === 'modeClassicCard' ? $('menuNew') : active.id === 'modeZenCard' ? $('zenNew') : null;
  if (reset && !reset.hidden) actions.append(reset);
  active.parentElement.prepend(active);
  const h = mode().hero();
  $('heroLbl').textContent = h.label; $('heroSub').textContent = h.sub;
  resetMenuNew(); syncMute();
  requestAnimationFrame(drawLogo);
}
export function openMenu(focus = true) {
  if (state.drag) return;
  resetConfirm();
  menuOpen = true; $('menu').hidden = false;
  renderMenu();
  if (focus) $('menuHero').focus({ preventScroll: true });
}
export function closeMenu() { menuOpen = false; $('menu').hidden = true; resetMenuNew(); }
$('menuBtn').addEventListener('click', () => { Sfx.unlock(); Sfx.pick(); openMenu(); });
$('toMenu').addEventListener('click', () => { Sfx.unlock(); openMenu(); });
export function startMode(m) {
  Sfx.unlock(); Sfx.pick(); buzz(10);
  const firstRun = !store.get(TUT_KEY);
  switchMode(m);
  if (state.over) newGame();
  closeMenu();
  if (firstRun) startTutorial();
}
// The primary action belongs to the featured mode; the other cards start their own mode.
// Called once all modes have registered (main.js); at load time the modes are not all defined yet.
export function bindModeButtons() {
  $('menuHero').addEventListener('click', () => { const m = mode(); if (m.play) m.play(); else startMode(m.id); });
  for (const m of Object.values(MODES)) $(m.button).addEventListener('click', () => (m.play ? m.play() : startMode(m.id)));
}
