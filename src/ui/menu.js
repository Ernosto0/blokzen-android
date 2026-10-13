import { N, SAVE_KEY, TUT_KEY } from '../core/constants.js';
import { Sfx } from '../audio/sfx.js';
import { buzz } from '../platform/haptics.js';
import { store } from '../core/store.js';
import { $ } from './dom.js';
import { state, theme } from '../core/state.js';
import { dayKey, TH } from '../themes/progress.js';
import { curStreak, daily, DAILY_SAVE_KEY, dailyStart, fmtDay, ZEN_SAVE_KEY } from '../modes/daily.js';
import { GEM_COLOR, LEVELS, PUZ_SAVE_KEY } from '../modes/puzzle-levels.js';
import { nextLevelIndex, puzSolved, puzTotalStars } from '../modes/puzzle.js';
import { drawGemOn, rr, sprite } from '../render/sprites.js';
import { newGame, paintStars, startLevel, switchMode } from '../game/flow.js';
import { resetConfirm, syncMute } from '../game/input.js';
import { openLevels } from './levels.js';
import { startTutorial } from './tutorial.js';

/* ---------- Main menu ---------- */
const LOGO = [[1, 1, 0, 0, 5], [0, 1, 3, 3, 5], [2, 2, 3, 3, 5]];
const ART_CLASSIC = [[1, 1, 0, 4], [0, 2, 2, 4], [6, 2, 2, 4], [6, 6, 0, 0]];
const ART_ZEN = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [3, 3, 0, 5, 0]]; // a few stones under an open circle
const ART_PUZZLE = [[2, 2, 0, 4, 4], [9, 1, 0, 0, 4], [1, 1, 0, 3, 3], [0, 0, 0, 3, 9], [5, 5, 5, 0, 7]]; // 9: a gem
export let menuOpen = false;
export const inProgress = () => !state.over && state.moves > 0;
export const fmtN = n => (n | 0).toLocaleString('tr-TR');
// size a canvas for its CSS box; returns null when nothing changed since the last draw with this key
function prepCanvas(c, key) {
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
  p = prepCanvas($('artClassic'), 'classic');
  if (p) {
    const { g, w, dpr } = p, pad = w * 0.13, cs = (w - 2 * pad) / 4, px = Math.ceil(cs * dpr);
    rr(g, 0, 0, w, w, w * 0.24); g.fillStyle = th.board; g.fill();
    ART_CLASSIC.forEach((row, r) => row.forEach((v, cc) => g.drawImage(sprite(theme.cur, v, px), pad + cc * cs, pad + r * cs, cs, cs)));
  }
  const today = dayKey();
  p = prepCanvas($('artDaily'), 'daily' + today);
  if (p) { // today's start board in miniature
    const { g, w, dpr } = p, pad = w * 0.09, cs = (w - 2 * pad) / N, px = Math.ceil(cs * dpr), sg = dailyStart(today).grid;
    rr(g, 0, 0, w, w, w * 0.24); g.fillStyle = th.board; g.fill();
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) g.drawImage(sprite(theme.cur, sg[r][c], px), pad + c * cs, pad + r * cs, cs, cs);
  }
  p = prepCanvas($('artPuzzle'), 'puzzle');
  if (p) { // a small board with two gems set into it
    const { g, w, dpr } = p, pad = w * 0.11, cs = (w - 2 * pad) / 5, px = Math.ceil(cs * dpr);
    rr(g, 0, 0, w, w, w * 0.24); g.fillStyle = th.board; g.fill();
    ART_PUZZLE.forEach((row, r) => row.forEach((v, cc) => {
      g.drawImage(sprite(theme.cur, v === 9 ? GEM_COLOR : v, px), pad + cc * cs, pad + r * cs, cs, cs);
      if (v === 9) drawGemOn(g, theme.cur, pad + cc * cs, pad + r * cs, cs, dpr);
    }));
  }
  p = prepCanvas($('artZen'), 'zen');
  if (p) { // a few stones on a quiet board, under an open ensō circle
    const { g, w, dpr } = p, pad = w * 0.11, cs = (w - 2 * pad) / 5, px = Math.ceil(cs * dpr);
    rr(g, 0, 0, w, w, w * 0.24); g.fillStyle = th.board; g.fill();
    ART_ZEN.forEach((row, r) => row.forEach((v, cc) => g.drawImage(sprite(theme.cur, v, px), pad + cc * cs, pad + r * cs, cs, cs)));
    g.save();
    g.lineCap = 'round'; g.lineWidth = w * 0.065; g.strokeStyle = th.accent;
    g.beginPath(); g.arc(w / 2, w * 0.4, w * 0.24, Math.PI * 0.62, Math.PI * 2.38); g.stroke();
    g.restore();
  }
}
// what each mode card should say, read from the live game or from that mode's save
function classicStatus() {
  if (state.mode === 'classic') return { prog: inProgress(), score: state.score };
  const d = store.get(SAVE_KEY);
  return d && Array.isArray(d.grid) ? { prog: (d.moves | 0) > 0, score: d.score | 0 } : { prog: false, score: 0 };
}
function dailyStatus() {
  const t = dayKey();
  if (state.mode === 'daily' && state.gameDay === t) return { prog: inProgress(), score: state.score };
  const d = store.get(DAILY_SAVE_KEY);
  return d && d.day === t ? { prog: (d.moves | 0) > 0, score: d.score | 0 } : { prog: false, score: 0 };
}
function zenStatus() {
  if (state.mode === 'zen') return { prog: inProgress(), score: state.score, lines: state.gs.lines };
  const d = store.get(ZEN_SAVE_KEY);
  return d && d.mode === 'zen' && Array.isArray(d.grid) ? { prog: (d.moves | 0) > 0, score: d.score | 0, lines: (d.gs && d.gs.lines) | 0 } : { prog: false, score: 0, lines: 0 };
}
export function puzzleStatus() {
  if (state.mode === 'puzzle' && state.puz.gems) return { prog: inProgress() && !state.puz.won, li: state.puz.li };
  const d = store.get(PUZ_SAVE_KEY), li = d && d.puz ? LEVELS.findIndex(l => l.id === d.puz.id) : -1;
  return li >= 0 && d.mode === 'puzzle' ? { prog: (d.moves | 0) > 0, li } : { prog: false, li: -1 };
}

