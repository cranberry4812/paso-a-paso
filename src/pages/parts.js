// Small building blocks shared by several pages.

import { h } from '../lib/dom.js';
import { pick } from '../lib/i18n.js';

/** Six crayon-colored dots: decoration only, hidden from screen readers. */
export function crayonDots() {
  return h('ul', { class: 'crayons', 'aria-hidden': 'true' }, [1, 2, 3, 4, 5, 6].map(() => h('li')));
}

/**
 * The top of every page: small label, big title, crayon dots, intro.
 * The h1 gets tabindex="-1" so the router can move keyboard and
 * screen-reader focus to it after a page change.
 */
export function pageHeader({ eyebrow, title, lede }) {
  return [
    eyebrow ? h('p', { class: 'eyebrow' }, pick(eyebrow)) : null,
    h('h1', { tabindex: '-1' }, pick(title)),
    crayonDots(),
    lede ? h('p', { class: 'lede' }, pick(lede)) : null,
  ];
}

/** A bulleted list with colored check dots. style: 'checks' or 'no'. */
export function checkList(items, style = 'checks') {
  return h('ul', { class: style === 'no' ? 'checks no' : 'checks' }, items.map((item) => h('li', {}, pick(item))));
}

/** A numbered list shown as sticker pills (used for steps). */
export function stepList(items) {
  return h('ol', { class: 'steps' }, items.map((item) => h('li', {}, pick(item))));
}

/** A yellow callout box with an optional bold title. */
export function callout(title, body) {
  return h('div', { class: 'callout' }, h('p', {}, title ? h('strong', {}, `${pick(title)} `) : null, pick(body)));
}
