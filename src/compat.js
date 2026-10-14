/* ---------- Old WebView safety net ----------
   Imported first. Android WebViews that were never updated lack some newer built-ins, and a missing one at boot leaves a blank
   game screen with no menu. Fill in what the game uses, and show the error on screen instead of a silent blank page. */
if (!Object.hasOwn) Object.hasOwn = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
if (window.CanvasRenderingContext2D && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    r = Math.min(Array.isArray(r) ? r[0] : r || 0, w / 2, h / 2);
    this.moveTo(x + r, y); this.arcTo(x + w, y, x + w, y + h, r); this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r); this.arcTo(x, y, x + w, y, r); this.closePath();
  };
}
let shown = false;
function report(msg) {
  if (shown || !document.body) return;
  shown = true;
  const d = document.createElement('div');
  d.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;padding:10px 12px;border-radius:12px;background:#3b1020;color:#fff;font:12px/1.35 monospace;white-space:pre-wrap;word-break:break-word;max-height:40vh;overflow:auto';
  d.textContent = 'Blokzen error: ' + msg;
  document.body.appendChild(d);
}
window.addEventListener('error', e => report((e.message || 'unknown') + (e.lineno ? ' @' + e.lineno + ':' + e.colno : '')));
window.addEventListener('unhandledrejection', e => report(String(e.reason && e.reason.message || e.reason)));
