/* ---------- DOM ---------- */
export const $ = id => document.getElementById(id);
export const stage = $('stage'), cv = $('cv'), ctx = cv.getContext('2d');
export const bgc = $('bg'), bctx = bgc.getContext('2d');
export const elScore = $('score'), elBest = $('best'), elCombo = $('combo');
export let metaTheme = document.querySelector('meta[name="theme-color"]');
if (!metaTheme) { metaTheme = document.createElement('meta'); metaTheme.name = 'theme-color'; document.head.appendChild(metaTheme); }
