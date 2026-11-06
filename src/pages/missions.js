// Missions page: the five session steps, then each mission with its
// six sessions, bilingual words, activity and digital moment.

import { h } from '../lib/dom.js';
import { pick, otherLang, t } from '../lib/i18n.js';
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
    h('td', {}, h('strong', {}, session.code)),
    h('td', {}, pick(session.focus)),
    h('td', {}, wordsCell(session)),
    h('td', {}, pick(session.activity)),
    h('td', {}, session.digital ? pick(session.digital) : t('missions.none')),
  );
}

function missionBlock(mission) {
  const [from, to] = mission.weeks;
  return h(
    'article',
    { class: 'mission', id: `mission-${mission.id}` },
    h(
      'header',
      {},
      h(
        'div',
        {},
        h('span', { class: 'tag' }, t('missions.weeks', { from, to })),
        h('h2', {}, pick(mission.title)),
        h('p', { class: 'es', lang: otherLang() }, pick(mission.title, otherLang())),
      ),
      h('span', { class: 'tag teal' }, pick(mission.codesigner)),
    ),
    h(
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
    ),
    h(
      'div',
      { class: 'table-wrap' },
      h(
        'table',
        {},
        h(
          'thead',
          {},
          h(
            'tr',
            {},
            ['session', 'focus', 'words', 'activity', 'digital'].map((key) => h('th', { scope: 'col' }, t(`missions.${key}`))),
          ),
        ),
        h('tbody', {}, mission.sessions.map(sessionRow)),
      ),
    ),
  );
}

export function renderMissions() {
  const page = pages.missions;
  return h(
    'section',
    { class: 'view', id: 'missions' },
    h('p', { class: 'eyebrow' }, pick(page.eyebrow)),
    h('h1', {}, pick(page.title)),
    h('p', { class: 'lede' }, pick(page.lede)),
    h(
      'ol',
      { class: 'steps' },
      program.sessionSteps.map((step) => h('li', {}, `${pick(step.name)} · ${t('missions.minutes', { n: step.minutes })}`)),
    ),
    h('p', { class: 'es' }, pick(program.screenNote)),
    program.missions.map(missionBlock),
  );
}
