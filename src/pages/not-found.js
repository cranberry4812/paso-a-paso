// Shown when the address doesn't match any page (for example a mistyped link).

import { h, fromTemplate } from '../lib/dom.js';
import { t } from '../lib/i18n.js';
import { href } from '../router.js';

export function notFoundPage() {
  const cami = fromTemplate('cami-template');
  cami.setAttribute('aria-hidden', 'true');
  cami.removeAttribute('role');

  const node = h(
    'section',
    { class: 'view not-found' },
    cami,
    h('h1', { tabindex: '-1' }, t('notFound.title')),
    h('p', { class: 'lede' }, t('notFound.body')),
    h('p', {}, h('a', { class: 'btn primary', href: href('') }, t('notFound.home'))),
  );
  return { title: t('notFound.title'), node };
}
