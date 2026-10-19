import { OS_REDUCED, PREFS_KEY } from '../core/constants.js';
import { mode } from '../modes/registry.js';
import { Sfx } from '../audio/sfx.js';
import { buzz, CAN_VIBRATE, iosTick, prefs } from '../platform/haptics.js';
import { store } from '../core/store.js';
import { $ } from './dom.js';
import { state } from '../core/state.js';
import { resetConfirm, toggleMute } from '../game/input.js';
import { menuOpen } from './menu.js';
import { setDev } from './devmode.js';
import { t } from '../i18n/index.js';
import { CONTACT_EMAIL, PRIVACY_URL, STORE_URL } from '../core/links.js';

/* ---------- Settings ---------- */
function savePrefs() { store.set(PREFS_KEY, prefs); }
export function applyPrefs() {
  Sfx.setVol(prefs.vol / 100 * mode().volume); // zen plays a little quieter
  state.REDUCED = OS_REDUCED || prefs.lowFx;
  document.body.classList.toggle('lowfx', !!prefs.lowFx);
}
export function syncSettings() {
  $('optSound').checked = !Sfx.muted;
  $('optVol').value = prefs.vol; $('optVol').disabled = Sfx.muted;
  $('volVal').textContent = prefs.vol + '%';
  $('volRow').classList.toggle('off', Sfx.muted);
  $('optVib').checked = prefs.vib && CAN_VIBRATE; $('optVib').disabled = !CAN_VIBRATE;
  $('vibRow').classList.toggle('off', !CAN_VIBRATE);
  if (!CAN_VIBRATE) $('vibNote').textContent = t('Bu cihaz ya da tarayıcı titreşimi desteklemiyor');
  else if (iosTick) $('vibNote').textContent = t('Hamlelerde hafif dokunuş hissi (iOS 18 ve sonrası)');
  $('optLow').checked = prefs.lowFx;
  $('perfNote').hidden = !state.perf; // the automatic quality stepped down on this phone
  $('devGroup').hidden = !state.devMode; $('optDev').checked = state.devMode;
}
// About: version from package.json, the policy and contact links only when they are filled in (core/links.js)
$('aboutVer').textContent = t('Sürüm {v}', { v: __APP_VERSION__ });
if (STORE_URL) { $('aboutRate').href = STORE_URL; $('aboutRate').hidden = false; }
if (PRIVACY_URL) { $('aboutPrivacy').href = PRIVACY_URL; $('aboutPrivacy').hidden = false; }
if (CONTACT_EMAIL) { $('aboutContact').href = 'mailto:' + CONTACT_EMAIL; $('aboutContact').hidden = false; }
export function openSettings() {
  Sfx.unlock(); Sfx.pick();
  syncSettings();
  $('settings').hidden = false;
  $('setClose').focus({ preventScroll: true });
}
export function closeSettings() {
  $('settings').hidden = true;
  $(menuOpen ? 'menuSettings' : 'settingsBtn').focus({ preventScroll: true });
}
$('settingsBtn').addEventListener('click', () => { resetConfirm(); openSettings(); }); // the gear in the game's top row
$('setClose').addEventListener('click', closeSettings);
$('settings').addEventListener('click', e => { if (e.target.id === 'settings') closeSettings(); });
$('optSound').addEventListener('change', e => { if (e.target.checked === Sfx.muted) toggleMute(); });
$('optVol').addEventListener('input', e => {
  prefs.vol = e.target.value | 0; applyPrefs();
  $('volVal').textContent = prefs.vol + '%';
});
$('optVol').addEventListener('change', () => { savePrefs(); Sfx.unlock(); Sfx.place(); });
$('optVib').addEventListener('change', e => { prefs.vib = e.target.checked; savePrefs(); buzz(25); });
$('optLow').addEventListener('change', e => { prefs.lowFx = e.target.checked; applyPrefs(); savePrefs(); Sfx.pick(); });
$('optDev').addEventListener('change', e => { setDev(e.target.checked); Sfx.pick(); });
