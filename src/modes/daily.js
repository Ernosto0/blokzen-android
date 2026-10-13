import { N } from '../core/constants.js';
import { dealStream } from '../core/dealer.js';
import { Sfx } from '../audio/sfx.js';
import { buzz } from '../platform/haptics.js';
import { store } from '../core/store.js';
import { state, emptyGrid } from '../core/state.js';
import { dayKey, stats } from '../themes/progress.js';
import { defineMode, hudInfo } from './registry.js';
import { $ } from '../ui/dom.js';
import { paintStars, resetShare, STAR_SVG } from '../game/flow.js';
import { fmtN } from '../ui/menu.js';
import { L } from '../render/layout.js';

/* ---------- Daily challenge ----------
   One game a day that is the same for everyone: a seeded start board, a seeded dealer and three target scores.
   Retries are free and replay the same day; the best score of the day counts. A day with at least one star keeps the streak going.
   Classic and daily keep separate saves, so switching modes never loses a game. */
export const DAILY_SAVE_KEY = 'blokzen.daily.game', DAILY_KEY = 'blokzen.daily';
const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
export const WEEKDAYS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
const DAILY_BASE = [5000, 25000, 100000]; // star targets before the day's own ±15% twist
const niceTarget = x => x < 10000 ? Math.round(x / 500) * 500 : Math.round(x / 1000) * 1000;
export const dayDate = k => new Date((k / 10000) | 0, (((k / 100) | 0) % 100) - 1, k % 100);
const keyOf = d => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
export const dayShift = (k, n) => { const d = dayDate(k); d.setDate(d.getDate() + n); return keyOf(d); };
export const fmtDay = k => `${k % 100} ${MONTHS[(((k / 100) | 0) % 100) - 1]}`;
function hash32(n) {
  let h = (n ^ 0x9E3779B9) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x85EBCA6B); h = Math.imul(h ^ (h >>> 13), 0xC2B2AE35);
  return (h ^ (h >>> 16)) >>> 0;
}
export const dailySeed = k => hash32(k * 7919 + 17);
// The day's start board (a mirrored pattern of 8 to 14 cells that never fills a line) and its three star targets
const dailyCache = new Map();
export function dailyStart(k) {
  if (dailyCache.has(k)) return dailyCache.get(k);
  const g = dealStream(dailySeed(k) ^ 0x5bd1e995), R = n => (g.next() * n) | 0;
  const grid = emptyGrid(), perRow = Array(N).fill(0);
  const pairs = 4 + R(4);
  for (let p = 0, tries = 0; p < pairs && tries < 200; tries++) {
    const r = R(N), c = R(N / 2);
    if (grid[r][c] || perRow[r] >= 3) continue; // a fourth pair would complete the row
    const v = 1 + R(7);
    grid[r][c] = grid[r][N - 1 - c] = v; perRow[r]++; p++;
  }
  const f = 0.85 + 0.3 * g.next();
  const targets = DAILY_BASE.map(b => niceTarget(b * f));
  const info = { grid, targets, cells: grid.flat().filter(Boolean).length };
  dailyCache.set(k, info);
  return info;
}

export let daily = { days: {}, streak: 0, best: 0, last: 0 }; // per-day records; streak of days with a star, ending at `last`
export const dayRec = k => daily.days[k] || (daily.days[k] = { best: 0, stars: 0, tries: 0 });
export const dayBest = k => (daily.days[k] && daily.days[k].best) || 0;
export const starsFor = (sc, tg) => tg.reduce((n, t) => n + (sc >= t ? 1 : 0), 0);
export const curStreak = () => { const t = dayKey(); return daily.last === t || daily.last === dayShift(t, -1) ? daily.streak : 0; };
export function saveDaily() {
  const keys = Object.keys(daily.days).map(Number).sort((a, b) => b - a);
  for (const k of keys.slice(120)) delete daily.days[k]; // keep the last 120 days
  store.set(DAILY_KEY, daily);
}
export function loadDaily() {
  const d = store.get(DAILY_KEY);
  if (!d || typeof d !== 'object') return;
  if (d.days && typeof d.days === 'object') for (const k in d.days) {
    const r = d.days[k], key = k | 0;
    if (key > 20000000 && r && typeof r === 'object') daily.days[key] = { best: r.best | 0, stars: Math.min(3, r.stars | 0), tries: r.tries | 0, beat: r.beat ? 1 : 0 };
  }
  daily.streak = d.streak | 0; daily.best = d.best | 0; daily.last = d.last | 0;
}
// Called after every daily move: records the day's best, hands out stars and keeps the streak
export function dailyProgress(now, midX) {
  const info = dailyStart(state.gameDay), rec = dayRec(state.gameDay);
  rec.best = Math.max(rec.best, state.score);
  stats.dailyBestFulls = Math.max(stats.dailyBestFulls, state.fulls); // full clears in one daily game (stained glass theme)
  const prev = daily.days[dayShift(state.gameDay, -1)]; // beating yesterday's best counts once per day (letter theme)
  if (!rec.beat && prev && prev.best > 0 && rec.best > prev.best) { rec.beat = 1; stats.dailyBeat++; }
  const st = starsFor(state.score, info.targets);
  if (st > state.gs.stars) {
    state.gs.stars = st;
    const hr = new Date().getHours();
    if (hr >= 5 && hr < 9) stats.dailyMorning++; // a morning star, for the tea garden theme
    if (hr >= 22 || hr < 2) stats.dailyNight++;  // a late night star, for the library theme
    state.texts.push({ text: st === 3 ? 'Üç yıldız!' : `${st}. yıldız!`, x: midX, y: L.gy + L.cell * 1.4, t0: now + 260, dur: 1700, size: L.cell * 0.78, role: 'accent' });
    setTimeout(() => { Sfx.star(st); buzz([16, 40, 16]); }, 240);
  }
  if (st > rec.stars) {
    stats.dailyStars += st - rec.stars;
    if (rec.stars === 0) { // first star of this day moves the streak
      if (daily.last !== state.gameDay) daily.streak = daily.last === dayShift(state.gameDay, -1) ? daily.streak + 1 : 1;
      daily.last = state.gameDay;
      daily.best = Math.max(daily.best, daily.streak);
      stats.dailyBestStreak = Math.max(stats.dailyBestStreak, daily.streak);
      const wd = dayDate(state.gameDay).getDay(), other = wd === 6 ? dayShift(state.gameDay, 1) : wd === 0 ? dayShift(state.gameDay, -1) : 0;
      if (other && daily.days[other] && daily.days[other].stars > 0) stats.dailyWeekend++; // both days of one weekend (picnic theme)
    }
    if (st === 3) { stats.dailyThree++; if (rec.tries === 1) stats.dailyFirst3++; } // three stars on the day's first try (desert theme)
    rec.stars = st;
  }
  saveDaily();
}

