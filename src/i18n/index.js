import EN, { HELP_EN } from './en.js';

/* ---------- Language ----------
   Turkish is the source language: every visible Turkish string in the code is its own key, and English is looked up in en.js.
   The app speaks Turkish when the device is set to Turkish (or to a Turkish region), English everywhere else. */
const tag = ((navigator.languages && navigator.languages[0]) || navigator.language || '').toLowerCase();
export const lang = tag.startsWith('tr') || /[-_]tr$/.test(tag) ? 'tr' : 'en';
export const LOCALE = lang === 'tr' ? 'tr-TR' : 'en-US'; // number formatting

// t('Seviye {n}', { n: 3 }). A dictionary entry may be [one, other], picked by vars.n.
export function t(tr, vars) {
  let s = tr;
  if (lang === 'en') {
    const e = EN[tr];
    s = e === undefined ? tr : Array.isArray(e) ? (vars && +vars.n === 1 ? e[0] : e[1]) : e;
  }
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  return s;
}
export const fmtNum = (n, opts) => n.toLocaleString(LOCALE, opts);
// "3 / 10 taş" style progress: the number part stays, the unit word is translated
export const tUnit = s => lang === 'tr' ? s : s.replace(/ ([^\d\s/][^\d/]*)$/, (m, w) => ' ' + t(w));

const ATTRS = ['aria-label', 'title'];
function walk(el) {
  for (const a of ATTRS) { const v = el.getAttribute(a); if (v && EN[v] !== undefined) el.setAttribute(a, EN[v]); }
  for (const n of el.childNodes) {
    if (n.nodeType === 3) { const s = n.nodeValue.trim(); if (s && EN[s] !== undefined) n.nodeValue = n.nodeValue.replace(s, EN[s]); }
    else if (n.nodeType === 1) walk(n);
  }
}
// Translates the static markup of index.html once, at start
export function translatePage() {
  document.documentElement.lang = lang; // also decides the casing of uppercase labels (Turkish i → İ)
  if (lang === 'tr') return;
  document.title = 'Blokzen';
  walk(document.body);
  document.querySelectorAll('#helpBody [data-rule]').forEach(el => { const rule = HELP_EN[+el.dataset.rule]; if (rule) el.innerHTML = rule; });
}
