// Languages: English and Spanish.
//
// How the language is chosen (first match wins):
//   1. The family's saved choice on this device (localStorage "pap-lang").
//   2. The phone or browser language (Spanish if it starts with "es").
//   3. English.
// From Step 7, a signed-in parent's preferred language takes over.
//
// Two kinds of text:
//   - Interface text (buttons, labels) lives in i18n/en.json and es.json.
//     Use t('nav.home') to get it.
//   - Program content lives in content/*.json as { "en": "...", "es": "..." }.
//     Use pick(field) to get the right one.

import en from '../i18n/en.json';
import es from '../i18n/es.json';

const dictionaries = { en, es };
const STORAGE_KEY = 'pap-lang';
const listeners = new Set();

function detect() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'es') return saved;
  } catch {
    // Storage blocked: fall through to the browser language.
  }
  const browser = navigator.languages?.[0] || navigator.language || 'en';
  return browser.toLowerCase().startsWith('es') ? 'es' : 'en';
}

let current = detect();
document.documentElement.lang = current;

/** The language in use: 'en' or 'es'. */
export function getLang() {
  return current;
}

/** The other language: handy for showing a translation next to the main text. */
export function otherLang() {
  return current === 'en' ? 'es' : 'en';
}

/** Changes language, remembers it on this device, and tells the app to redraw. */
export function setLang(lang) {
  if (lang !== 'en' && lang !== 'es') return;
  current = lang;
  document.documentElement.lang = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Storage blocked: the choice lasts until the page is closed.
  }
  listeners.forEach((fn) => fn(lang));
}

/** Runs fn every time the language changes. */
export function onLangChange(fn) {
  listeners.add(fn);
}

/**
 * Interface text by key, e.g. t('missions.weeks', { from: 1, to: 3 }).
 * Falls back to English, then to the key itself, so a missing
 * translation never shows a blank.
 */
export function t(key, values = {}) {
  const find = (dict) => key.split('.').reduce((obj, part) => obj?.[part], dict);
  let text = find(dictionaries[current]) ?? find(dictionaries.en) ?? key;
  for (const [name, value] of Object.entries(values)) {
    text = text.replaceAll(`{${name}}`, String(value));
  }
  return text;
}

/** Picks the current language from a content field { en, es }. */
export function pick(field, lang = current) {
  if (field == null) return '';
  if (typeof field === 'string') return field;
  return field[lang] ?? field.en ?? '';
}

/**
 * Translates fixed parts of index.html (header, footer).
 *   data-i18n="key"            -> sets the element's text
 *   data-i18n-aria-label="key" -> sets its aria-label (read by screen readers)
 */
export function translateStatic(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  root.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
    el.setAttribute('aria-label', t(el.dataset.i18nAriaLabel));
  });
}
