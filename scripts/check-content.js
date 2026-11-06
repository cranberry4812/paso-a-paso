// Checks the content files for mistakes before they reach families.
// Run with:  npm run check:content
//
// It checks that:
//   1. Every text has BOTH English and Spanish, and neither is empty.
//   2. There are exactly 24 sessions, numbered 1 to 24 in order, with unique codes (1A ... 12B).
//   3. Every session has words (or says it reviews all words) and an activity.
//   4. Every tool a session mentions exists in the tools list, with a safe https link.
//   5. en.json and es.json have the same keys and the same {placeholders}.

import { readFileSync } from 'node:fs';

const read = (path) => JSON.parse(readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8'));

const program = read('content/program.json');
const pages = read('content/pages.json');
const en = read('i18n/en.json');
const es = read('i18n/es.json');

const errors = [];
const fail = (msg) => errors.push(msg);

// 1. Bilingual fields ----------------------------------------------------
// Any object with an "en" or "es" text must have both, non-empty.
function checkBilingual(node, path) {
  if (Array.isArray(node)) {
    node.forEach((item, i) => checkBilingual(item, `${path}[${i}]`));
    return;
  }
  if (node === null || typeof node !== 'object') return;

  if ('en' in node || 'es' in node) {
    for (const lang of ['en', 'es']) {
      if (typeof node[lang] !== 'string' || node[lang].trim() === '') {
        fail(`${path}: missing or empty "${lang}" text`);
      }
    }
  }
  for (const [key, value] of Object.entries(node)) {
    if (key !== 'en' && key !== 'es') checkBilingual(value, `${path}.${key}`);
  }
}
checkBilingual(program, 'program');
checkBilingual(pages, 'pages');

// 2 and 3. Sessions ------------------------------------------------------
const sessions = program.missions.flatMap((m) => m.sessions.map((s) => ({ ...s, mission: m.id })));
if (sessions.length !== 24) fail(`Expected 24 sessions, found ${sessions.length}`);

const codes = new Set();
sessions.forEach((s, i) => {
  const where = `session ${s.code ?? `#${i + 1}`}`;
  if (!/^\d{1,2}[AB]$/.test(s.code)) fail(`${where}: code should look like 1A or 12B`);
  if (codes.has(s.code)) fail(`${where}: code is used twice`);
  codes.add(s.code);
  if (s.order !== i + 1) fail(`${where}: order is ${s.order}, expected ${i + 1}`);
  if (!s.reviewAllWords && (!Array.isArray(s.words) || s.words.length === 0)) fail(`${where}: has no words`);
  if (!s.activity) fail(`${where}: has no activity`);
  if (!Array.isArray(s.parentSteps)) fail(`${where}: parentSteps should be a list (it can be empty)`);
});

// 4. Tools ---------------------------------------------------------------
const toolIds = new Set(program.tools.map((tool) => tool.id));
for (const tool of program.tools) {
  if (tool.url !== null && !String(tool.url).startsWith('https://')) fail(`tool ${tool.id}: link must start with https://`);
  if (!['none', 'host', 'team'].includes(tool.account)) fail(`tool ${tool.id}: account must be none, host or team`);
}
for (const s of sessions) {
  for (const id of s.tools ?? []) {
    if (!toolIds.has(id)) fail(`session ${s.code}: tool "${id}" is not in the tools list`);
  }
}

// 5. Interface text ------------------------------------------------------
function flatten(obj, prefix = '') {
  return Object.entries(obj).flatMap(([key, value]) =>
    value && typeof value === 'object' ? flatten(value, `${prefix}${key}.`) : [[`${prefix}${key}`, value]],
  );
}
const enKeys = new Map(flatten(en));
const esKeys = new Map(flatten(es));
const placeholders = (text) => (String(text).match(/\{\w+\}/g) ?? []).sort().join(',');

for (const [key, text] of enKeys) {
  if (!esKeys.has(key)) fail(`es.json is missing "${key}"`);
  else if (placeholders(text) !== placeholders(esKeys.get(key))) fail(`"${key}": placeholders differ between en and es`);
}
for (const key of esKeys.keys()) {
  if (!enKeys.has(key)) fail(`en.json is missing "${key}"`);
}

// Report -----------------------------------------------------------------
const words = sessions.reduce((n, s) => n + s.words.length, 0);
console.log(`Checked ${program.missions.length} missions, ${sessions.length} sessions, ${words} words, ${program.tools.length} tools, ${enKeys.size} interface texts.`);

if (errors.length) {
  console.log(`\n${errors.length} problem(s):`);
  errors.forEach((e) => console.log(`  ✗ ${e}`));
  process.exit(1);
}
console.log('All content checks pass.');
