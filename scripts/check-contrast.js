// Checks that text colors are readable on their backgrounds, in light and
// dark mode, using the WCAG contrast formula (the accessibility standard).
//   4.5 : 1 or more  -> normal text passes (level AA)
//   3   : 1 or more  -> large text and UI parts (borders, focus rings) pass
// Run with:  npm run check:contrast

import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');

// Read "--name: #hex;" pairs from one CSS block.
function readTokens(block) {
  const tokens = {};
  for (const [, name, hex] of block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)) tokens[name] = hex;
  return tokens;
}

const lightBlock = css.match(/:root\s*\{([\s\S]*?)\}/)[1];
const darkBlock = css.match(/:root\[data-theme="dark"\]\s*\{([\s\S]*?)\}/)[1];
const themes = { light: readTokens(lightBlock), dark: readTokens(darkBlock) };

// Relative luminance, as defined by WCAG 2.
function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// [text color, background color, minimum ratio, where it's used]
const pairs = [
  ['fg', 'bg', 4.5, 'body text'],
  ['fg', 'surface', 4.5, 'text in cards'],
  ['muted', 'bg', 4.5, 'secondary text'],
  ['muted', 'surface', 4.5, 'secondary text in cards'],
  ['accent-ink', 'surface', 4.5, 'outline buttons, brand, links'],
  ['accent-ink', 'bg', 4.5, 'links on page'],
  ['on-accent', 'accent', 4.5, 'primary button text'],
  ['accent-ink', 'accent-soft', 4.5, 'orange tags, power phrases'],
  ['fg', 'accent-soft', 4.5, 'word chips'],
  ['muted', 'accent-soft', 4.5, 'Spanish word in chips'],
  ['teal-ink', 'bg', 4.5, 'eyebrow labels'],
  ['teal-ink', 'teal-soft', 4.5, 'teal tags, step numbers'],
  ['fg', 'teal-soft', 4.5, 'callouts, steps'],
  ['teal', 'bg', 3, 'focus ring, check marks'],
  ['accent', 'surface', 3, 'button borders'],
];

let failures = 0;
for (const [name, t] of Object.entries(themes)) {
  console.log(`\n${name.toUpperCase()} THEME`);
  for (const [fg, bg, min, use] of pairs) {
    const ratio = contrast(t[fg], t[bg]);
    const ok = ratio >= min;
    if (!ok) failures++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${ratio.toFixed(2).padStart(5)} : 1  (needs ${min})  ${fg} on ${bg}  - ${use}`);
  }
}

console.log(failures ? `\n${failures} pair(s) need a darker or lighter color.` : '\nAll colors pass.');
process.exit(failures ? 1 : 0);
