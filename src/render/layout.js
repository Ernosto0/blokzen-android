import { N } from '../core/constants.js';
import { bgc, cv, stage } from '../ui/dom.js';
import { gemSprites, sprites } from './sprites.js';

/* ---------- Layout ---------- */
export let DPR = 1, W = 0, H = 0, L = {}, BW = 0, BH = 0, BDPR = 1;
export function layout() {
  const rect = stage.getBoundingClientRect();
  W = rect.width; H = rect.height;
  DPR = Math.min(window.devicePixelRatio || 1, 3);
  cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
  const B = Math.min(W, H / 1.46);
  const trayH = B * 0.42, gap = B * 0.04;
  const bx = (W - B) / 2, by = Math.max(0, (H - (B + gap + trayH)) / 2);
  const pad = B * 0.03, cell = (B - 2 * pad) / N;
  L = { B, bx, by, pad, cell, gx: bx + pad, gy: by + pad, trayY: by + B + gap, trayH, slotW: B / 3 };
  L.trayCell = Math.min(cell * 0.56, (L.slotW * 0.86) / 5, (trayH * 0.86) / 5);
  sprites.clear(); gemSprites.clear();
  BW = window.innerWidth; BH = window.innerHeight;
  BDPR = Math.min(window.devicePixelRatio || 1, 2);
  bgc.width = Math.round(BW * BDPR); bgc.height = Math.round(BH * BDPR);
}
