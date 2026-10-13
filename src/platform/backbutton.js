import { App } from '@capacitor/app';
import { goBack } from '../ui/back.js';

/* ---------- Android back button / back gesture ----------
   Step back like Escape does; from the main menu, send the app to the background (not quit) as Android apps do. */
if (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) {
  App.addListener('backButton', () => { if (!goBack()) App.minimizeApp(); });
}