// daily goal bar: three equal thirds, one per star, so the first target is as visible as the last
const goalPos = (sc, tg) => { let lo = 0; for (let i = 0; i < 3; i++) { if (sc < tg[i]) return (i + (sc - lo) / (tg[i] - lo)) / 3; lo = tg[i]; } return 1; };
let goalBuilt = 0; // goalShown: the bar has been drawn for this day, so newly lit stars may pop
function updateGoal() {
  const tg = dailyStart(state.gameDay).targets, st = starsFor(state.score, tg);
  if (goalBuilt !== state.gameDay) {
    goalBuilt = state.gameDay;
    $('goalDay').textContent = fmtDay(state.gameDay);
    $('goalMarks').innerHTML = tg.map((t, i) => `<span class="gmark" style="left:${(100 * (i + 1) / 3).toFixed(2)}%">${STAR_SVG}</span>`).join('');
  }
  $('goalFill').style.width = (100 * goalPos(state.score, tg)).toFixed(2) + '%';
  [...$('goalMarks').children].forEach((m, i) => {
    const was = m.classList.contains('on');
    m.classList.toggle('on', i < st);
    if (!was && i < st && state.goalShown === state.gameDay) { m.classList.remove('pop'); void m.offsetWidth; m.classList.add('pop'); }
  });
  state.goalShown = state.gameDay;
  const next = tg.find(t => t > state.score);
  $('goalNext').textContent = next ? fmtN(next) : 'Tamam!';
  $('goalRow').setAttribute('aria-label', `Günlük hedef: ${st} / 3 yıldız` + (next ? `, sonraki ${fmtN(next)}` : ''));
}

defineMode({
  id: 'daily', saveKey: DAILY_SAVE_KEY, button: 'playDaily', restartLabel: 'Günlüğü baştan dene',
  bodyClass: 'daily',
  hud: () => hudInfo({ best: fmtN(Math.max(dayBest(state.gameDay), state.score)), bestTitle: 'Bugünün en iyisi', goalRow: true }),
  afterMove({ now, midX }) {
    const db = dayBest(state.gameDay);
    if (state.score > db && !state.newRecord && db > 0) state.newRecord = true;
    dailyProgress(now, midX);
  },
  updateHud: updateGoal,
  overCard() {
    $('finalScore').textContent = fmtN(state.score);
    $('overTitle').textContent = 'Günlük · ' + fmtDay(state.gameDay);
    $('newRec').textContent = 'Bugünün rekoru!';
    $('newRec').hidden = !state.newRecord;
    $('overStars').hidden = false; $('share').hidden = false;
    $('again').textContent = 'Tekrar dene';
    const tg = dailyStart(state.gameDay).targets, st = starsFor(state.score, tg), dayStars = dayRec(state.gameDay).stars;
    paintStars($('overStars'), st, tg);
    const next = tg.find(t => t > state.score);
    $('overSub').textContent = `Bugünün en iyisi: ${fmtN(dayBest(state.gameDay))}` + (dayStars > st ? ` · ${dayStars} yıldız` : '');
    const sk = curStreak();
    $('overNote').textContent = next ? `Sonraki yıldız ${fmtN(next)} puanda.` + (sk ? ` Seri: ${sk} gün.` : '') : (sk ? `Seri: ${sk} gün. Yarın yeni tahta!` : 'Yarın yeni tahta!');
    $('overNote').hidden = false;
    resetShare();
  },
});