export function resetMenuNew() {
  clearTimeout(state.menuNewTimer);
  const b = $('menuNew'); b.classList.remove('confirm'); b.textContent = 'Yeni oyun';
  clearTimeout(state.zenNewTimer);
  const z = $('zenNew'); z.classList.remove('confirm'); z.textContent = 'Sıfırla';
}
function renderMenu() {
  const cs = classicStatus();
  $('playLbl').textContent = cs.prog ? 'Devam et' : 'Oyna';
  $('classicSub').textContent = state.best ? `En iyi ${fmtN(state.best)}` : 'Yer kalmayana kadar';
  const zs = zenStatus();
  $('zenLbl').textContent = zs.prog ? 'Devam et' : 'Oyna';
  $('zenSub').textContent = 'Bitmez, acele yok';
  $('zenFoot').hidden = !zs.prog;
  if (zs.prog) $('zenInfo').textContent = `${fmtN(zs.lines)} sıra · ${fmtN(zs.score)} puan`;
  $('classicFoot').hidden = !cs.prog;
  if (cs.prog) $('resumeInfo').textContent = `Yarım oyun · ${fmtN(cs.score)} puan`;
  const ps = puzzleStatus(), solved = puzSolved(), nx = nextLevelIndex();
  $('puzzleSub').textContent = `${puzTotalStars()} / ${LEVELS.length * 3} yıldız`;
  $('puzzleLbl').textContent = ps.prog ? 'Devam et' : nx < 0 ? 'Bölümler' : 'Başla';
  $('puzzleInfo').textContent = ps.prog ? `Bölüm ${ps.li + 1} yarım kaldı` : nx < 0 ? `${solved} bölümün hepsi çözüldü` : `Sıradaki: Bölüm ${nx + 1}`;
  $('playPuzzle').querySelector('.mode-go').classList.toggle('soft', !ps.prog && nx < 0);
  const t = dayKey(), info = dailyStart(t), rec = daily.days[t], ds = dailyStatus(), st = rec ? rec.stars : 0;
  const nb = x => x.replace(/ /g, '\u00a0'); // keep each half on one line; wrap only at the dot
  $('dailySub').textContent = nb(fmtDay(t)) + ' · ' + nb(rec && rec.best ? `En iyi ${fmtN(rec.best)}` : 'Herkese aynı tahta');
  $('dailyLbl').textContent = ds.prog ? 'Devam et' : rec && rec.tries ? 'Tekrar' : 'Başla';
  $('playDaily').querySelector('.mode-go').classList.toggle('soft', st === 3 && !ds.prog);
  paintStars($('dailyStars'), st, info.targets);
  const sk = curStreak(), saved = daily.last === t;
  $('streakTxt').textContent = sk ? `${sk} gün seri` : 'Seri yok';
  $('dailyStreak').classList.toggle('off', !sk);
  $('dailyStreak').title = sk ? (saved ? 'Bugün yıldızını aldın, seri sürüyor' : 'Seriyi korumak için bugün bir yıldız al') : 'Bir yıldız al, seri başlasın';
  resetMenuNew(); syncMute();
  drawLogo();
}
export function openMenu(focus = true) {
  if (state.drag) return;
  resetConfirm();
  menuOpen = true; $('menu').hidden = false;
  renderMenu();
  if (focus) $(state.mode === 'daily' ? 'playDaily' : state.mode === 'zen' ? 'playZen' : state.mode === 'puzzle' ? 'playPuzzle' : 'play').focus({ preventScroll: true });
}
export function closeMenu() { menuOpen = false; $('menu').hidden = true; resetMenuNew(); }
$('menuBtn').addEventListener('click', () => { Sfx.unlock(); Sfx.pick(); openMenu(); });
$('toMenu').addEventListener('click', () => { Sfx.unlock(); openMenu(); });
function startMode(m) {
  Sfx.unlock(); Sfx.pick(); buzz(10);
  const firstRun = !store.get(TUT_KEY);
  switchMode(m);
  if (state.over) newGame();
  closeMenu();
  if (firstRun) startTutorial();
}
$('play').addEventListener('click', () => startMode('classic'));
$('playDaily').addEventListener('click', () => startMode('daily'));
$('playZen').addEventListener('click', () => startMode('zen'));
// puzzle card: carry on with a half-played level, else start the next unsolved one; with every level solved, show the list
$('playPuzzle').addEventListener('click', () => {
  const ps = puzzleStatus(), nx = nextLevelIndex();
  if (ps.prog) startMode('puzzle');
  else if (nx < 0) openLevels();
  else startLevel(nx);
});
$('puzzleLevels').addEventListener('click', () => openLevels());
