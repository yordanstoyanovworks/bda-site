# CLAUDE.md — bda-site

A static directory of Bulgarian design agencies (Български Дизайн Агенции). Sanity-backed content, Astro-rendered pages, deployed to Vercel.

## Stack (locked)

Don't propose alternatives unless asked.

- **Framework:** Astro `^5.0.0` — `output: 'static'`
- **Adapter:** `@astrojs/vercel` `^8.0.0`
- **CMS:** Sanity (`@sanity/client` `^7.0.0`) — project `dq09sslz`, dataset `production`, apiVersion `2024-01-01`, `useCdn: true`
- **Sitemap:** `@astrojs/sitemap` `^3.7.2`
- **TypeScript:** strict (extends `astro/tsconfigs/strict`)
- **Package manager:** npm (lockfile committed)
- **Node:** 24.x (per Vercel project)
- **Styling:** plain CSS with `:root` custom properties — **no Tailwind, no CSS framework**
- **Components:** Astro `.astro` files only — no React/Vue/Svelte
- **Hosting:** Vercel project `bda-site` (team `yordans-projects-6ce72501`)
- **Domain:** `bda.stoyanov.works` (A record `76.76.21.21` in Namecheap)

## Common commands

```bash
npm run dev       # astro dev — local server on :4321
npm run build     # astro build — writes ./dist
npm run preview   # astro preview — serve built output

# One-off image migration (already run; keep around for reference)
SANITY_TOKEN=skXXX node migrate-images.mjs
```

No lint, no test, no format scripts configured.

## Folder structure

```
.
├── astro.config.mjs       # site URL, vercel adapter, sitemap integration
├── tsconfig.json          # extends astro/tsconfigs/strict
├── migrate-images.mjs     # one-shot script: old Sanity CDN → native image assets
├── data/
│   └── agencies-export.json  # raw export from old BDA site (untracked, reference data)
├── public/
│   └── robots.txt         # allows all, points at sitemap-index.xml
└── src/
    ├── layouts/
    │   └── Base.astro     # the only layout — header, footer, global CSS, design tokens
    ├── lib/
    │   └── sanity.ts      # client + GROQ queries (getAgencies/getCategories/getCities)
    ├── pages/
    │   ├── index.astro    # directory: filters by category/city, grid/list view toggle
    │   ├── about.astro    # static copy
    │   └── submit.astro   # form (front-end only — submits to console.log)
    └── components/        # currently empty — extract here when a pattern repeats
```

## Design tokens

Defined in `src/layouts/Base.astro` `:root`. Reference these via `var(--token)`; don't hard-code.

| Token             | Value                                              | Usage                          |
|-------------------|----------------------------------------------------|--------------------------------|
| `--black`         | `#000`                                             | text, accents, active states   |
| `--white`         | `#fff`                                             | page bg, cards                 |
| `--grey-100`      | `#f5f5f5`                                          | hover bg, tag bg               |
| `--grey-200`      | `#e5e5e5`                                          | borders, dividers              |
| `--grey-300`      | `#d4d4d4`                                          | input borders, outlined tags   |
| `--grey-500`      | `#737373`                                          | muted text, footer copy        |
| `--grey-700`      | `#404040`                                          | body copy on light bg          |
| `--grey-900`      | `#171717`                                          | (defined, currently unused)    |
| `--font`          | `'Inter', -apple-system, BlinkMacSystemFont, sans` | everything                     |
| `--max-width`     | `1200px`                                           | container width                |
| `--gap`           | `1rem`                                             | (defined, used ad-hoc)         |

**Typography:** Inter via Google Fonts (weights 400, 500, 600, 700). Headings use `letter-spacing: -0.02em` to `-0.03em` and `clamp(1.75rem, 4vw, 2.5rem)` for h1.

**Container pattern:** `max-width: var(--max-width); margin: 0 auto; padding: 0 1.5rem;` — repeat per section, not via a wrapper component.

## Conventions

- **Astro static, all data fetched at build.** Sanity client uses CDN (`useCdn: true`). To pick up new content, redeploy.
- **Site language is Bulgarian (`<html lang="bg">`).** All UI copy is in Cyrillic. Don't translate to English without being asked.
- **GROQ queries live in `src/lib/sanity.ts`** as exported async functions. Pages call them in frontmatter — don't fetch from inline scripts.
- **Image source: native Sanity image assets.** Query via `image{ asset->{ url } }`. There is a legacy `imageUrl` fallback in `Agency` type and index.astro for safety, but new agencies should use `image` only — the migration in `migrate-images.mjs` already converted existing docs.
- **Styling is scoped per `.astro` file.** Global tokens and reset live in `Base.astro` only. No Tailwind, no CSS modules, no PostCSS plugins.
- **Interactivity is vanilla `<script>` blocks** at the bottom of `.astro` files (see filter/view-toggle logic in `index.astro`). No client framework. Don't introduce one for one-off DOM work.
- **`src/components/` is empty by design** — extract a component only when a pattern repeats across pages, not preemptively.
- **External agency links** open in new tab with `target="_blank" rel="noopener"`.

## SEO / metadata

- `astro.config.mjs` sets `site: 'https://bda.stoyanov.works'` — `@astrojs/sitemap` uses this.
- Sitemap auto-published at `/sitemap-index.xml` on build.
- `public/robots.txt` allows all and references the sitemap.
- Per-page `<title>` set via `Base.astro` `title` prop.
- Canonical URL is computed in `Base.astro` from `Astro.url.pathname` + `Astro.site`.
- Default meta description in `Base.astro` is fixed Bulgarian copy — pages don't override it yet (TBD if per-page descriptions are wanted — confirm with Yordan).
- No JSON-LD structured data yet.

## Reference

- **Production:** https://bda.stoyanov.works
- **Repo:** https://github.com/yordanstoyanovworks/bda-site
- **Vercel project:** `bda-site` (id `prj_eRXA0M6r7wSShQJhYzPiLtjIh4k0`, team `yordans-projects-6ce72501`)
- **Sanity Studio:** https://www.sanity.io/manage/project/dq09sslz
- **DNS:** Namecheap (apex `stoyanov.works`), `bda` subdomain → A `76.76.21.21`
- **Contact:** yordan@stoyanov.works

## Up next

_(populate with current priorities)_

## Known traps

- **The submit form doesn't submit anywhere.** `src/pages/submit.astro` `form.addEventListener` does `console.log(entries)` and shows a success message. No backend is wired up. Don't claim "submission works" until a real handler (Sanity write API, Formspree, Resend, etc.) is connected.
- **Agency `imageUrl` is legacy.** It's still in the `Agency` interface and the index.astro renders `agency.image?.asset?.url || agency.imageUrl`. After confirming all docs were migrated, this fallback can be removed — but verify with a Sanity query first that no doc still has only `imageUrl`.
- **`useCdn: true` means new Sanity content can lag a minute or two** before showing on the next build. Not a bug.
- **No env file template.** `migrate-images.mjs` requires `SANITY_TOKEN` (Editor permissions) but the runtime client uses no token. Don't add a token to the runtime client unless writes from the site are intended.
- **`data/` and `migrate-images.mjs` are currently untracked** (per `git status`). Decide whether to commit or `.gitignore` them — leaving them untracked indefinitely is the worst of both.
