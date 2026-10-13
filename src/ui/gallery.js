import { milestone, stageAt, T, THEMES } from '../themes/catalog.js';
import { Sfx } from '../audio/sfx.js';
import { $ } from './dom.js';
import { state, discovered, earned, fresh, settings, theme } from '../core/state.js';
import { stats, TH, UNLOCKS } from '../themes/progress.js';
import { rr, sprite } from '../render/sprites.js';
import { paintBase } from '../render/backgrounds.js';
import { saveMeta, setBlockMode, setTheme, updateRing } from '../themes/switching.js';
import { t, fmtNum, tUnit } from '../i18n/index.js';

/* ---------- Theme gallery ---------- */
const PREVIEW = [[0, 0, 3, 0, 0], [0, 2, 3, 4, 0], [1, 2, 5, 4, 7], [1, 6, 5, 6, 7], [0, 6, 6, 6, 0]];
function drawPreview(c, i, known) {
  const size = c.getBoundingClientRect().width || 90;
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
export function renderGallery() {
  const wrap = $('cards'); wrap.textContent = '';
  $('autoTheme').checked = settings.auto;
  $('galCount').textContent = t('{n}/{total} açık', { n: earned.size, total: T }) + (state.devMode ? ' · ' + t('geliştirici') : '');
  const nextAt = milestone(theme.stage + 1);
  $('galHint').textContent = (settings.auto
    ? t('Tema {n} puanda açık temalardan bir sonrakine geçer.', { n: fmtNum(nextAt) }) + ' '
    : t('Seçtiğin tema sabit kalır.') + ' ') + (state.devMode ? t('Geliştirici modu açık: kilitli temalar da gösteriliyor ve "Test" yazıyor.') : t('Kilitli temalar, altlarında yazan görevi tamamlayınca açılır.'));
  THEMES.forEach((th, i) => {
    const sec = { news: t('Günlük koleksiyon'), zellige: t('Zen koleksiyonu'), jigsaw: t('Bulmaca koleksiyonu') }[th.id];
    if (sec) { const h = document.createElement('h3'); h.className = 'gal-sec'; h.textContent = sec; wrap.appendChild(h); }
    const known = discovered.has(i), cur = i === theme.cur;
    const b = document.createElement('button');
    b.type = 'button'; b.id = 'tcard-' + th.id;
    b.className = 'tcard' + (cur ? ' cur' : '') + (known ? '' : ' locked');
    if (!known) b.setAttribute('aria-disabled', 'true');
    const c = document.createElement('canvas');
    const n = document.createElement('span'); n.className = 'tname'; n.textContent = known ? t(th.name) : '???'; // a locked theme keeps its name a surprise
    const s = document.createElement('span'); s.className = 'tstate' + (fresh.has(i) && !cur ? ' new' : '');
    s.textContent = cur ? (settings.auto ? t('Şu an') : t('Seçili')) : fresh.has(i) ? t('Yeni!') : !known ? t('Kilitli') : state.devMode && !earned.has(i) ? t('Test') : t('Uygula');
    b.append(c, n, s);
    const u = UNLOCKS[th.id];
    if (!known && u) {
      const have = Math.min(u.val(stats), u.goal);
      const g = document.createElement('span'); g.className = 'tgoal'; g.textContent = t(u.text);
      const bar = document.createElement('span'); bar.className = 'tbar';
      const fill = document.createElement('i'); fill.style.width = (100 * have / u.goal) + '%'; bar.appendChild(fill);
      const pr = document.createElement('span'); pr.className = 'tprog'; pr.textContent = u.fmt ? tUnit(u.fmt(have, u.goal)) : fmtNum(have) + ' / ' + fmtNum(u.goal);
      b.append(g, bar, pr);
      b.setAttribute('aria-label', t('Kilitli tema.') + ' ' + t(u.text) + '. ' + pr.textContent);
    }
    wrap.appendChild(b);
    b.addEventListener('click', () => { if (known) chooseTheme(i); });
  });
  [['modeClassic', 'classic'], ['modeSoft', 'soft']].forEach(([id, mode]) => $(id).setAttribute('aria-checked', String(theme.mode === mode)));
  requestAnimationFrame(() => {
    // long single-word names (Alacakaranlık) shrink to fit the card instead of spilling over it
    wrap.querySelectorAll('.tname, .tprog').forEach(el => { el.style.fontSize = ''; let f = parseFloat(getComputedStyle(el).fontSize); while (el.scrollWidth > el.clientWidth + 1 && f > 8) { f -= 0.5; el.style.fontSize = f + 'px'; } });
    THEMES.forEach((th, i) => drawPreview($('tcard-' + th.id).querySelector('canvas'), i, discovered.has(i)));
    drawModePreview($('modeClassic').querySelector('canvas'), 'classic');
    drawModePreview($('modeSoft').querySelector('canvas'), 'soft');
  });
}
function drawModePreview(c, mode) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2), size = 24, px = Math.round(size * dpr), h = size / 2;
  c.width = c.height = px;
  const g = c.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, size, size);
  const cp = Math.ceil(h * dpr);
  [[1, 2], [4, 5]].forEach((row, r) => row.forEach((v, cc) => g.drawImage(sprite(theme.cur, v, cp, mode), cc * h, r * h, h, h)));
}
['modeClassic', 'modeSoft'].forEach(id => $(id).addEventListener('click', () => {
  const mode = id === 'modeClassic' ? 'classic' : 'soft';
  if (mode === theme.mode) return;
  closeGallery();
  setBlockMode(mode, performance.now() + 120);
}));
function chooseTheme(i) {
  settings.auto = false; settings.fixed = i; saveMeta();
  state.pendingTheme = null;
  closeGallery();
  setTheme(i, performance.now() + 120, { show: true, sound: true });
  updateRing();
}
export function openGallery() { Sfx.unlock(); renderGallery(); $('gallery').hidden = false; $('galClose').focus({ preventScroll: true }); }
export function closeGallery() { $('gallery').hidden = true; if (fresh.size) { fresh.clear(); saveMeta(); } }
$('themeBtn').addEventListener('click', openGallery);
$('galClose').addEventListener('click', closeGallery);
$('gallery').addEventListener('click', e => { if (e.target.id === 'gallery') closeGallery(); });
$('autoTheme').addEventListener('change', e => {
  settings.auto = e.target.checked;
  if (settings.auto) {
    theme.stage = stageAt(state.score);
    const order = [...discovered].sort((a, b) => a - b), k = order.indexOf(theme.cur);
    theme.start = order[(((k - theme.stage) % order.length) + order.length) % order.length];
  } else settings.fixed = theme.cur;
  saveMeta(); updateRing(); renderGallery();
});
