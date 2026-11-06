# Paso a Paso

A free, bilingual (English/Spanish) online English and early-technology program
for Spanish-speaking children ages 4 to 7, guided by **Cami**.

- No ads, no trackers, no third-party analytics.
- Only parents and guardians have accounts. Children never sign in or type anything.
- Works on phones first, and offline once a session has been opened.

## Run it on your computer

You need [Node.js](https://nodejs.org) 22 or newer and Git.

```bash
npm install      # first time only: downloads the tools listed in package.json
npm run dev      # starts a local server at http://localhost:5173
```

Other commands:

| Command | What it does |
|---|---|
| `npm run build` | Creates the final website in `dist/` |
| `npm run preview` | Serves `dist/` at http://localhost:4173 with the real security headers |
| `npm run check` | Color contrast + content checks + build (Cloudflare runs this too) |

## Publishing

Every push to `main` is built and published by Cloudflare Pages at
https://paso-a-paso.pages.dev (build command `npm run check`, output `dist`).
Security headers live in `public/_headers`; see `docs/security.md`.

## Folders

| Path | What's inside |
|---|---|
| `index.html` | The single page the app runs in |
| `src/` | JavaScript and CSS for the app |
| `public/` | Files copied as-is (icons, fonts, picture cards, security headers) |
| `supabase/` | Database tables, security rules and server functions (from Step 5) |
| `docs/` | Decisions, policies and the original prototype |

## Security rules for this repo

- **Never commit secrets.** `.env` files are ignored by Git. Only the Supabase
  *publishable* key may appear in the website; the *secret* key never does.
- **Only fake data** goes in seed or test files. Never real families.
- New dependencies need a reason (see `docs/decisions.md`).
