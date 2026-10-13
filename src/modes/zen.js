import { defineMode, hudInfo } from './registry.js';
import { state } from '../core/state.js';
import { fmtN } from '../ui/menu.js';

/* Zen: an endless, calm game with its own save. The dealer stays generous, there are no levels, and when no piece fits
   the board breathes out (its fullest lines clear quietly, no points) instead of ending. */
export const ZEN_SAVE_KEY = 'blokzen.zen.game';

defineMode({
  id: 'zen', saveKey: ZEN_SAVE_KEY, button: 'playZen', restartLabel: 'Zen tahtasını sıfırla',
  hud: () => hudInfo({ best: fmtN(state.gs.lines), bestTitle: 'Bu oturumda temizlenen sıra', icon: 'zen' }),
  volume: 0.75, levels: false, shake: false, records: false, countsGame: false, endless: true, fullCap: 5,
});
