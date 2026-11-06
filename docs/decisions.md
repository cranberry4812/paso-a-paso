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
