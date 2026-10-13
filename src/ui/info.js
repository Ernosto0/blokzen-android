import { T } from '../themes/catalog.js';
import { Sfx } from '../audio/sfx.js';
import { $ } from './dom.js';
import { state, earned } from '../core/state.js';
import { dayKey, fmtDur, stats } from '../themes/progress.js';
import { curStreak, daily, dayDate, dayShift, fmtDay, WEEKDAYS } from '../modes/daily.js';
import { LEVELS } from '../modes/puzzle-levels.js';
import { bestStars, puzSolved, puzTotalStars } from '../modes/puzzle.js';
import { STAR_SVG } from '../game/flow.js';
import { fmtN, menuOpen } from './menu.js';

function renderStats() {
  const wrap = $('statsBody'); wrap.textContent = '';
  const head = text => { const h = document.createElement('h3'); h.textContent = text; wrap.appendChild(h); };
  const group = (title, rows) => {
    head(title);
    const grid = document.createElement('div'); grid.className = 'stats';
    for (const [k, v, hi] of rows) {
      const d = document.createElement('div'); d.className = 'stat' + (hi ? ' hi' : '');
      const b = document.createElement('b'); b.textContent = v;
      const sp = document.createElement('span'); sp.textContent = k;
      d.append(b, sp); grid.appendChild(d);
    }
    wrap.appendChild(grid);
  };
  group('Genel', [
    ['En iyi skor', fmtN(Math.max(state.best, stats.bestScore)), true],
    ['Oynanan oyun', fmtN(stats.games)],
    ['Toplam puan', fmtN(stats.totalScore)],
    ['Yerleştirilen blok', fmtN(stats.totalPlaced)],
    ['Oynanan gün', fmtN(stats.daysPlayed)],
    ['Oyun süresi', fmtDur(stats.playSec)],
    ['Temizlenen sıra', fmtN(stats.totalLines)],
    ['En uzun kombo', fmtN(stats.bestCombo)],
    ['Tek hamlede en çok sıra', fmtN(stats.bestLines)],
    ['Tahta temizleme', fmtN(stats.totalFulls)],
    ['Bir oyunda en çok temizleme', fmtN(stats.bestFulls)],
    ['Açık temalar', `${earned.size}/${T}`],
  ]);
  group('Günlük meydan okuma', [
    ['Şu anki seri', `${fmtN(curStreak())} gün`, true],
    ['En uzun seri', `${fmtN(Math.max(daily.best, stats.dailyBestStreak))} gün`],
    ['Toplam yıldız', fmtN(stats.dailyStars)],
    ['Üç yıldızlı gün', fmtN(stats.dailyThree)],
    ['Katıldığın gün', fmtN(stats.dailyDays)],
    ['Günlük deneme', fmtN(stats.dailyGames)],
  ]);
  group('Zen', [
    ['Zen süresi', fmtDur(stats.zenSec), true],
    ['Temizlenen sıra', fmtN(stats.zenLines)],
    ['Hamle', fmtN(stats.zenMoves)],
    ['Nefes', fmtN(stats.zenBreaths)],
    ['Tahta temizleme', fmtN(stats.zenFulls)],
    ['En uzun nefessiz seri', `${fmtN(stats.zenBestRun)} hamle`],
  ]);
  group('Bulmaca', [
    ['Çözülen bölüm', `${puzSolved()} / ${LEVELS.length}`, true],
    ['Toplam yıldız', `${puzTotalStars()} / ${LEVELS.length * 3}`],
    ['Üç yıldızlı bölüm', fmtN(LEVELS.filter(l => bestStars(l.id) === 3).length)],
    ['Bulmaca süresi', fmtDur(stats.puzzleSec)],
    ['Tek hamlede en çok taş', fmtN(stats.puzzleBestGems)],
    ['Son parçayla biten bölüm', fmtN(stats.puzzleLast)],
    ['Kırılan taş', fmtN(stats.puzzleGemsTotal)],
    ['Tek denemede kusursuz', `${fmtN(stats.puzzleClean)} bölüm`],
  ]);
  head('Son 7 gün');
  const week = document.createElement('div'); week.className = 'week';
  const today = dayKey();
  for (let i = -6; i <= 0; i++) {
    const k = dayShift(today, i), rec = daily.days[k], n = rec ? rec.stars : 0;
    const d = document.createElement('div'); d.className = 'wday' + (i === 0 ? ' today' : '');
    const lb = document.createElement('span'); lb.textContent = WEEKDAYS[dayDate(k).getDay()];
    const ws = document.createElement('div'); ws.className = 'ws';
    ws.innerHTML = [0, 1, 2].map(j => STAR_SVG.replace('<svg ', `<svg class="${j < n ? 'on' : ''}" `)).join('');
    d.title = `${fmtDay(k)}: ` + (rec && rec.tries ? `${n} yıldız, en iyi ${fmtN(rec.best)}` : 'oynanmadı');
    d.setAttribute('aria-label', d.title);
    d.append(lb, ws); week.appendChild(d);
  }
  wrap.appendChild(week);
}
export function openInfo(kind) {
  Sfx.unlock(); Sfx.pick();
  const help = kind === 'help';
  $('infoTitle').textContent = help ? 'Nasıl oynanır' : 'İstatistikler';
  $('helpBody').hidden = !help; $('statsBody').hidden = help; $('helpTut').hidden = !help;
  if (!help) renderStats();
  $('info').hidden = false;
  $('infoClose').focus({ preventScroll: true });
}
export function closeInfo() {
  $('info').hidden = true;
  if (menuOpen) $('play').focus({ preventScroll: true });
}
$('infoClose').addEventListener('click', closeInfo);
$('info').addEventListener('click', e => { if (e.target.id === 'info') closeInfo(); });
