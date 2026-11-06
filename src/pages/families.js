// Families page: why the program is good for children, what families need.

import { h } from '../lib/dom.js';
import { pick } from '../lib/i18n.js';
import { pageHeader, checkList, callout } from './parts.js';
import pages from '../content/pages.json';

function benefitCard(benefit) {
  return h(
    'article',
    { class: 'card' },
    h('h3', {}, pick(benefit.title)),
    h('p', {}, pick(benefit.body)),
    benefit.link ? h('p', {}, h('a', { href: benefit.link.href }, pick(benefit.link.label))) : null,
  );
}

export function familiesPage() {
  const page = pages.families;
  const node = h(
    'section',
    { class: 'view' },
    pageHeader(page),
    h('div', { class: 'grid' }, page.benefits.map(benefitCard)),
    h('h2', {}, pick(page.needsTitle)),
    checkList(page.needs),
    callout(page.weakInternet.title, page.weakInternet.body),
  );
  return { title: pick(page.title), node };
}
