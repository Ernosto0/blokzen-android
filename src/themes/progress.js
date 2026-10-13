import { THEMES } from './catalog.js';
import { Sfx } from '../audio/sfx.js';
import { buzz } from '../platform/haptics.js';
import { state, discovered, earned, fresh, settings, theme } from '../core/state.js';
import { LEVELS } from '../modes/puzzle-levels.js';
import { burst, saveMeta } from './switching.js';

/* ---------- Theme unlocks: every theme except the first has a task and stays locked until it is done.
   Tasks are spaced so a new theme opens every game or two at first, then every few sessions; the running totals
   (games, total score, blocks, lines) mean steady play always moves some bar forward. ---------- */
export const STATS_KEY = 'blokzen.stats';
export const UNLOCKS = {
  ocean:   { text: 'Tek oyunda 2.500 puan yap', goal: 2500, val: s => s.bestScore },
  forest:  { text: "Bir oyunda 4'lü kombo yap", goal: 4, val: s => s.bestCombo },
  sunset:  { text: 'Tek hamlede 3 sıra temizle', goal: 3, val: s => s.bestLines },
  snow:    { text: 'Tahtayı tamamen temizle', goal: 1, val: s => s.totalFulls },
  neon:    { text: 'Toplam 150 sıra temizle', goal: 150, val: s => s.totalLines },
  sakura:  { text: 'Tek oyunda 25.000 puan yap', goal: 25000, val: s => s.bestScore },
  volcano: { text: 'Bir oyunda tahtayı 3 kez temizle', goal: 3, val: s => s.bestFulls },
  space:   { text: 'Tek oyunda 100.000 puan yap', goal: 100000, val: s => s.bestScore },
  honey:   { text: 'Toplam 10 oyun oyna', goal: 10, val: s => s.games },
  gold:    { text: 'Toplamda 50.000 puan topla', goal: 50000, val: s => s.totalScore },
  glass:   { text: 'Toplam 500 blok yerleştir', goal: 500, val: s => s.totalPlaced },
  choco:   { text: "Bir oyunda 6'lı kombo yap", goal: 6, val: s => s.bestCombo },
  slime:   { text: 'Tek oyunda 150 hamle yap', goal: 150, val: s => s.bestMoves },
  wood:    { text: 'Toplam 25 oyun oyna', goal: 25, val: s => s.games },
  gum:     { text: 'Toplam 400 sıra temizle', goal: 400, val: s => s.totalLines },
  retro:   { text: 'Tek hamlede 4 sıra temizle', goal: 4, val: s => s.bestLines },
  amethyst:{ text: 'Toplamda 250.000 puan topla', goal: 250000, val: s => s.totalScore },
  coffee:  { text: 'Tahtayı toplam 10 kez temizle', goal: 10, val: s => s.totalFulls },
  halloween:{ text: 'Toplam 2.000 blok yerleştir', goal: 2000, val: s => s.totalPlaced },
  xmas:    { text: "Bir oyunda 8'li kombo yap", goal: 8, val: s => s.bestCombo },
  marble:  { text: 'Toplam 50 oyun oyna', goal: 50, val: s => s.games },
  origami: { text: 'Toplam 1.000 sıra temizle', goal: 1000, val: s => s.totalLines },
  fruit:   { text: 'Toplamda 1.000.000 puan topla', goal: 1000000, val: s => s.totalScore },
  aurora:  { text: '7 farklı günde oyna', goal: 7, val: s => s.daysPlayed },
  coral:   { text: 'Bir oyunda 10 kez tek hamlede 2+ sıra temizle', goal: 10, val: s => s.bestMulti },
  tomb:    { text: 'Bir oyunda tahtayı 5 kez temizle', goal: 5, val: s => s.bestFulls },
  iznik:   { text: 'Tek hamlede 3+ sırayı 50 kez temizle', goal: 50, val: s => s.total3 },
  balloon: { text: 'Sabah 05:00 ile 09:00 arası bir oyun bitir', goal: 1, val: s => s.morningGames },
  ebru:    { text: '10 farklı temada oyun bitir', goal: 10, val: s => s.themesDone },
  clock:   { text: 'Tek oyunda 300 hamle yap', goal: 300, val: s => s.bestMoves },
  storm:   { text: 'Tek hamlede 5 sıra temizle', goal: 5, val: s => s.bestLines },
  zen:     { text: 'Toplam 3 saat oyna', goal: 180, val: s => Math.floor(s.playSec / 60), fmt: (h, g) => `${h} / ${g} dk` },
  lavalamp:{ text: 'Toplam 75 oyun oyna', goal: 75, val: s => s.games },
  cloud:   { text: 'Tahta yarıyı geçmeden tek oyunda 100 hamle yap', goal: 100, val: s => s.bestCalm },
  factory: { text: 'Toplam 5.000 blok yerleştir', goal: 5000, val: s => s.totalPlaced },
  tropic:  { text: 'Tahtayı toplam 25 kez temizle', goal: 25, val: s => s.totalFulls },
  fossil:  { text: 'Toplamda 3.000.000 puan topla', goal: 3000000, val: s => s.totalScore },
  musicbox:{ text: "Bir oyunda 10'lu kombo yap", goal: 10, val: s => s.bestCombo },
  autumn:  { text: 'Toplam 2.500 sıra temizle', goal: 2500, val: s => s.totalLines },
  sushi:   { text: 'Art arda 3 oyunda 10.000+ puan yap', goal: 3, val: s => s.bestStreak10k },
  graffiti:{ text: 'Tek oyunda 50.000 puan yap', goal: 50000, val: s => s.bestScore },
  carnival:{ text: 'Tek oyunda 250.000 puan yap', goal: 250000, val: s => s.bestScore },
  gelato:  { text: 'Bir günde 5 oyun oyna', goal: 5, val: s => s.bestDayGames },
  // daily collection
  news:    { text: 'Günlükte ilk yıldızını al', goal: 1, val: s => s.dailyStars, daily: true },
  calendar:{ text: 'Günlükte 3 günlük seri yap', goal: 3, val: s => s.dailyBestStreak, fmt: (h, g) => `${h} / ${g} gün`, daily: true },
  tea:     { text: 'Günlükte sabah 05:00 ile 09:00 arası yıldız al', goal: 1, val: s => s.dailyMorning, daily: true },
  spice:   { text: 'Günlükte 7 günlük seri yap', goal: 7, val: s => s.dailyBestStreak, fmt: (h, g) => `${h} / ${g} gün`, daily: true },
  desert:  { text: 'Günlükte bir günün ilk denemesinde 3 yıldız al', goal: 1, val: s => s.dailyFirst3, daily: true },
  letter:  { text: 'Günlükte 5 farklı günde önceki günün en iyi skorunu geç', goal: 5, val: s => s.dailyBeat, daily: true },
  picnic:  { text: 'Günlükte aynı hafta sonu hem cumartesi hem pazar yıldız al', goal: 1, val: s => s.dailyWeekend, daily: true },
  library: { text: 'Günlükte gece 22:00 ile 02:00 arası yıldız al', goal: 1, val: s => s.dailyNight, daily: true },
  stained: { text: 'Günlükte bir oyunda tahtayı 2 kez tamamen temizle', goal: 2, val: s => s.dailyBestFulls, daily: true },
  observatory: { text: 'Günlükte 5 farklı günde 3 yıldız al', goal: 5, val: s => s.dailyThree, fmt: (h, g) => `${h} / ${g} gün`, daily: true },
  train:   { text: 'Günlükte 14 günlük seri yap', goal: 14, val: s => s.dailyBestStreak, fmt: (h, g) => `${h} / ${g} gün`, daily: true },
  moon:    { text: 'Günlüğü 28 farklı günde oyna', goal: 28, val: s => s.dailyDays, fmt: (h, g) => `${h} / ${g} gün`, daily: true },
  zeugma:  { text: 'Günlükte toplam 50 yıldız topla', goal: 50, val: s => s.dailyStars, daily: true },
  comet:   { text: 'Günlükte 30 günlük seri yap. Koleksiyonun finali', goal: 30, val: s => s.dailyBestStreak, fmt: (h, g) => `${h} / ${g} gün`, daily: true },
  // zen collection: tasks done only by playing Zen, calm ones that reward time and patience
  zellige: { text: "Zen'de toplam 15 dakika oyna", goal: 15, val: s => Math.floor(s.zenSec / 60), fmt: (h, g) => `${h} / ${g} dk`, zen: true },
  bojagi:  { text: "Zen'de tahta 25 kez nefes alsın", goal: 25, val: s => s.zenBreaths, zen: true },
  rangoli: { text: "Zen'de sabah 05:00 ile 10:00 arası toplam 20 dakika oyna", goal: 20, val: s => Math.floor(s.zenMorningSec / 60), fmt: (h, g) => `${h} / ${g} dk`, zen: true },
  kente:   { text: "Zen'de toplam 300 sıra temizle", goal: 300, val: s => s.zenLines, zen: true },
  talavera:{ text: "Zen'de tahtayı toplam 5 kez tamamen temizle", goal: 5, val: s => s.zenFulls, zen: true },
  andes:   { text: "Zen'de art arda 150 hamle boyunca tahta yarıyı geçmesin", goal: 150, val: s => s.zenBestCalm, zen: true },
  batik:   { text: "Zen'de hiç nefes almadan art arda 200 hamle yap", goal: 200, val: s => s.zenBestRun, zen: true },
  santorini:{ text: "Zen'de akşam 19:00 ile 23:00 arası toplam 45 dakika oyna", goal: 45, val: s => Math.floor(s.zenEveningSec / 60), fmt: (h, g) => `${h} / ${g} dk`, zen: true },
  persian: { text: "Zen'de toplam 3 saat oyna", goal: 180, val: s => Math.floor(s.zenSec / 60), fmt: (h, g) => `${h} / ${g} dk`, zen: true },
  inkmount:{ text: "Zen'de toplam 1.000 sıra temizle. Koleksiyonun finali", goal: 1000, val: s => s.zenLines, zen: true },
  // puzzle collection: tasks done only by solving levels, each one asks for a different kind of cleverness
  jigsaw:  { text: 'Bulmacada ilk bölümünü bitir', goal: 1, val: s => s.puzzleWins, puzzle: true },
  chalk:   { text: 'Bulmacada kaybettiğin 3 farklı bölümü sonradan 3 yıldızla bitir', goal: 3, val: s => s.puzzleBack, puzzle: true },
  domino:  { text: 'Bulmacada tek hamlede 3 taşı birden temizle', goal: 3, val: s => s.puzzleBestGems, fmt: (h, g) => `${h} / ${g} taş`, puzzle: true },
  tangram: { text: 'Bulmacada dört hedef türünün her birinde bir bölümü 3 yıldızla bitir', goal: 4, val: s => s.puzzleTypes3, fmt: (h, g) => `${h} / ${g} tür`, puzzle: true },
  detective:{ text: 'Bulmacada bir bölümü son parçayla, elinde hiç parça kalmadan bitir', goal: 1, val: s => s.puzzleLast, puzzle: true },
  cipher:  { text: 'Bulmacada 5 bölümü tek denemede, hiç geri almadan 3 yıldızla çöz', goal: 5, val: s => s.puzzleClean, fmt: (h, g) => `${h} / ${g} bölüm`, puzzle: true },
  cube:    { text: 'Bulmacada tek hamlede bir satırı ve bir sütunu birlikte temizle, 5 kez', goal: 5, val: s => s.puzzleCross, puzzle: true },
  blueprint:{ text: "Bulmacada 'tahtayı boşalt' bölümlerinin hepsini 3 yıldızla bitir", goal: 4, val: s => s.puzzleClear3, fmt: (h, g) => `${h} / ${g} bölüm`, puzzle: true },
  alchemy: { text: 'Bulmacada toplam 50 taş kır', goal: 50, val: s => s.puzzleGemsTotal, fmt: (h, g) => `${h} / ${g} taş`, puzzle: true },
  chess:   { text: 'Bulmacada bütün bölümleri 3 yıldızla bitir. Koleksiyonun finali', goal: 60, val: s => s.puzzleStars, fmt: (h, g) => `${h} / ${g} yıldız`, puzzle: true },
};
// the last theme of a collection gets a bigger moment when it opens
export const FINALES = { comet: 'GÜNLÜK KOLEKSİYON FİNALİ', inkmount: 'ZEN KOLEKSİYONU FİNALİ', chess: 'BULMACA KOLEKSİYONU FİNALİ' };
// themes that were open from the start before version 2 of the theme meta; older saves lose them until the task is done
export const META_V = 2;
export const NEW_TASKS = ['honey', 'gold', 'glass', 'choco', 'slime', 'wood', 'gum', 'retro', 'amethyst', 'coffee', 'halloween', 'xmas', 'marble', 'origami', 'fruit'];
export let stats = { bestScore: 0, bestCombo: 0, bestLines: 0, totalFulls: 0, totalLines: 0, bestFulls: 0, games: 0, totalScore: 0, totalPlaced: 0, bestMoves: 0,
  daysPlayed: 0, lastDay: 0, todayGames: 0, bestDayGames: 0, bestMulti: 0, total3: 0, morningGames: 0, themesDone: 0, playSec: 0, bestCalm: 0, streak10k: 0, bestStreak10k: 0,
  dailyGames: 0, dailyDays: 0, dailyStars: 0, dailyThree: 0, dailyBestStreak: 0, dailyMorning: 0, dailyFirst3: 0, dailyBeat: 0, dailyWeekend: 0, dailyNight: 0, dailyBestFulls: 0,
  zenMoves: 0, zenLines: 0, zenBreaths: 0, zenSec: 0, zenSessions: 0, zenFulls: 0, zenMorningSec: 0, zenEveningSec: 0, zenBestCalm: 0, zenBestRun: 0,
  puzzlePlaced: 0, puzzleLines: 0, puzzleSec: 0, puzzleWins: 0, puzzleTries: 0, // puzzle keeps its own counters: they move only the puzzle collection's tasks
  puzzleBack: 0, puzzleBestGems: 0, puzzleTypes3: 0, puzzleLast: 0, puzzleClean: 0, puzzleCross: 0, puzzleClear3: 0, puzzleGemsTotal: 0, puzzleStars: 0 };
