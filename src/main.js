import './styles/fonts.css';
import './styles/main.css';

// Every theme registers its blocks, backgrounds, particles and sounds.
import './themes/register.js';

// Every game mode registers its flags and hooks.
import './modes/register.js';

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
