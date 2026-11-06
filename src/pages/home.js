// Home page: hero with Cami, the four missions, and "At a glance".
// All text comes from content/pages.json and content/program.json.

import { h, fromTemplate } from '../lib/dom.js';
import { pick, otherLang, t } from '../lib/i18n.js';
import pages from '../content/pages.json';
import program from '../content/program.json';

function cami() {
  const art = fromTemplate('cami-template');
  art.setAttribute('aria-label', t('cami.alt'));
  return art;
}

/** Six crayon-colored dots: decoration only, hidden from screen readers. */
export function crayonDots() {
  return h('ul', { class: 'crayons', 'aria-hidden': 'true' }, [1, 2, 3, 4, 5, 6].map(() => h('li')));
}

function missionCard(mission) {
  const [from, to] = mission.weeks;
  return h(
    'article',
    // m1..m4 gives the card its mission color (see components.css).
    { class: `card m${mission.id}` },
    h('span', { class: 'tag' }, t('missions.weeks', { from, to })),
    h('h3', {}, pick(mission.title)),
    // The title in the other language, smaller: families see both.
    h('p', { class: 'es', lang: otherLang() }, pick(mission.title, otherLang())),
    h('p', {}, pick(mission.summary)),
    // The power phrase is the English goal, so it is always shown in English.
    h('p', { class: 'phrase', lang: 'en' }, `"${mission.powerPhrase.en}"`),
  );
}

export function renderHome() {
  const home = pages.home;

  return h(
    'section',
    { class: 'view' },
    h(
      'div',
      { class: 'hero' },
      h(
        'div',
        {},
        h('p', { class: 'eyebrow' }, pick(home.eyebrow)),
        h('h1', {}, pick(home.title)),
        crayonDots(),
        h('p', { class: 'lede' }, pick(home.lede)),
        h(
          'div',
          { class: 'btns' },
          h('a', { class: 'btn primary', href: '#partners' }, pick(home.ctaPartners)),
          h('a', { class: 'btn', href: '#families' }, pick(home.ctaFamilies)),
        ),
      ),
      cami(),
    ),

    h('h2', {}, pick(home.missionsTitle)),
    h('p', {}, pick(home.missionsIntro)),
    h('div', { class: 'grid' }, program.missions.map(missionCard)),
    h('p', { class: 'space-top' }, h('a', { href: '#missions' }, pick(home.seeAll))),

    h('h2', {}, pick(home.glanceTitle)),
    h(
      'div',
      { class: 'table-wrap' },
      h(
        'table',
        { class: 'glance' },
        h(
          'tbody',
          {},
          home.glance.map((row) => h('tr', {}, h('th', { scope: 'row' }, pick(row.label)), h('td', {}, pick(row.value)))),
        ),
      ),
    ),
  );
}
