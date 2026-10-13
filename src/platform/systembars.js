import { SystemBars, SystemBarsStyle } from '@capacitor/core';

/* ---------- Status and gesture bar icons ----------
   The page draws under the system bars (edge-to-edge), so their icons must contrast with the theme's background,
   not with the device's light/dark mode: light icons on dark themes, dark icons on light themes. */
const NATIVE = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
let current = null;
export function setBarsLight(light) {
  if (!NATIVE || light === current) return;
  current = light;
  try { SystemBars.setStyle({ style: light ? SystemBarsStyle.Light : SystemBarsStyle.Dark }).catch(() => {}); } catch (e) {}
}