// per-game counters for tasks measured inside one game (saved with the game). Zen only: lines cleared this session,
// zcalm: moves in a row with the board at most half full, zrun: moves since the board last took a breath

export const DONE_KEY = 'blokzen.themesDone';
export let themesDone = new Set(); // themes a game has been finished in

export const dayKey = () => { const d = new Date(); return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); };
let hourAt = -1e9, hourVal = 0; // the hour of day, looked up at most every few seconds (time-of-day zen tasks)
export const hourNow = () => { const n = performance.now(); if (n - hourAt > 5000) { hourAt = n; hourVal = new Date().getHours(); } return hourVal; };
export function touchDay() { const k = dayKey(); if (stats.lastDay !== k) { stats.lastDay = k; stats.daysPlayed++; stats.todayGames = 0; } }
export const fmtDur = sec => { const m = Math.floor(sec / 60); return m >= 60 ? `${Math.floor(m / 60)} sa ${m % 60} dk` : `${m} dk`; };
const isLocked = i => !earned.has(i);
// a theme opened on a puzzle win card waits there and is celebrated on the next board
let heldUnlock = null;
export function playHeldUnlock(now) {
  if (!heldUnlock) return;
  const { i, finale } = heldUnlock; heldUnlock = null;
  celebrateUnlock(i, finale, now);
}
// unlock every theme whose task is done; celebrate the first new one
export function checkUnlocks(now) {
  const got = [];
  THEMES.forEach((th, i) => {
    const u = UNLOCKS[th.id];
    if (u && isLocked(i) && u.val(stats) >= u.goal) { earned.add(i); fresh.add(i); got.push(i); }
  });
  if (!got.length) return;
  saveMeta();
  const fin = got.find(j => FINALES[THEMES[j].id]), finale = fin !== undefined; // a collection's last theme gets a bigger moment
  const i = finale ? fin : got[0];
  if (state.mode === 'puzzle') { // a level never changes theme halfway: the end card names it and the next board celebrates it
    heldUnlock = { i, finale };
    if (state.puz.gems) state.puz.opened.push(...got.map(j => THEMES[j].name));
    return;
  }
  celebrateUnlock(i, finale, now);
}
function celebrateUnlock(i, finale, now) {
  if (settings.auto) state.pendingTheme = { i, at: now + 700, unlocked: true, finale }; // auto mode moves straight to the new theme
  else {
    state.banner = { name: THEMES[i].name, sub: finale ? FINALES[THEMES[i].id] : 'YENİ TEMA AÇILDI', t0: now + 700, dur: finale ? 3600 : 2300 };
    setTimeout(() => { burst(performance.now()); Sfx.themeChange(); buzz([12, 50, 12]); }, 650);
  }
  if (finale) setTimeout(() => {
    for (let k = 0; k < 4; k++) setTimeout(() => burst(performance.now()), k * 380);
    state.flash = { t0: performance.now() };
    Sfx.fullClear(); buzz([30, 40, 30, 40, 80]);
  }, 1100);
}
// in auto mode the theme steps through the open themes as the score passes each milestone
export function autoTheme(st) {
  const order = [...discovered].sort((a, b) => a - b);
  const k = Math.max(0, order.indexOf(theme.start));
  return order[(k + st) % order.length];
}

export const TH = () => THEMES[theme.cur];

// two puzzle tasks are measured against the level list itself, so they follow it if levels are added
UNLOCKS.blueprint.goal = LEVELS.filter(l => l.goal.type === 'clear').length;
UNLOCKS.chess.goal = LEVELS.length * 3;
