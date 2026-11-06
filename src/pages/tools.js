// Tools page: the free tools we use, who uses them, and whether they need an account.
// Shown as cards (not a table) so it reads well on a phone.

import { h, externalLink } from '../lib/dom.js';
import { pick, t } from '../lib/i18n.js';
import { pageHeader } from './parts.js';
import pages from '../content/pages.json';
import program from '../content/program.json';

const accountLabel = {
  none: () => t('tools.accountNone'),
  host: () => t('tools.accountHost'),
  team: () => t('tools.accountTeam'),
};

function toolCard(tool) {
  return h(
    'article',
    { class: 'card tool' },
    h('h3', {}, tool.url ? externalLink(tool.url, tool.name, t('tools.opensNewTab')) : tool.name),
    h('p', {}, pick(tool.use)),
    h(
      'dl',
      { class: 'facts' },
      h('dt', {}, t('tools.whoUses')),
      h('dd', {}, pick(tool.who)),
      h('dt', {}, t('tools.account')),
      // Mint = no account needed (the safest option); white = an adult holds one.
      h('dd', {}, h('span', { class: tool.account === 'none' ? 'tag mint' : 'tag' }, accountLabel[tool.account]())),
    ),
  );
}

export function toolsPage() {
  const page = pages.tools;
  const node = h(
    'section',
    { class: 'view' },
    pageHeader(page),
    h('div', { class: 'grid' }, program.tools.map(toolCard)),
    h('p', { class: 'es space-top' }, pick(page.note)),
  );
  return { title: pick(page.title), node };
}
