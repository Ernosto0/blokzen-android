import { mixHex } from '../core/color.js';
import dusk from './dusk/theme.js';
import ocean from './ocean/theme.js';
import forest from './forest/theme.js';
import sunset from './sunset/theme.js';
import snow from './snow/theme.js';
import neon from './neon/theme.js';
import sakura from './sakura/theme.js';
import volcano from './volcano/theme.js';
import space from './space/theme.js';
import honey from './honey/theme.js';
import gold from './gold/theme.js';
import glass from './glass/theme.js';
import choco from './choco/theme.js';
import slime from './slime/theme.js';
import wood from './wood/theme.js';
import gum from './gum/theme.js';
import retro from './retro/theme.js';
import amethyst from './amethyst/theme.js';
import coffee from './coffee/theme.js';
import halloween from './halloween/theme.js';
import xmas from './xmas/theme.js';
import marble from './marble/theme.js';
import origami from './origami/theme.js';
import fruit from './fruit/theme.js';
import aurora from './aurora/theme.js';
import coral from './coral/theme.js';
import tomb from './tomb/theme.js';
import iznik from './iznik/theme.js';
import balloon from './balloon/theme.js';
import ebru from './ebru/theme.js';
import clock from './clock/theme.js';
import storm from './storm/theme.js';
import zen from './zen/theme.js';
import lavalamp from './lavalamp/theme.js';
import cloud from './cloud/theme.js';
import factory from './factory/theme.js';
import tropic from './tropic/theme.js';
import fossil from './fossil/theme.js';
import musicbox from './musicbox/theme.js';
import autumn from './autumn/theme.js';
import sushi from './sushi/theme.js';
import graffiti from './graffiti/theme.js';
import carnival from './carnival/theme.js';
import gelato from './gelato/theme.js';
import news from './news/theme.js';
import calendar from './calendar/theme.js';
import tea from './tea/theme.js';
import spice from './spice/theme.js';
import desert from './desert/theme.js';
import letter from './letter/theme.js';
import picnic from './picnic/theme.js';
import library from './library/theme.js';
import stained from './stained/theme.js';
import observatory from './observatory/theme.js';
import train from './train/theme.js';
import moon from './moon/theme.js';
import zeugma from './zeugma/theme.js';
import comet from './comet/theme.js';
import zellige from './zellige/theme.js';
import bojagi from './bojagi/theme.js';
import rangoli from './rangoli/theme.js';
import kente from './kente/theme.js';
import talavera from './talavera/theme.js';
import andes from './andes/theme.js';
import batik from './batik/theme.js';
import santorini from './santorini/theme.js';
import persian from './persian/theme.js';
import inkmount from './inkmount/theme.js';
import jigsaw from './jigsaw/theme.js';
import chalk from './chalk/theme.js';
import domino from './domino/theme.js';
import tangram from './tangram/theme.js';
import detective from './detective/theme.js';
import cipher from './cipher/theme.js';
import cube from './cube/theme.js';
import blueprint from './blueprint/theme.js';
import alchemy from './alchemy/theme.js';
import chess from './chess/theme.js';
import kawaii from './kawaii/theme.js';
import bubble from './bubble/theme.js';
import dunes from './dunes/theme.js';

/* ---------- Themes ---------- */
// The order is the index that saved games, unlock records and the gallery refer to: add new themes at the end.
export const THEMES = [
  dusk,
  ocean,
  forest,
  sunset,
  snow,
  neon,
  sakura,
  volcano,
  space,
  honey,
  gold,
  glass,
  choco,
  slime,
  wood,
  gum,
  retro,
  amethyst,
  coffee,
  halloween,
  xmas,
  marble,
  origami,
  fruit,
  aurora,
  coral,
  tomb,
  iznik,
  balloon,
  ebru,
  clock,
  storm,
  zen,
  lavalamp,
  cloud,
  factory,
  tropic,
  fossil,
  musicbox,
  autumn,
  sushi,
  graffiti,
  carnival,
  gelato,
  news,
  calendar,
  tea,
  spice,
  desert,
  letter,
  picnic,
  library,
  stained,
  observatory,
  train,
  moon,
  zeugma,
  comet,
  zellige,
  bojagi,
  rangoli,
  kente,
  talavera,
  andes,
  batik,
  santorini,
  persian,
  inkmount,
  jigsaw,
  chalk,
  domino,
  tangram,
  detective,
  cipher,
  cube,
  blueprint,
  alchemy,
  chess,
  kawaii,
  bubble,
  dunes,
];
// derived fields: clear effect, outline and surface colors
THEMES.forEach(th => {
  th.stroke = th.stroke || th.board;
  th.surface = th.light ? mixHex(th.glow, th.bg, 0.25) : mixHex(th.bg, th.fg, 0.07);
});
export const T = THEMES.length;
// Score needed to reach level/theme stage k within one game: 800, 2000, 3600, 5600, 8000, ...
export const milestone = k => 200 * k * (k + 3);
export const stageAt = s => { let k = 0; while (s >= milestone(k + 1)) k++; return k; };
