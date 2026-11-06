// Entry point of the app. Vite loads this file from index.html.
// Step 1: switches on the light/dark button.
// Later steps add the router (Step 3), languages (Step 2) and sign-in (Step 7).

import { initThemeToggle } from './lib/theme.js';

initThemeToggle(document.getElementById('theme-toggle'));
