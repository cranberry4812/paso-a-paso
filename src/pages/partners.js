// Partners page: how co-design works, the roles we need, timeline.

import { h } from '../lib/dom.js';
import { pick, t } from '../lib/i18n.js';
import { pageHeader, checkList, stepList, callout } from './parts.js';
import pages from '../content/pages.json';

// Each volunteer role belongs to one mission's field (building, health,
// music, stories), so its card uses that mission's color. The examples
// show which jobs fit; any job in the field counts.
function roleCard(role) {
  return h(
    'article',
    { class: `card m${role.mission}` },
    h('span', { class: 'tag' }, t('missions.missionN', { n: role.mission })),
    h('h3', {}, pick(role.title)),
    h('p', { class: 'es' }, t('missions.examples', { list: pick(role.examples) })),
    h('p', {}, h('strong', {}, pick(role.time))),
    checkList(role.tasks),
  );
}

function otherRoleCard(role) {
  return h(
    'article',
    { class: 'card' },
    h('h3', {}, pick(role.role)),
    h('p', {}, pick(role.does)),
    h('p', { class: 'es' }, pick(role.time)),
  );
}

function timeline(items) {
  return h(
    'ol',
    { class: 'timeline' },
    items.map((item) => h('li', { class: 'tl' }, h('b', {}, pick(item.when)), h('div', {}, pick(item.what)))),
  );
}

export function partnersPage() {
  const page = pages.partners;
  const node = h(
    'section',
    { class: 'view' },
    pageHeader(page),
    h('h2', {}, pick(page.howTitle)),
    stepList(page.how),
    h('h2', {}, pick(page.rolesTitle)),
    h('div', { class: 'grid' }, page.roles.map(roleCard)),
    h('h2', {}, pick(page.otherTitle)),
    h('div', { class: 'grid' }, page.other.map(otherRoleCard)),
    h('h2', {}, pick(page.benefitsTitle)),
    checkList(page.benefits),
    h('h2', {}, pick(page.timelineTitle)),
    timeline(page.timeline),
    callout(page.contact.title, page.contact.body),
  );
  return { title: pick(page.title), node };
}
