// Missions page: the five session steps, then each mission with its
// six sessions, bilingual words, activity and digital moment.

import { h } from '../lib/dom.js';
import { pick, otherLang, t } from '../lib/i18n.js';
import { href } from '../router.js';
import { pageHeader } from './parts.js';
import pages from '../content/pages.json';
import program from '../content/program.json';

/** One word chip: the English word, with its Spanish translation in italics. */
export function wordChip(word) {
  return h(
    'span',
    { class: 'word', lang: 'en' },
    word.en,
    ' ',
    h('i', { lang: 'es' }, word.es),
  );
}

function wordsCell(session) {
  if (session.reviewAllWords) return t('missions.allWords');
  return h('span', { class: 'words' }, session.words.map(wordChip));
}

function sessionRow(session) {
  return h(
    'tr',
    {},
    h('td', {}, h('span', { class: 'code-badge' }, session.code)),
    h('td', {}, pick(session.focus)),
    h('td', {}, wordsCell(session)),
    h('td', {}, pick(session.activity)),
    h('td', {}, session.digital ? pick(session.digital) : t('missions.none')),
  );
}

function missionHeader(mission) {
  const [from, to] = mission.weeks;
  return h(
    'header',
    {},
    h(
      'div',
      {},
      h('span', { class: 'tag' }, t('missions.weeks', { from, to })),
      h('h2', {}, pick(mission.title)),
      h('p', { class: 'es', lang: otherLang() }, pick(mission.title, otherLang())),
    ),
    h('span', { class: 'tag' }, pick(mission.codesigner)),
  );
}

function missionMeta(mission) {
  return h(
    'div',
    { class: 'meta' },
    h(
      'span',
      {},
      `${t('missions.powerPhrase')}: `,
      h('strong', { lang: 'en' }, `"${mission.powerPhrase.en}"`),
      ' ',
      h('i', { lang: 'es' }, `/ "${mission.powerPhrase.es}"`),
    ),
    h('span', {}, `${t('missions.techSkill')}: `, h('strong', {}, pick(mission.techSkill))),
  );
}

function sessionsTable(mission) {
  const columns = ['session', 'focus', 'words', 'activity', 'digital'];
  return h(
    'div',
    { class: 'table-wrap' },
    h(
      'table',
      {},
      h('thead', {}, h('tr', {}, columns.map((key) => h('th', { scope: 'col' }, t(`missions.${key}`))))),
      h('tbody', {}, mission.sessions.map(sessionRow)),
    ),
  );
}

/** One mission: a colored header band, then the power phrase and the sessions table. */
function missionBlock(mission) {
  return h(
    'article',
    // m1..m4 colors the header band and the session badges.
    { class: `mission m${mission.id}`, id: `mission-${mission.id}` },
    missionHeader(mission),
    h('div', { class: 'body' }, missionMeta(mission), sessionsTable(mission)),
  );
}

/** Four colored buttons that jump to each mission (handy on phones). */
function missionJumps() {
  return h(
    'nav',
    { class: 'jumps', 'aria-label': t('missions.jumpLabel') },
    program.missions.map((mission) =>
      h('a', { class: `jump m${mission.id}`, href: href('missions', mission.id) }, pick(mission.title)),
    ),
  );
}

/** Missions page. param = mission number to scroll to ('#/missions/3'). */
export function missionsPage(param) {
  const page = pages.missions;
  const node = h(
    'section',
    { class: 'view' },
    pageHeader(page),
    missionJumps(),
    h(
      'ol',
      { class: 'steps' },
      program.sessionSteps.map((step) => h('li', {}, `${pick(step.name)} · ${t('missions.minutes', { n: step.minutes })}`)),
    ),
    h('p', { class: 'es' }, pick(program.screenNote)),
    program.missions.map(missionBlock),
  );

  const missionExists = program.missions.some((m) => String(m.id) === param);
  return { title: pick(page.title), node, scrollTo: missionExists ? `mission-${param}` : null };
}
