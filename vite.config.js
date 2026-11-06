// Vite settings.
// The only custom part: `npm run preview` sends the same security headers
// as Cloudflare (read from public/_headers), so a rule that would break the
// live site also breaks on your computer first.
// (Not used by `npm run dev`: the dev server injects inline styles for live
// reload, which our strict rules would block.)

import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';

/** Reads public/_headers into [{ pattern, headers: [[name, value]] }]. */
function readHeadersFile() {
  const rules = [];
  for (const raw of readFileSync(new URL('./public/_headers', import.meta.url), 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    if (!/^\s/.test(raw)) {
      rules.push({ pattern: line, headers: [] });
    } else {
      const colon = line.indexOf(':');
      rules.at(-1).headers.push([line.slice(0, colon).trim(), line.slice(colon + 1).trim()]);
    }
  }
  return rules;
}

/** "/assets/*" matches "/assets/x.js"; "/*" matches everything. */
function matches(pattern, path) {
  return pattern.endsWith('*') ? path.startsWith(pattern.slice(0, -1)) : path === pattern;
}

const cloudflareHeaders = {
  name: 'cloudflare-headers-in-preview',
  configurePreviewServer(server) {
    const rules = readHeadersFile();
    server.middlewares.use((req, res, next) => {
      const path = req.url.split('?')[0];
      for (const rule of rules) {
        if (matches(rule.pattern, path)) rule.headers.forEach(([name, value]) => res.setHeader(name, value));
      }
      next();
    });
  },
};

export default defineConfig({
  plugins: [cloudflareHeaders],
});
