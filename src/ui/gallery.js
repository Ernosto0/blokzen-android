import { themeMilestone, themeStageAt, T, THEMES } from '../themes/catalog.js';
import { Sfx } from '../audio/sfx.js';
import { $ } from './dom.js';
import { state, discovered, earned, fresh, settings, theme } from '../core/state.js';
import { anchorStart, collectionOf, stats, TH, UNLOCKS } from '../themes/progress.js';
import { rr, sprite } from '../render/sprites.js';
import { paintBase } from '../render/backgrounds.js';
import { saveMeta, setBlockMode, setTheme, updateRing } from '../themes/switching.js';
import { menuOpen } from './menu.js';
import { buzz } from '../platform/haptics.js';
import { t, fmtNum, tUnit } from '../i18n/index.js';

/* ---------- Theme gallery ---------- */
const PREVIEW = [[0, 0, 3, 0, 0], [0, 2, 3, 4, 0], [1, 2, 5, 4, 7], [1, 6, 5, 6, 7], [0, 6, 6, 6, 0]];
function drawPreview(c, i, known) {
  const size = c.getBoundingClientRect().width || 90;
  const key = [i, known, size, theme.mode, theme.cur, window.devicePixelRatio].join('|');
  if (c.dataset.preview === key) return;
  c.dataset.preview = key;
  const dpr = Math.min(window.devicePixelRatio || 1, 2), px = Math.round(size * dpr);
  c.width = c.height = px;
  const g = c.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
  const th = THEMES[i];
  paintBase(g, th, size, size, 1);
  const pad = size * 0.12, bs = size - 2 * pad, cs = bs / 5;
  rr(g, pad - 3, pad - 3, bs + 6, bs + 6, size * 0.06); g.fillStyle = th.board; g.fill();
  const cpx = Math.ceil(cs * dpr);
  PREVIEW.forEach((row, r) => row.forEach((v, cc) => g.drawImage(sprite(i, v, cpx), pad + cc * cs, pad + r * cs, cs, cs)));
  if (known) return;
  // locked: a blurred, faded glimpse of the theme under a padlock: players see roughly what is coming, not the surprise
  const snap = document.createElement('canvas'); snap.width = snap.height = px; snap.getContext('2d').drawImage(c, 0, 0);
  g.setTransform(1, 0, 0, 1, 0, 0); // the sharp copy stays under the blur so the edges do not fade out
  g.filter = `blur(${Math.round(size * 0.06 * dpr)}px)`; g.drawImage(snap, 0, 0); g.filter = 'none';
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.globalAlpha = 0.58; g.fillStyle = TH().board; g.fillRect(0, 0, size, size);
  const lw = size * 0.26, lh = size * 0.2, lx = (size - lw) / 2, ly = size * 0.5;
  g.globalAlpha = 0.92; g.strokeStyle = g.fillStyle = TH().fg;
  g.lineWidth = size * 0.045; g.lineCap = 'round';
  g.beginPath(); g.arc(size / 2, ly, lw * 0.32, Math.PI, 0); g.lineTo(size / 2 + lw * 0.32, ly + 1); g.moveTo(size / 2 - lw * 0.32, ly + 1); g.lineTo(size / 2 - lw * 0.32, ly); g.stroke();
  rr(g, lx, ly, lw, lh, size * 0.035); g.fill();
  g.globalAlpha = 1;
}
let collection = 'all', filter = 'all', detailIndex = null;
const collections = () => ({ all: t('Tümü'), classic: t('Klasik'), daily: t('Günlük'), zen: t('Zen'), puzzle: t('Bulmaca') });
function progress(i) {
  const u = UNLOCKS[THEMES[i].id], have = Math.max(0, Math.min(u.val(stats), u.goal));
  return { u, have, text: u.fmt ? tUnit(u.fmt(have, u.goal)) : fmtNum(have) + ' / ' + fmtNum(u.goal) };
}
function fillProgress(el, have, goal) {
  el.firstChild.style.width = (100 * have / goal) + '%';
  el.setAttribute('role', 'progressbar'); el.setAttribute('aria-label', t('Koleksiyon ilerlemesi'));
  el.setAttribute('aria-valuemin', '0'); el.setAttribute('aria-valuemax', goal); el.setAttribute('aria-valuenow', have);
}
function renderTabs(id, entries, selected, onSelect) {
  const wrap = $(id), scrollLeft = wrap.scrollLeft; wrap.textContent = '';
  for (const [key, text] of Object.entries(entries)) {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = text;
    b.dataset.value = key; b.setAttribute('aria-pressed', String(selected === key));
    b.addEventListener('click', () => { onSelect(key); renderGallery(); $(id).querySelector(`[data-value="${key}"]`).focus({ preventScroll: true }); $('galScroll').scrollTop = 0; });
    wrap.append(b);
  }
  wrap.scrollLeft = scrollLeft;
}
export function renderGallery() {
  const wrap = $('cards'); wrap.textContent = '';
  $('autoTheme').checked = settings.auto;
  const list = THEMES.map((th, i) => i).filter(i => collection === 'all' || collectionOf(THEMES[i]) === collection);
  $('galCount').textContent = t('{n}/{total} açık', { n: list.filter(i => earned.has(i)).length, total: list.length }) + (state.devMode ? ' · ' + t('geliştirici') : '');
  const nextAt = themeMilestone(theme.stage + 1);
  $('galHint').textContent = settings.auto ? t('Tema {n} puanda açık temalardan bir sonrakine geçer.', { n: fmtNum(nextAt) }) : t('Seçtiğin tema sabit kalır.');
  renderTabs('galCollections', collections(), collection, key => { collection = key; });
  renderTabs('galFilters', { all: t('Tümü'), open: t('Açık'), locked: t('Kilitli') }, filter, key => { filter = key; });
  const shown = list.filter(i => filter === 'all' || (filter === 'open' ? discovered.has(i) : !discovered.has(i)));
  $('galEmpty').hidden = !!shown.length;
  for (const i of shown) {
    const th = THEMES[i], known = discovered.has(i), cur = i === theme.cur;
    const b = document.createElement('button'); b.type = 'button'; b.id = 'tcard-' + th.id; b.dataset.index = i;
    b.className = 'tcard' + (cur ? ' cur' : '') + (known ? '' : ' locked');
    const c = document.createElement('canvas'); c.setAttribute('aria-hidden', 'true');
    const n = document.createElement('span'); n.className = 'tname'; n.textContent = known ? t(th.name) : '???';
    const s = document.createElement('span'); s.className = 'tstate';
    s.textContent = cur ? (settings.auto ? t('Şu an') : t('Seçili')) : fresh.has(i) ? t('Yeni!') : !known ? t('Kilitli') : state.devMode && !earned.has(i) ? t('Test') : collections()[collectionOf(th)];
    if (fresh.has(i) && !cur) s.classList.add('new');
    b.append(c, n, s);
    if (cur) { const check = document.createElement('span'); check.className = 'theme-check'; check.textContent = '✓'; check.setAttribute('aria-hidden', 'true'); b.append(check); }
    if (!known && UNLOCKS[th.id]) {
      const { u, have, text } = progress(i);
      const bar = document.createElement('span'); bar.className = 'tbar'; bar.append(document.createElement('i')); fillProgress(bar, have, u.goal);
      const pr = document.createElement('span'); pr.className = 'tprog'; pr.textContent = text;
      b.append(bar, pr); b.setAttribute('aria-label', t('Kilitli tema.') + ' ' + text + '. ' + t('Görevi gör'));
    }
    b.addEventListener('click', () => openDetail(i)); wrap.append(b);
  }
  [['modeClassic', 'classic'], ['modeSoft', 'soft']].forEach(([id, mode]) => {
    $(id).setAttribute('aria-checked', String(theme.mode === mode));
    $(id).tabIndex = theme.mode === mode ? 0 : -1;
  });
  requestAnimationFrame(drawGallery);
}
function drawGallery() {
  if ($('gallery').hidden) return;
  const bounds = $('galScroll').getBoundingClientRect();
  $('cards').querySelectorAll('.tcard').forEach(b => {
    const rect = b.getBoundingClientRect();
    if (rect.bottom >= bounds.top - 200 && rect.top <= bounds.bottom + 200) drawPreview(b.querySelector('canvas'), +b.dataset.index, discovered.has(+b.dataset.index));
  });
  if (!$('galOptions').hidden) {
    drawModePreview($('modeClassic').querySelector('canvas'), 'classic');
    drawModePreview($('modeSoft').querySelector('canvas'), 'soft');
  }
  if (detailIndex !== null) drawPreview($('detailPreview'), detailIndex, discovered.has(detailIndex));
}
function openDetail(i) {
  detailIndex = i; Sfx.pick(); buzz(10);
  const known = discovered.has(i);
  $('detailName').textContent = known ? t(THEMES[i].name) : '???';
  $('detailStatus').textContent = known ? (i === theme.cur ? t('Seçili') : collections()[collectionOf(THEMES[i])]) : t('Kilitli tema.');
  $('detailUse').hidden = !known; $('detailTask').hidden = known;
  if (!known) { const { u, have, text } = progress(i); $('detailGoal').textContent = t(u.text); $('detailProgress').textContent = text; fillProgress($('detailBar'), have, u.goal); }
  $('themeDetail').hidden = false; $('themeDetail').scrollTop = 0;
  document.querySelector('#gallery > .sheet').inert = true;
  requestAnimationFrame(drawGallery); $('detailClose').focus({ preventScroll: true });
}
export function closeThemeDetail() {
  if ($('themeDetail').hidden) return false;
  const i = detailIndex; detailIndex = null; $('themeDetail').hidden = true;
  document.querySelector('#gallery > .sheet').inert = false;
  $('tcard-' + THEMES[i].id)?.focus({ preventScroll: true }); return true;
}
$('detailClose').addEventListener('click', closeThemeDetail);
$('detailUse').addEventListener('click', () => { if (detailIndex !== null && discovered.has(detailIndex)) chooseTheme(detailIndex); });
$('galAppearance').addEventListener('click', () => {
  const expanded = $('galOptions').hidden; $('galOptions').hidden = !expanded;
  $('galAppearance').setAttribute('aria-expanded', String(expanded)); requestAnimationFrame(drawGallery);
});
let resizeFrame;
$('galScroll').addEventListener('scroll', () => { cancelAnimationFrame(resizeFrame); resizeFrame = requestAnimationFrame(drawGallery); }, { passive: true });
new ResizeObserver(() => { cancelAnimationFrame(resizeFrame); resizeFrame = requestAnimationFrame(drawGallery); }).observe($('galScroll'));
function drawModePreview(c, mode) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2), size = 24, px = Math.round(size * dpr), h = size / 2;
  c.width = c.height = px;
  const g = c.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, size, size);
  const cp = Math.ceil(h * dpr);
  [[1, 2], [4, 5]].forEach((row, r) => row.forEach((v, cc) => g.drawImage(sprite(theme.cur, v, cp, mode), cc * h, r * h, h, h)));
}
document.querySelector('#galOptions .seg-row').addEventListener('keydown', e => {
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) return;
  e.preventDefault();
  const buttons = [$('modeClassic'), $('modeSoft')];
  const i = e.key === 'Home' ? 0 : e.key === 'End' ? 1 : 1 - buttons.indexOf(e.target);
  buttons[i]?.click(); buttons[i]?.focus({ preventScroll: true });
});
['modeClassic', 'modeSoft'].forEach(id => $(id).addEventListener('click', () => {
  const mode = id === 'modeClassic' ? 'classic' : 'soft';
  if (mode === theme.mode) return;
  setBlockMode(mode, performance.now() + 120);
  renderGallery();
}));
function chooseTheme(i) {
  settings.auto = false; settings.fixed = i; saveMeta();
  state.pendingTheme = null;
  closeGallery();
  setTheme(i, performance.now() + 120, { show: true, sound: true });
  updateRing();
}
export function openGallery() { Sfx.unlock(); $('gallery').hidden = false; renderGallery(); $('galClose').focus({ preventScroll: true }); }
export function closeGallery() { closeThemeDetail(); $('gallery').hidden = true; if (fresh.size) { fresh.clear(); saveMeta(); } $(menuOpen ? 'menuThemes' : 'themeBtn').focus({ preventScroll: true }); }
$('themeBtn').addEventListener('click', openGallery);
$('galClose').addEventListener('click', closeGallery);
$('gallery').addEventListener('click', e => { if (e.target.id === 'gallery') closeGallery(); });
$('autoTheme').addEventListener('change', e => {
  settings.auto = e.target.checked;
  if (settings.auto) {
    theme.stage = themeStageAt(state.score); theme.mv = state.moves; theme.tAt = performance.now();
    theme.start = anchorStart(theme.stage);
  } else settings.fixed = theme.cur;
  saveMeta(); updateRing(); renderGallery();
});
