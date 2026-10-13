// Lists every Turkish string that has no English entry: node tests/i18n-check.mjs (npm run check:i18n). Exits 1 when any is missing.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import EN, { HELP_EN } from '../src/i18n/en.js';
import { THEMES } from '../src/themes/catalog.js';
import { LEVELS, PUZZLE_GROUPS } from '../src/modes/puzzle-levels.js';

const need = new Map(); // key → where it came from
const want = (k, where) => { if (k && !need.has(k)) need.set(k, where); };
const unesc = s => s.replace(/\\(['"\\])/g, '$1');

const files = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) { if (f !== 'i18n') walk(p); } else if (p.endsWith('.js')) files.push(p); } })('src');
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  for (const m of src.matchAll(/\bt\(\s*(['"])((?:\\.|(?!\1)[^\\\n])*)\1/g)) want(unesc(m[2]), f);
  for (const m of src.matchAll(/\b(?:bestTitle|restartLabel|spent):\s*(['"])((?:\\.|(?!\1)[^\\\n])*)\1/g)) want(unesc(m[2]), f);
}
const tut = readFileSync('src/ui/tutorial.js', 'utf8');
for (const m of tut.matchAll(/\b(?:title|text):\s*'((?:\\.|[^'\\\n])*)'/g)) want(unesc(m[1]), 'tutorial');

for (const th of THEMES) { want(th.name, 'theme ' + th.id); if (th.unlock) want(th.unlock.text, 'theme ' + th.id); if (th.finale) want(th.finale, 'theme ' + th.id); }
for (const g of PUZZLE_GROUPS) want(g.name, 'group ' + g.id);
for (const l of LEVELS) want(l.title, 'level ' + l.id);

const html = readFileSync('src/index.html', 'utf8').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<svg[\s\S]*?<\/svg>/g, '');
const helpBody = html.match(/<ol class="rules" id="helpBody">([\s\S]*?)<\/ol>/)[1];
const helpN = (helpBody.match(/<li>/g) || []).length;
if (helpN !== HELP_EN.length) need.set(`(help list: ${helpN} rules in index.html, ${HELP_EN.length} in HELP_EN)`, 'index.html');
const page = html.replace(helpBody, '');
for (const m of page.matchAll(/(?:aria-label|title)="([^"]+)"/g)) want(m[1], 'index.html attr');
for (const m of page.replace(/<[^>]*>/g, '\n').split('\n')) { const s = m.trim(); if (s && /\p{L}{2}/u.test(s)) want(s, 'index.html'); }

const SKIP = new Set(['Blokzen', 'Zen']); // the same in both languages
const missing = [...need].filter(([k]) => EN[k] === undefined && !SKIP.has(k) && !/^[\d\s/%×:+.,-]+$/.test(k));
for (const [k, w] of missing) console.log(`${w}: ${k}`);
console.log(`checked ${need.size} strings`);
console.log(missing.length ? `\n${missing.length} string(s) without an English entry` : 'All strings have an English entry');
process.exit(missing.length ? 1 : 0);
