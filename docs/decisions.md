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
| `@fontsource-variable/baloo-2` | Headings in the Crayon box design (SIL OFL 1.1). Replaced Fredoka |
| `@fontsource-variable/nunito` | Body text (SIL OFL 1.1) |
| `@fontsource/andika` | English words and picture cards: designed for beginning readers (SIL OFL 1.1) |

Only the "latin" font files are used: 6 files, about 175 KB in total.

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

## 2026-11-06: "Crayon box" design (replaces the Step 1 look)

The Step 1 design (beige page, one orange accent, thin borders) looked generic.
We compared three playful directions and chose **Crayon box**.

- **Sticker style:** thick ink outlines (3px), round corners and a solid offset
  shadow. Buttons press down when tapped.
- **Six crayon colors** for decoration (Cami, dots, stripes): orange, pink,
  purple, blue, green, yellow. **Text is never placed in a bright crayon color**;
  bright areas use the soft versions with dark ink text on top.
- **Mission colors**, used everywhere a mission appears (cards, header bands,
  session badges; later progress and picture cards):
  1 Home = orange, 2 Health = pink, 3 Music = purple, 4 Stories = blue.
  In code: add class `m1`..`m4`; inside it `var(--m)` is that mission's color.
- **Fonts:** Baloo 2 (headings), Nunito (text), Andika (English words), chosen
  because its letters match how children learn to write them.
- **Sunshine-yellow header** in both themes; the phone's top bar matches it.
- **Dark mode:** deep navy-purple page with the same bright stickers. Outlines
  become soft lavender (`#7a6dbd`) so the sticker edges stay visible.
- **Checked:** 34 color pairs pass WCAG AA (`npm run check:contrast`).

## 2026-11-06: Pages and navigation (Step 3)

- **Hash routing** (`#/families`, `#/missions/3`): the server always sends the
  same `index.html`, so it works on any static host with no server rules and
  keeps working offline (Step 12). Old prototype links (`#families`) still work.
- **Menu: a row of pills that swipes sideways on phones**, instead of a hidden
  "hamburger" menu, so parents always see every page. It wraps on wide screens.
- **Accessibility:** a "Skip to content" link; after each page change, focus
  moves to the page title so screen readers start there; each page sets the
  browser tab title; the open page's pill has `aria-current="page"`.
- **Tools and other roles are cards, not tables,** because they read better on
  a phone. The sessions tables stay tables (they scroll sideways inside their box).
- **Mission colors reach the Partners page:** each professional role card uses
  its mission's color.
- **Not-found page** with Cami and a link home, instead of a blank screen.

## Crayon box, softened (Step 3 review)

- **Why:** after seeing it live, the colors felt too intense and the outlines too thick.
- **Colors:** every crayon and mission tint moved toward pastel (for example pink `#ff5d8f` → `#ff9ab8`, header yellow `#ffd23f` → `#ffe48a`). Dark mode tints were desaturated the same way.
- **Lines:** cards, buttons and header 3px → 1.5px; tags, chips and pills 2px → 1px (`--border-thin`). Outlines are soft purple-gray (`#8a82a3` light, `#6a5fa6` dark) instead of dark ink, still at least 3:1 against the page.
- **Shadow:** smaller (3px) and paper-toned in light mode instead of a dark ink block.
- All text pairs still pass WCAG AA (`npm run check:contrast`).

## 2026-11-06: Going online (Step 4)

- **Free `paso-a-paso-eqb.pages.dev` address first**; our own domain later. It
  costs nothing and nothing yet needs email (Step 6 does).
  (`paso-a-paso.pages.dev` was already taken by an unrelated site, so
  Cloudflare added `-eqb`. Never share the address without `-eqb`.)
- **Cloudflare Pages, connected to GitHub:** every push to `main` builds and
  publishes automatically. Build command is `npm run check`, so a failing
  contrast or content check stops a broken deploy.
- **Branch preview deployments off:** we only push `main`.
- **Security headers in `public/_headers`** (explained in `docs/security.md`).
  `npm run preview` applies the same file (`vite.config.js`), so a CSP mistake
  shows up locally first.
- **`noindex` until launch:** the draft stays out of search engines.
- **Node 22** for Cloudflare's build (`.node-version`), the LTS our `engines` asks for.
- **Favicon** (Cami's face, `public/favicon.svg`): found missing in the Step 3
  review, every visit was asking for a file that didn't exist.
- **Deferred until the domain:** WAF rules, DNSSEC, CAA (they need a Cloudflare "zone").

## 2026-11-07: Volunteer roles by field, independent and free (content review)

- **Roles are fields, not job titles:** Home & building, Health, Music and
  Story volunteers, each with example jobs ("For example: nurse, doctor,
  dentist…"). Children still meet real jobs; recruiting is open to many
  professions; mission cards no longer claim a specific professional who
  hasn't signed up yet.
- **Independent:** organized by parents and educators, no organization behind
  it. Community partners (schools, libraries) are optional, only spread the
  word, and **never receive family data**. Families sign up and give consent
  on this site, so there is one place to protect and one place to delete.
- **Free** (was "free or very low cost").
- **Wording:** "parent or guardian"; more gender-neutral Spanish
  ("persona voluntaria", "te damos la bienvenida"). Safety page now lists
  the parent-account data we collect.
- **No photos, videos or recordings** of children or sessions, ever (not even
  with consent): nothing to store, protect or ask consent for.
- Mission 2 renamed **"Cami takes care of her friends" / "Cami cuida a sus amigos"**
  (was "checks her friends", which sounded clinical).

## 2026-11-07: Free now, ready to charge later

- **Everything stays free.** Paid live classes ($20 per mission; QR in
  Bolivia, PayPal elsewhere) were considered and postponed until the free
  pilot shows whether families want them.
- **Free lessons are parent-led:** each session gets steps a parent can
  follow at home, plus **audio for every English word** (pronunciation help).
- **Designed so charging can be added later without rebuilding:**
  - Progress belongs to the child; live classes would be a separate
    "enrollment" in a "group", added as new tables, not changes to old ones.
  - Video-call links will only ever be shown through the database's security
    rules, so they can later be limited to enrolled families.
  - If payments come: PayPal's hosted checkout page (no PayPal scripts on our
    site), manual "mark paid" first, automation only at about 30+ payments a month.
  - Open question for then: who legally receives the money.
