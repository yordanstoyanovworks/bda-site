# Session Log

Newest entries on top. Each session: what changed, why, what's next.

---

## 2026-07-07 - Migrated off Dropbox to ~/Projects, restructured to client/ + _internal/ (NOT yet deployed)

**Focus:** Move this repo out of Dropbox into `~/Projects/bda-site` and reshape to the standard template, including the nested Sanity studio.

**Done:**

- Copied off Dropbox into `~/Projects/bda-site`; Dropbox original kept as fallback. Same GitHub repo + Vercel project.
- Committed pending work first: the agency submission form + `src/pages/api/submit-agency.ts` endpoint + Sanity `submission` schema, `output: 'static'` → `'server'` (Vercel adapter, for the one serverless endpoint), and the shared-design-system restyle of home/about/submit/404.
- Restructured: code + config → `client/`, nested Sanity studio → `client/studio/` (still deploys to Sanity separately via `sanity deploy`), `_context/` → `_internal/`. `CLAUDE.md` + `AGENTS.md` kept at root; one code link + `_context` refs fixed. `.gitignore` already unanchored — no changes needed. Astro build passes from `client/`; history preserved.

**Decisions:** Code in `client/`, nested studio stays inside `client/studio/`.

**Next / open (RESUME HERE):** Not deployed yet — local `main` is 2 commits ahead of origin.
    1. Set this project's **Vercel Root Directory → `client`** in the dashboard.
    2. Push `main`; verify `bda.stoyanov.works` (200) and that the submit endpoint works (needs `SANITY_WRITE_TOKEN` already in Vercel env).
    3. Retire the Dropbox original after sign-off.

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
