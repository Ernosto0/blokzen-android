/* ---------- DOM ---------- */
export const $ = id => document.getElementById(id);
export const stage = $('stage'), cv = $('cv'), ctx = cv.getContext('2d');
export const bgc = $('bg'), bctx = bgc.getContext('2d');
export const flyc = $('fly'), fctx = flyc.getContext('2d'); // over the HUD: the score sparks fly up to the counter on it
export const elScore = $('score'), elBest = $('best'), elCombo = $('combo');
export let metaTheme = document.querySelector('meta[name="theme-color"]');
if (!metaTheme) { metaTheme = document.createElement('meta'); metaTheme.name = 'theme-color'; document.head.appendChild(metaTheme); }
