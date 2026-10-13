import { t } from '../i18n/index.js';

/* ---------- Task toasts: a card slides down from the top when a theme's task is done ----------
   It names the task and the theme it opened, so the theme change that follows has a reason. Several at once queue up. */
const box = document.createElement('div');
box.id = 'toasts'; box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite');
document.body.appendChild(box);
const queue = [];
let busy = false;
const SHOW = 3600;

export function taskToast(task, theme) {
  queue.push({ task, theme });
  if (!busy) next();
}
function next() {
  const it = queue.shift();
  if (!it) { busy = false; return; }
  busy = true;
  const el = document.createElement('div'); el.className = 'toast';
  const head = document.createElement('span'); head.className = 'toast-head'; head.textContent = t('Görev tamamlandı');
  const task = document.createElement('span'); task.className = 'toast-task'; task.textContent = it.task;
  const th = document.createElement('span'); th.className = 'toast-theme'; th.textContent = t('Yeni tema: {name}', { name: it.theme });
  el.append(head, task, th);
  box.appendChild(el);
  let gone = false;
  const close = () => { if (gone) return; gone = true; el.classList.add('out'); setTimeout(() => { el.remove(); next(); }, 260); };
  el.addEventListener('pointerdown', close); // a tap dismisses it early
  requestAnimationFrame(() => el.classList.add('in'));
  setTimeout(close, SHOW);
}
