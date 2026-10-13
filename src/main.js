import './styles/fonts.css';
import './styles/main.css';

// Theme collections add their block looks, textures, backgrounds, particles and sounds to the shared registries.
import './themes/collections/third.js';
import './themes/collections/daily.js';
import './themes/collections/zen.js';
import './themes/collections/puzzle.js';

// Screens wire up their buttons when loaded.
import './game/input.js';
import './ui/menu.js';
import './ui/levels.js';
import './ui/info.js';
import './ui/settings.js';
import './ui/devmode.js';
import './ui/gallery.js';
import './ui/tutorial.js';

import { start } from './boot.js';

start();
