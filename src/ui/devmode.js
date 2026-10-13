import { Sfx } from '../audio/sfx.js';
import { buzz } from '../platform/haptics.js';
import { store } from '../core/store.js';
import { $ } from './dom.js';
import { state, DEV_KEY, discovered, settings, syncOpen, theme } from '../core/state.js';
import { autoTheme } from '../themes/progress.js';
import { saveMeta, setTheme } from '../themes/switching.js';
import { syncSettings } from './settings.js';
import { renderGallery } from './gallery.js';
import { t } from '../i18n/index.js';

/* ---------- Developer mode: tap the menu title 7 times to show every theme while building the game ---------- */
export function setDev(on) {
  state.devMode = on; store.set(DEV_KEY, on); syncOpen();
  if (!on) { // back to the real unlocks: leave any theme that is still locked
    if (!discovered.has(settings.fixed)) settings.fixed = 0;
    if (!discovered.has(theme.start)) theme.start = 0;
    if (!discovered.has(theme.cur)) setTheme(settings.auto ? autoTheme(theme.stage) : settings.fixed, performance.now(), { show: false, sound: false });
    saveMeta();
  }
  syncSettings();
  if (!$('gallery').hidden) renderGallery();
}
let devTaps = 0, devLast = 0, devMsgTimer = 0;
function devMsg(text) {
  const el = $('menuTag'); el.textContent = text;
  clearTimeout(devMsgTimer); devMsgTimer = setTimeout(() => { el.textContent = ''; }, 2200);
}
$('menuTitle').addEventListener('click', () => {
  const now = performance.now();
  devTaps = now - devLast < 1200 ? devTaps + 1 : 1; devLast = now;
  if (devTaps >= 7) { devTaps = 0; setDev(!state.devMode); devMsg(state.devMode ? t('Geliştirici modu açık: tüm temalar görünüyor') : t('Geliştirici modu kapandı')); buzz([12, 50, 12]); Sfx.unlock(); Sfx.pick(); }
  else if (devTaps >= 3) devMsg(t('Geliştirici modu için {n} dokunuş', { n: 7 - devTaps }));
});
