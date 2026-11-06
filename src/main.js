// Entry point of the app. Vite loads this file from index.html.
// Step 1: light/dark switch.
// Step 2: language switch, pages drawn from the content files.
// Step 3: router (one page at a time), menu, page titles.

import { initThemeToggle } from './lib/theme.js';
import { onLangChange, setLang, t, translateStatic } from './lib/i18n.js';
import { h } from './lib/dom.js';
import { addRoute, fixOldLinks, href, resolve, setNotFound } from './router.js';
import { homePage } from './pages/home.js';
import { missionsPage } from './pages/missions.js';
import { familiesPage } from './pages/families.js';
import { partnersPage } from './pages/partners.js';
import { toolsPage } from './pages/tools.js';
import { safetyPage } from './pages/safety.js';
import { notFoundPage } from './pages/not-found.js';

// ---- Pages -------------------------------------------------------------
// The order here is also the order of the menu.
const menu = [
  ['', 'nav.home', homePage],
  ['missions', 'nav.missions', missionsPage],
  ['families', 'nav.families', familiesPage],
  ['partners', 'nav.partners', partnersPage],
  ['tools', 'nav.tools', toolsPage],
  ['safety', 'nav.safety', safetyPage],
];
menu.forEach(([path, , page]) => addRoute(path, page));
setNotFound(notFoundPage);

const app = document.getElementById('app');
const navList = document.getElementById('site-nav-list');

// ---- Menu --------------------------------------------------------------
function renderMenu(activePath) {
  navList.replaceChildren(
    ...menu.map(([path, labelKey]) =>
      h(
        'li',
        {},
        // aria-current="page" tells screen readers (and our CSS) which page is open.
        h('a', { href: href(path), 'aria-current': path === activePath ? 'page' : null }, t(labelKey)),
      ),
    ),
  );
  // On phones the menu scrolls sideways: keep the open page's pill in view.
  navList.querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}

// ---- Drawing a page ----------------------------------------------------
/**
 * Draws the current page.
 *   moveFocus: true after the family taps a link, so keyboard and
 *   screen-reader users start reading at the new page's title.
 */
function render({ moveFocus = false } = {}) {
  let page;
  try {
    page = resolve();
  } catch (error) {
    console.error(error);
    app.replaceChildren(h('p', {}, t('app.loadError')));
    return;
  }

  app.replaceChildren(page.node);
  renderMenu(page.path);
  document.title = page.title ? `${page.title} · Paso a Paso` : 'Paso a Paso';

  if (page.scrollTo) {
    document.getElementById(page.scrollTo)?.scrollIntoView();
  } else if (moveFocus) {
    window.scrollTo(0, 0);
  }

  if (moveFocus) {
    const heading = app.querySelector('h1');
    (heading ?? app).focus({ preventScroll: true });
  }
}

// ---- Language button ---------------------------------------------------
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
  render(); // same page, new language; focus stays on the button
});

// ---- Skip link -----------------------------------------------------------
// Moves focus to the page content without changing the address
// (the router owns everything after "#").
document.querySelector('.skip-link').addEventListener('click', (event) => {
  event.preventDefault();
  app.focus();
});

// ---- Start -------------------------------------------------------------
window.addEventListener('hashchange', () => render({ moveFocus: true }));

initThemeToggle(document.getElementById('theme-toggle'));
translateStatic();
updateLangButton(langButton);

if (!fixOldLinks()) render();
