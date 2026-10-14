import { THEMES } from '../themes/catalog.js';

/* ---------- Clear bursts by material ----------
   Every theme keeps its own sound kit; the burst laid under a clear comes from the material group the theme belongs to
   (assets/make-sfx.mjs synthesizes one boom-<group>.ogg per group). A new theme goes into one of these lists. */
export const BOOM_GROUPS = {
  wood: ['wood', 'forest', 'musicbox', 'picnic', 'library', 'domino', 'jigsaw', 'tangram', 'chess', 'autumn'],
  glass: ['glass', 'amethyst', 'snow', 'stained', 'iznik', 'tea', 'alchemy', 'cube', 'xmas'],
  stone: ['marble', 'tomb', 'zen', 'fossil', 'zeugma', 'zellige', 'talavera', 'desert', 'dunes', 'volcano', 'santorini'],
  metal: ['gold', 'clock', 'factory', 'observatory', 'cipher', 'train'],
  paper: ['origami', 'news', 'calendar', 'letter', 'detective', 'blueprint', 'chalk', 'graffiti'],
  soft: ['cozy', 'cloud', 'kawaii', 'gum', 'balloon', 'choco', 'persian', 'bojagi', 'batik'],
  water: ['ocean', 'coral', 'bubble', 'slime', 'honey', 'lavalamp', 'ebru', 'coffee', 'gelato', 'fruit', 'sushi'],
  electro: ['neon', 'retro', 'space', 'comet'],
  magic: ['dusk', 'sunset', 'sakura', 'aurora', 'moon', 'halloween', 'inkmount', 'rangoli'],
  drum: ['kente', 'andes', 'storm', 'spice', 'tropic', 'carnival'],
};
const GROUP_OF = Object.fromEntries(Object.entries(BOOM_GROUPS).flatMap(([g, ids]) => ids.map(id => [id, g])));
// the theme's sound settings carry their group, so the sound code can read it from Sfx.snd
THEMES.forEach(th => { th.snd.boom = GROUP_OF[th.id] || 'soft'; });
