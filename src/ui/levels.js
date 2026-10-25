import { Sfx } from '../audio/sfx.js';
import { $ } from './dom.js';
import { state } from '../core/state.js';
import { LEVELS, PUZZLE_GROUPS } from '../modes/puzzle-levels.js';
import { bestStars, GOAL_ICON, goalText, levelOpen, MINI_STAR, nextLevelIndex, puzTotalStars, puzzleStatus, startLevel } from '../modes/puzzle.js';
import { copyText, resetShare, shareText } from '../game/flow.js';
import { menuOpen, startMode } from './menu.js';
import { openInfo } from './info.js';
import { openSettings } from './settings.js';
import { openGallery } from './gallery.js';
import { t, fmtNum } from '../i18n/index.js';

/* ---------- Puzzle level list ---------- */
const LOCK_SVG = '<svg class="lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></svg>';
function renderLevels() {
  const body = $('lvBody'); body.textContent = '';
  $('lvCount').textContent = t('{a} / {b} yıldız', { a: puzTotalStars(), b: LEVELS.length * 3 });
  const nx = nextLevelIndex(), status = puzzleStatus(), cur = status.prog ? status.li : -1;
  let i0 = 0;
  PUZZLE_GROUPS.forEach((grp, gi) => {
    const h = document.createElement('h3'); h.className = 'gal-sec'; h.textContent = t('{n}. grup', { n: gi + 1 }) + ' · ' + t(grp.name);
    const count = document.createElement('span'); count.className = 'group-stars';
    count.textContent = '★ ' + fmtNum(grp.levels.reduce((n, lv) => n + bestStars(lv.id), 0)) + ' / ' + fmtNum(grp.levels.length * 3);
    h.append(count);
    const grid2 = document.createElement('div'); grid2.className = 'lvgrid';
    grp.levels.forEach((lv, j) => {
      const i = i0 + j, open = levelOpen(i), st = bestStars(lv.id);
      const b = document.createElement('button');
      b.type = 'button'; b.id = 'lv-' + lv.id;
      b.className = 'lv' + (open ? '' : ' locked') + (i === nx || i === cur ? ' next' : '') + (lv.master ? ' master' : '');
      b.innerHTML = open
        ? `<span class="lvg">${GOAL_ICON[lv.goal.type]}</span><b>${i + 1}</b><span class="lvs">${[0, 1, 2].map(k => MINI_STAR(k < st)).join('')}</span>`
        : `<b>${i + 1}</b>${LOCK_SVG}`;
      const title = document.createElement('span'); title.className = 'lv-name'; title.textContent = t(lv.title);
      b.append(title);
      if (i === nx && open) b.setAttribute('aria-current', 'step');
      b.title = `${i + 1} · ${t(lv.title)}` + (lv.master ? ' ' + t('(usta bölümü)') : '');
      b.setAttribute('aria-label', t('Bölüm {n}', { n: i + 1 }) + `, ${t(lv.title)}${lv.master ? ', ' + t('usta bölümü') : ''}. ` + (open ? t('Hedef: {g}', { g: goalText(lv) }) + '. ' + (st ? t('{n} yıldız', { n: st }) : t('Henüz çözülmedi')) : t('Kilitli, önceki bölümü bitir')));
      if (!open) b.setAttribute('aria-disabled', 'true');
      b.addEventListener('click', () => { if (levelOpen(i)) startLevel(i); else Sfx.bad(); });
      grid2.appendChild(b);
    });
    body.append(h, grid2);
    i0 += grp.levels.length;
  });
  const show = cur >= 0 ? cur : nx;
  const nxEl = $('lvNext');
  if (show >= 0) {
    const lv = LEVELS[show];
    nxEl.innerHTML = `<b></b><span></span>`;
    nxEl.firstChild.textContent = (cur >= 0 ? t('Yarım kalan:') : t('Sıradaki:')) + ` ${show + 1} · ${t(lv.title)}`;
    nxEl.lastChild.textContent = t('Hedef: {g}', { g: goalText(lv) }) + ' · ' + t('{n} parça', { n: lv.pieces.length });
    nxEl.hidden = false;
    nxEl.onclick = () => {
      if (cur >= 0) { closeLevels(); startMode('puzzle'); }
      else startLevel(show);
    };
  } else { nxEl.hidden = true; nxEl.onclick = null; }
}
export function openLevels() {
  Sfx.unlock(); Sfx.pick();
  if (state.drag) return;
  renderLevels();
  $('levels').hidden = false;
  const nx = nextLevelIndex(), focusEl = nx >= 0 ? $('lv-' + LEVELS[nx].id) : null;
  (focusEl || $('lvClose')).focus({ preventScroll: true });
}
export function closeLevels() {
  if ($('levels').hidden) return;
  $('levels').hidden = true;
  if (menuOpen) $('playPuzzle').focus({ preventScroll: true });
}
$('lvClose').addEventListener('click', closeLevels);
$('levels').addEventListener('click', e => { if (e.target.id === 'levels') closeLevels(); });
$('share').addEventListener('click', async () => {
  Sfx.unlock(); Sfx.pick();
  const ok = await copyText(shareText());
  $('share').textContent = ok ? t('Kopyalandı') : t('Kopyalanamadı');
  clearTimeout(state.shareTimer); state.shareTimer = setTimeout(resetShare, 2200);
});
$('menuThemes').addEventListener('click', () => openGallery());
$('menuSettings').addEventListener('click', () => openSettings());
$('menuHelp').addEventListener('click', () => openInfo('help'));
$('menuStats').addEventListener('click', () => openInfo('stats'));
