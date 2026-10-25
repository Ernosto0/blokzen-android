import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

// Run alongside the dev server. Preview saves stay in isolated browser contexts.
const output = resolve(process.env.UI_PREVIEW_DIR || 'test-results/ui-review');
const baseURL = process.env.PREVIEW_URL || 'http://localhost:4174';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
for (const [name, fixed] of [['dark', 0], ['light', 4]]) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, locale: 'tr-TR', reducedMotion: 'reduce' });
  await page.addInitScript(({fixed}) => {
    if (sessionStorage.getItem('preview')) return;
    new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.classList?.contains('toast')) setTimeout(() => n.dispatchEvent(new PointerEvent('pointerdown')), 20); }))).observe(document, { childList: true, subtree: true });
    localStorage.setItem('blokzen.tutorial', 'true');
    localStorage.setItem('blokzen.themes', JSON.stringify({v:2,disc:[0,3,4],fresh:[3],auto:false,fixed,block:'classic'}));
    localStorage.setItem('blokzen.puzzle', JSON.stringify({best:{'c1-01':3,'c1-02':2,'c1-03':3,'c1-04':1}}));
    localStorage.setItem('blokzen.stats', JSON.stringify({bestScore:28750,games:42,totalScore:184500,totalPlaced:2358,daysPlayed:12,playSec:4260,totalLines:61,dailyStars:18,dailyBestStreak:5}));
    const date = new Date(), day = date.getFullYear()*10000+(date.getMonth()+1)*100+date.getDate();
    localStorage.setItem('blokzen.daily', JSON.stringify({last:day,streak:3,best:5,days:{[day]:{stars:2,tries:1,best:28000}}}));
    sessionStorage.setItem('preview','1');
  }, {fixed});
  await page.goto(baseURL); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(350); await page.waitForFunction(() => !document.querySelector('#toasts .toast'));
  await page.locator('#menuTitle').click(); // capture the pointer view, without the initial keyboard focus ring
  await page.screenshot({path:`${output}/menu-${name}.png`});
  for (const [button, screen, close] of [['puzzleLevels','levels','lvClose'],['menuStats','stats','infoClose'],['menuHelp','help','infoClose'],['menuSettings','settings','setClose']]) {
    await page.click('#'+button); await page.waitForTimeout(250);
    await page.screenshot({path:`${output}/${screen}-${name}.png`});
    await page.click('#'+close);
  }
  await page.click('#menuThemes'); await page.waitForTimeout(250);
  await page.screenshot({path:`${output}/themes-${name}.png`});
  await page.click('#tcard-sunset'); await page.waitForTimeout(250);
  await page.screenshot({path:`${output}/theme-preview-${name}.png`}); await page.click('#detailClose');
  await page.click('#tcard-neon'); await page.waitForTimeout(250);
  await page.screenshot({path:`${output}/theme-locked-${name}.png`}); await page.click('#detailClose');
  await page.click('#galAppearance'); await page.locator('#galScroll').evaluate(el => { el.scrollTop = 0; }); await page.waitForTimeout(250);
  await page.screenshot({path:`${output}/theme-appearance-${name}.png`}); await page.click('#galClose');
  await page.setViewportSize({width:740,height:360}); await page.reload(); await page.waitForTimeout(350);
  await page.locator('#menuTitle').click();
  await page.screenshot({path:`${output}/menu-landscape-${name}.png`});
  await page.close();
}
await browser.close();
