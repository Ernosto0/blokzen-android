import { $ } from './dom.js';
import { state } from '../core/state.js';
import { resetConfirm } from '../game/input.js';
import { closeMenu, inProgress, menuOpen, openMenu } from './menu.js';
import { closeLevels } from './levels.js';
import { closeInfo } from './info.js';
import { closeSettings } from './settings.js';
import { closeGallery, closeThemeDetail } from './gallery.js';
import { endTutorial, tut } from './tutorial.js';

/* ---------- Going back ----------
   One step back, shared by the Escape key and the Android back button: the guide, then the open dialog, then the menu.
   Returns false when there is nothing left to go back to (the main menu), so the caller decides what that means. */
export function goBack() {
  if (state.drag) return true; // a piece is in the air: ignore
  if (tut) { endTutorial(); return true; }
  if (!$('levels').hidden) { closeLevels(); return true; }
  if (!$('info').hidden) { closeInfo(); return true; }
  if (!$('settings').hidden) { closeSettings(); return true; }
  if (!$('gallery').hidden) { if (closeThemeDetail()) return true; closeGallery(); return true; }
  if (menuOpen) return false;
  if ($('restart').classList.contains('confirm')) { resetConfirm(); return true; }
  openMenu();
  return true;
}
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (!goBack() && inProgress()) closeMenu(); // on the keyboard the menu also closes back to the game being played
});
