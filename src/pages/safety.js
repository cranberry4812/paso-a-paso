// Safety page: what happens in every session, what we collect and never collect.

import { h } from '../lib/dom.js';
import { pick } from '../lib/i18n.js';
import { pageHeader, checkList, callout } from './parts.js';
import pages from '../content/pages.json';

export function safetyPage() {
  const page = pages.safety;
  const node = h(
    'section',
    { class: 'view' },
    pageHeader(page),
    h(
      'div',
      { class: 'grid' },
      page.cards.map((card) => h('article', { class: 'card' }, h('h3', {}, pick(card.title)), checkList(card.items, card.style))),
    ),
    callout(null, page.callout),
  );
  return { title: pick(page.title), node };
}
