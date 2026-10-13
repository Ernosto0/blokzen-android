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
import { t } from '../i18n/index.js';

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
  group(t('Genel'), [
    [t('En iyi skor'), fmtN(Math.max(state.best, stats.bestScore)), true],
    [t('Oynanan oyun'), fmtN(stats.games)],
    [t('Toplam puan'), fmtN(stats.totalScore)],
    [t('Yerleştirilen blok'), fmtN(stats.totalPlaced)],
    [t('Oynanan gün'), fmtN(stats.daysPlayed)],
    [t('Oyun süresi'), fmtDur(stats.playSec)],
    [t('Temizlenen sıra'), fmtN(stats.totalLines)],
    [t('En uzun kombo'), fmtN(stats.bestCombo)],
    [t('Tek hamlede en çok sıra'), fmtN(stats.bestLines)],
    [t('Tahta temizleme'), fmtN(stats.totalFulls)],
    [t('Bir oyunda en çok temizleme'), fmtN(stats.bestFulls)],
    [t('Açık temalar'), `${earned.size}/${T}`],
  ]);
  group(t('Günlük meydan okuma'), [
    [t('Şu anki seri'), t('{n} gün', { n: fmtN(curStreak()) }), true],
    [t('En uzun seri'), t('{n} gün', { n: fmtN(Math.max(daily.best, stats.dailyBestStreak)) })],
    [t('Toplam yıldız'), fmtN(stats.dailyStars)],
    [t('Üç yıldızlı gün'), fmtN(stats.dailyThree)],
    [t('Katıldığın gün'), fmtN(stats.dailyDays)],
    [t('Günlük deneme'), fmtN(stats.dailyGames)],
  ]);
  group(t('Zen'), [
    [t('Zen süresi'), fmtDur(stats.zenSec), true],
    [t('Temizlenen sıra'), fmtN(stats.zenLines)],
    [t('Hamle'), fmtN(stats.zenMoves)],
    [t('Nefes'), fmtN(stats.zenBreaths)],
    [t('Tahta temizleme'), fmtN(stats.zenFulls)],
    [t('En uzun nefessiz seri'), t('{n} hamle', { n: fmtN(stats.zenBestRun) })],
  ]);
  group(t('Bulmaca'), [
    [t('Çözülen bölüm'), `${puzSolved()} / ${LEVELS.length}`, true],
    [t('Toplam yıldız'), `${puzTotalStars()} / ${LEVELS.length * 3}`],
    [t('Üç yıldızlı bölüm'), fmtN(LEVELS.filter(l => bestStars(l.id) === 3).length)],
    [t('Bulmaca süresi'), fmtDur(stats.puzzleSec)],
    [t('Tek hamlede en çok taş'), fmtN(stats.puzzleBestGems)],
    [t('Son parçayla biten bölüm'), fmtN(stats.puzzleLast)],
    [t('Kırılan taş'), fmtN(stats.puzzleGemsTotal)],
    [t('Tek denemede kusursuz'), t('{n} bölüm', { n: fmtN(stats.puzzleClean) })],
  ]);
  head(t('Son 7 gün'));
  const week = document.createElement('div'); week.className = 'week';
  const today = dayKey();
  for (let i = -6; i <= 0; i++) {
    const k = dayShift(today, i), rec = daily.days[k], n = rec ? rec.stars : 0;
    const d = document.createElement('div'); d.className = 'wday' + (i === 0 ? ' today' : '');
    const lb = document.createElement('span'); lb.textContent = WEEKDAYS[dayDate(k).getDay()];
    const ws = document.createElement('div'); ws.className = 'ws';
    ws.innerHTML = [0, 1, 2].map(j => STAR_SVG.replace('<svg ', `<svg class="${j < n ? 'on' : ''}" `)).join('');
    d.title = `${fmtDay(k)}: ` + (rec && rec.tries ? t('{n} yıldız, en iyi {b}', { n, b: fmtN(rec.best) }) : t('oynanmadı'));
    d.setAttribute('aria-label', d.title);
    d.append(lb, ws); week.appendChild(d);
  }
  wrap.appendChild(week);
}
export function openInfo(kind) {
  Sfx.unlock(); Sfx.pick();
  const help = kind === 'help';
  $('infoTitle').textContent = help ? t('Nasıl oynanır') : t('İstatistikler');
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
