# Session Log

Newest entries on top. Each session: what changed, why, what's next.

---

## 2026-10-19 - Vercel Web Analytics added (visitor tracking)

**Focus:** Track visitors on bda.stoyanov.works. Part of a cross-project analytics pass (6 sites now tracked).

**Done:**

- Switched Web Analytics on for the `bda-site` Vercel project (it was never on before).
- Added the tracking script: `@vercel/analytics` (^2.0.1) in `client/package.json`, and `<Analytics />` from `@vercel/analytics/astro` in the `<head>` of `client/src/layouts/Base.astro`, the only page shell, so every page is covered.
- Tested on a branch preview first, then pushed to `main` (commit `2ac8ac1`). Live build green.
- Local copy pulled and `npm install` run, so `npm run dev` works.

**Decisions:** Vercel Web Analytics over Google Analytics: no cookies, so no consent banner needed, and it's included in Vercel Pro.

**Next / open:**
- Not yet proven end to end: open https://bda.stoyanov.works once in a real browser, then check that visits show in the Vercel project's Analytics tab.
- Visits count on production only. Preview links are not counted.

---

## 2026-07-07 - Migrated off Dropbox to ~/Projects, restructured to client/ + _internal/, deployed live

**Focus:** Move this repo out of Dropbox into `~/Projects/bda-site` and reshape to the standard template, including the nested Sanity studio.

**Done:**

- Copied off Dropbox into `~/Projects/bda-site`; Dropbox original kept as fallback. Same GitHub repo + Vercel project.
- Committed pending work first: the agency submission form + `src/pages/api/submit-agency.ts` endpoint + Sanity `submission` schema, `output: 'static'` → `'server'` (Vercel adapter, for the one serverless endpoint), and the shared-design-system restyle of home/about/submit/404.
- Restructured: code + config → `client/`, nested Sanity studio → `client/studio/` (still deploys to Sanity separately via `sanity deploy`), `_context/` → `_internal/`. `CLAUDE.md` + `AGENTS.md` kept at root; one code link + `_context` refs fixed. `.gitignore` already unanchored — no changes needed. Astro build passes from `client/`; history preserved.

**Decisions:** Code in `client/`, nested studio stays inside `client/studio/`.

**Deployed:** Vercel Root Directory set to `client`, pushed `main`, production deploy green from the new structure. Verified `bda.stoyanov.works` / `/about` / `/submit` / sitemap all 200; homepage renders agency content. The Astro `output: 'server'` switch works (serverless function bundled). Dropbox original archived to `__archive/07_2026_bda-site`.

**Next / open:** The new `/api/submit-agency` endpoint is POST-only (a browser GET returns a cosmetic 500 — Astro failing to render an error page for an unsupported method; no real user hits it that way). **Not yet functionally tested end-to-end** — submit the form once to confirm it writes to Sanity, which needs `SANITY_WRITE_TOKEN` set in the bda-site Vercel env. Known pre-existing tech debt still open: raw un-transformed Sanity image URLs (no `?w=`), Sanity→Vercel deploy hook not wired.

## 2026-05-07

**Focus:** Wire up the `_context/` pattern in this project, mirroring stoyanov-works-website.

**Done:**

- Created `_context/` with the four files (session-log, decisions, conventions, open-questions) using the same headers and format conventions as stoyanov-works-website.
- Added a `## Context files` section near the top of `CLAUDE.md` describing the pattern and the trigger phrase ("update CLAUDE.md").

**Decisions:** none.

**Next session:**

- Pick up whatever Yordan brings. Top of `Up next` in CLAUDE.md is image performance (raw Sanity URLs without `?w=` transforms). Decide whether to migrate the `Up next` block out of CLAUDE.md and into `_context/open-questions.md` — the reference repo did this; we left it in place pending sign-off.

---

## YYYY-MM-DD

**Focus:** [one line - what this session was about]

**Done:**

- [change 1]
- [change 2]

**Decisions:** [link to decisions.md entry if significant]

**Next session:**

- [pickup point]

---
