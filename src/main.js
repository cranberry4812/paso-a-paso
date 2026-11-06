// Entry point of the app. Vite loads this file from index.html.
// Step 1: light/dark switch.
// Step 2: language switch, and pages drawn from the content files.
// Step 3 adds the router (one page at a time) and the other public pages.

import { initThemeToggle } from './lib/theme.js';
import { onLangChange, setLang, t, translateStatic } from './lib/i18n.js';
import { renderHome } from './pages/home.js';
import { renderMissions } from './pages/missions.js';

const app = document.getElementById('app');

/** Draws the page content. Called at start and after every language change. */
function render() {
  try {
    app.replaceChildren(renderHome(), renderMissions());
  } catch (error) {
    console.error(error);
    app.replaceChildren(t('app.loadError'));
  }
}

/** Updates the language button so it offers the other language. */
function updateLangButton(button) {
  const label = document.getElementById('lang-toggle-label');
  label.textContent = t('lang.switchLabel');
  // The label is written in the other language, so tell screen readers which.
  label.lang = t('lang.switchTo');
  button.title = t('lang.switchHint');
}

const langButton = document.getElementById('lang-toggle');
langButton.addEventListener('click', () => setLang(t('lang.switchTo')));

onLangChange(() => {
  translateStatic();
  updateLangButton(langButton);
  render();
});

initThemeToggle(document.getElementById('theme-toggle'));
translateStatic();
updateLangButton(langButton);
render();
