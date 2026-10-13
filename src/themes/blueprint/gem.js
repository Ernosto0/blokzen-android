import { GEM_LOOKS } from '../registry.js';

// a datum target from a technical drawing: a circle quartered, two quarters filled
function datum(g, x, y, r, col, lw) {
  g.beginPath(); g.moveTo(x, y); g.arc(x, y, r, -Math.PI / 2, 0); g.closePath(); g.fillStyle = col; g.fill();
  g.beginPath(); g.moveTo(x, y); g.arc(x, y, r, Math.PI / 2, Math.PI); g.closePath(); g.fill();
  g.strokeStyle = col; g.lineWidth = lw;
  g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.moveTo(x - r * 1.35, y); g.lineTo(x + r * 1.35, y); g.moveTo(x, y - r * 1.35); g.lineTo(x, y + r * 1.35); g.stroke();
}

Object.assign(GEM_LOOKS, {
  blueprint(g, s, th) { // a datum target, the reference every dimension is measured from
    g.beginPath(); g.arc(s / 2, s / 2, s * 0.36, 0, Math.PI * 2); g.fillStyle = 'rgba(10,30,60,.6)'; g.fill();
    datum(g, s / 2, s / 2, s * 0.24, th.accent, Math.max(1, s * 0.04));
  },
});
