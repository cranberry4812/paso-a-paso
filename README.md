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
| `npm run preview` | Serves `dist/` locally so you can check the final build |

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
