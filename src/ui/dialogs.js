import { $ } from './dom.js';

// Keep keyboard navigation and assistive technology in the foremost screen.
// The board lives inside #app; the full-screen dialogs are its siblings.
const roots = ['menu', 'gallery', 'settings', 'info', 'levels'].map($);
const lastFocus = new WeakMap();
const visibleDialog = () => ['themeDetail', 'levels', 'info', 'settings', 'gallery', 'menu'].map($).find(el => !el.hidden && !el.closest('[hidden]'));
const focusable = el => [...el.querySelectorAll('button, a[href], input, summary, [tabindex="0"]')].filter(node => !node.disabled && !node.closest('[hidden], [inert]') && node.getClientRects().length);
function syncDialogs() {
  const top = visibleDialog();
  for (const el of [$('app'), ...roots]) el.inert = !!top && el !== top && !el.contains(top);
  if (top && (!top.contains(document.activeElement) || !document.activeElement.getClientRects().length)) {
    const saved = lastFocus.get(top);
    (saved?.isConnected && !saved.closest('[hidden], [inert]') ? saved : focusable(top)[0])?.focus({ preventScroll: true });
  }
}
for (const el of [...roots, $('themeDetail')]) new MutationObserver(syncDialogs).observe(el, { attributes: true, attributeFilter: ['hidden'] });
document.addEventListener('focusin', e => { const top = visibleDialog(); if (top?.contains(e.target)) lastFocus.set(top, e.target); });
document.addEventListener('keydown', e => {
  if (e.key !== 'Tab') return;
  const top = visibleDialog(); if (!top) return;
  const nodes = focusable(top), first = nodes[0], last = nodes.at(-1);
  if (!first) { e.preventDefault(); return; }
  if (!top.contains(document.activeElement) || (e.shiftKey ? document.activeElement === first : document.activeElement === last)) {
    e.preventDefault(); (e.shiftKey ? last : first).focus();
  }
});
