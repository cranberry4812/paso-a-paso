// A tiny, safe way to build HTML from JavaScript.
//
//   h('p', { class: 'lede' }, 'Hello ', h('strong', {}, 'Cami'))
//   -> <p class="lede">Hello <strong>Cami</strong></p>
//
// Why not innerHTML = `<p>${text}</p>`?  Because if text ever contains
// "<script>" (for example, a note a parent typed), innerHTML would run it.
// h() only creates text nodes from strings, so text is always shown as text.
// This is our main protection against cross-site scripting (XSS).

/** Only allow links that are web pages, in-page anchors or our own paths. */
function safeUrl(url) {
  const value = String(url).trim();
  return /^(https:\/\/|http:\/\/localhost|#|\/(?!\/))/i.test(value) ? value : null;
}

export function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);

  for (const [key, value] of Object.entries(props)) {
    if (value == null || value === false) continue;
    if (key === 'class') {
      el.className = value;
    } else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === 'href' || key === 'src') {
      const url = safeUrl(value);
      if (url) el.setAttribute(key, url); // unsafe URLs (e.g. "javascript:") are dropped
    } else if (value === true) {
      el.setAttribute(key, '');
    } else {
      el.setAttribute(key, String(value));
    }
  }

  append(el, children);
  return el;
}

/** Adds children: strings become text, nodes are added, null/false are skipped. */
function append(parent, children) {
  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue;
    parent.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
}

/** Copies a <template> from index.html (used for Cami's drawing). */
export function fromTemplate(id) {
  const template = document.getElementById(id);
  return template.content.firstElementChild.cloneNode(true);
}

/** A link to another website: opens in a new tab and shares nothing about our page. */
export function externalLink(href, label, hint) {
  return h(
    'a',
    { href, target: '_blank', rel: 'noopener noreferrer' },
    label,
    hint ? h('span', { class: 'visually-hidden' }, ` (${hint})`) : null,
  );
}
