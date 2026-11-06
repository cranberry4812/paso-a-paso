# Security: what protects Paso a Paso, and why

Each layer is a separate wall. If one fails, the next still stands
("defense in depth"). This file grows with every step.

| Layer | Where | Status |
|---|---|---|
| L1 Browser rules (headers) | `public/_headers` | **Step 4: done** |
| L2 Cloudflare edge (DDoS, WAF, DNSSEC, CAA) | Cloudflare dashboard | DDoS: automatic. WAF/DNSSEC/CAA: when the domain is added |
| L3 Supabase keys and login hardening | Supabase dashboard | Step 5 |
| L4 Row Level Security | `supabase/` | Step 5 |
| L5 Database constraints | `supabase/` | Step 5 |
| L6 Network restrictions, SSL | Supabase dashboard | Step 5 |
| L7 Accounts: MFA, auto-renew, email DNS | Everywhere | Ongoing |

---

## L1 — Security headers (`public/_headers`)

**What headers are:** short instructions the server sends with every page,
before the page itself. The browser obeys them. They cost nothing, add no
delay, and work the same for 10 or 10 million visitors (**fully scalable**:
Cloudflare attaches them at its edge servers).

### Content-Security-Policy (CSP) — the most important one

- **What it does:** a list of the only places the page may load code, styles,
  fonts, images and data from. Everything else is blocked.
- **Why it matters:** the most common web attack (XSS) tricks a page into running
  someone else's script, for example inside a parent's note. With
  `script-src 'self'`, even if a script got into the page, the browser refuses to run
  it because it isn't one of our files. Tested: an injected inline script
  did not run.
- **Our rules, one by one:**

  | Rule | Meaning |
  |---|---|
  | `default-src 'none'` | Start from "nothing allowed", then open only what we need |
  | `script-src 'self'` | JavaScript only from our own files; no inline scripts, no `eval` |
  | `style-src 'self'` | CSS only from our files; no inline `style=""` |
  | `font-src 'self'` | Fonts are self-hosted (no Google Fonts = no tracking) |
  | `img-src 'self' data:` | Our images, plus small embedded ones |
  | `connect-src 'self'` | Where the app may send data. Supabase is added in Step 5 |
  | `manifest-src`, `worker-src 'self'` | Ready for the offline app (Step 12) |
  | `base-uri 'none'` | Stops an attacker changing where relative links point |
  | `form-action 'self'` | Forms can only send to us |
  | `frame-ancestors 'none'` | No other site may show us inside a frame |
  | `upgrade-insecure-requests` | Any `http://` request is turned into `https://` |

- **Pros:** blocks whole classes of attacks; also blocks trackers by design.
- **Cons:** strict. Every new outside service must be added on purpose, or it
  silently fails. That's why `npm run preview` uses the same rules: you see
  the failure on your computer first (red errors in the browser console, F12).

### Strict-Transport-Security (HSTS)
- **What:** "for the next year, only ever reach this site over HTTPS."
- **Why:** on public Wi-Fi, an attacker could otherwise catch the first
  `http://` visit and redirect it. After one visit, the browser never tries
  plain HTTP again.
- **Con:** if HTTPS ever broke, the site would be unreachable until fixed
  (Cloudflare manages certificates automatically, so this is unlikely).

### X-Frame-Options: DENY
- Same job as `frame-ancestors`, for older browsers. Prevents "clickjacking":
  a fake site showing ours invisibly and tricking a parent into tapping
  "Delete account".

### X-Content-Type-Options: nosniff
- The browser must trust the declared file type and not guess. Stops a text
  file being run as a script.

### Referrer-Policy: no-referrer
- When a parent taps a link to ScratchJr or Chrome Music Lab, that site is
  not told which page they came from. Privacy, with no downside for us.

### Permissions-Policy
- Turns off camera, microphone, location, payments, USB, motion sensors and
  Google's ad-interest feature. The app uses none of them, so even
  injected code can't ask for them.

### Cross-Origin-Opener-Policy / Cross-Origin-Resource-Policy
- Keep our page isolated from popups it opens, and stop other sites from
  loading our files into theirs. Protection against side-channel attacks
  like Spectre.

### X-Robots-Tag: noindex (temporary)
- Asks search engines not to list the draft site. Remove at launch.

### Cache-Control on /assets/*
- Not security: speed. Built files have a fingerprint in their name, so
  phones can keep them for a year and only download what changed.

### How to check the live site
After deploying, paste the address into https://securityheaders.com.
Expected grade: **A+**.

---

## L2 — Cloudflare edge (what works on the free `.pages.dev` address)

| Protection | On `*.pages.dev` | With our own domain |
|---|---|---|
| HTTPS certificate | Automatic | Automatic |
| DDoS protection (absorbs floods of fake traffic) | Automatic, unlimited | Automatic, unlimited |
| Our headers file | Yes | Yes |
| WAF custom rules (block `/wp-admin`, `.env`, non-GET) | No: needs a domain (a "zone") | Yes, free plan: 5 rules |
| DNSSEC, CAA | No: Cloudflare owns `pages.dev` | Yes |

The site is static files with no server code and no database yet, so the
missing WAF rules protect nothing that exists today. They become useful
when the domain is added; that is a short separate step.

### Preview deployments: turned off
Cloudflare can publish every pushed branch at its own public address. We merge
locally and push only `main`, so previews are set to **None**: fewer public
copies of unfinished work.
