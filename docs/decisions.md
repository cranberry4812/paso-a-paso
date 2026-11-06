# Decisions

A short log of the important choices and why we made them. Add a new entry
whenever a choice would be hard to undo or would surprise someone later.

## 2026-11-06: Starting stack

| Choice | Why | Alternatives considered |
|---|---|---|
| Plain HTML/CSS/JS built with **Vite** | Close to basic HTML; no framework to learn; bundles everything so nothing loads from third-party servers | React/Svelte (more to learn), no build step (would need CDNs) |
| **Supabase** (Postgres, Auth, Row Level Security) | Real SQL; security rules in SQL; admin summaries are simple `GROUP BY` queries; free tier | Firebase: built-in offline sync, but NoSQL, server functions need a paid plan, Google lock-in |
| **Cloudflare Pages** hosting | Free, unlimited bandwidth, supports security headers, built-in DDoS and firewall | GitHub Pages (no custom headers), Netlify |
| **PWA** for offline | Works on any phone with no app store fees or review | Native app (Apple fee, separate code) |
| Email + **6-digit code** sign-in | No passwords to forget or store; works inside an installed PWA | Passwords, magic links (open in the wrong browser on phones) |
| Program content in **JSON files in Git** | Same for every family; versioned; easy to cache offline; no database reads | Content in the database |
| **Self-hosted fonts** | Google Fonts would send every visitor's IP address to Google | Google Fonts CDN |

## Dependencies

Every package we add is listed here with its reason.

| Package | Why |
|---|---|
| `vite` (dev only) | Local dev server and production build |
| `@fontsource-variable/fredoka`, `@fontsource-variable/nunito` | Self-hosted copies of the prototype's fonts (SIL Open Font License 1.1). Only the 3 "latin" files are used: about 110 KB in total |

## 2026-11-06: Design (Step 1)

- **Accent orange darkened** from `#c9541f` to `#c2501c`: white text on the
  prototype's orange buttons was 4.40:1, below the 4.5:1 accessibility minimum.
  Now 4.71:1. `npm run check:contrast` tests every color pair in both themes.
- **Separate "ink" colors** (`--accent-ink`, `--teal-ink`) for text on light
  backgrounds, so small orange and teal text stays readable.
- **Theme choice** is saved only on the device (`localStorage`, key `pap-theme`),
  never on the server. With no choice saved, the app follows the phone's setting.
- **No inline scripts or styles**, so the Content-Security-Policy in Step 4
  can forbid them.

## 2026-11-06: Content and languages (Step 2)

- **Two content files.** `content/program.json` holds the curriculum (missions,
  sessions, words, tools), which the parent area will reuse. `content/pages.json`
  holds the public page text. Interface text (buttons, labels) is in
  `i18n/en.json` and `i18n/es.json`.
- **Every text is `{ "en": ..., "es": ... }`.** `npm run check:content` fails if
  either language is missing or empty.
- **Content is plain text only, never HTML.** Links are separate fields
  (`{ "href", "label" }`). Pages are built with `h()` in `lib/dom.js`, which turns
  text into text nodes, so content can never inject code (XSS).
- **Sessions keep the prototype codes (1A–12B)** plus an `order` from 1 to 24,
  which the unlock rule will use in Step 9.
- **`parentSteps` is empty for now.** The prototype has no detailed parent
  instructions per session; they can be added later without code changes.
- **Language choice:** saved choice on the device, then the phone's language,
  then English. A signed-in parent's `preferred_language` will take over in Step 7.
- **Words and power phrases are always shown in English with Spanish**, whatever
  the interface language, because the English is what children learn.
- **Spanish translations are drafts** and need review by a native speaker from
  the target countries before launch.
- **Kept from the prototype for now; to decide before launch:** the Tools page
  still lists "Google Sites" for platform pages (this platform replaces it), and
  the Safety page says the consent form is "kept by the partner organization"
  (online consent replaces it in Step 7).
