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
- **Design system:** shared `gallery-system.css` from [stoyanov-works-website/shared-styles/](../stoyanov-works-website/shared-styles/), copied into `src/styles/` as a static drop. Source-of-truth lives in the other repo; updates are manual `cp`. Body type is **Telegraf** (self-hosted woff2 in `public/fonts/`)
- **Components:** Astro `.astro` files only — no React/Vue/Svelte
- **Hosting:** Vercel project `bda-site` (team `yordans-projects-6ce72501`)
- **Domain:** `bda.stoyanov.works` (A record `76.76.21.21` in Namecheap)

## Common commands

```bash
# Site (Astro)
npm run dev       # astro dev — local server on :4321
npm run build     # astro build — writes ./dist
npm run preview   # astro preview — serve built output

# Studio (Sanity v5 — visual CMS, in studio/)
cd studio && npm install                 # first time on a fresh checkout
cd studio && npm run dev                 # local studio at :3333
cd studio && npx sanity login            # browser OAuth (provider: google)
cd studio && npx sanity deploy           # redeploy to bda-studio.sanity.studio
                                         # (--url bda-studio if hostname unset)

# One-off image migration (already run; keep around for reference)
SANITY_TOKEN=skXXX node scripts/migrate-images.mjs
```

No lint, no test, no format scripts configured.

## Folder structure

```
.
├── astro.config.mjs       # site URL, vercel adapter, sitemap integration
├── tsconfig.json          # extends astro/tsconfigs/strict
├── scripts/
│   └── migrate-images.mjs # one-shot script: old Sanity CDN → native image assets
├── data/
│   └── agencies-export.json  # raw export from old BDA site (reference data)
├── studio/                # Sanity Studio v5 — visual CMS, deployed separately to sanity.studio
│   ├── sanity.config.ts   # workspace config (project dq09sslz, dataset production)
│   ├── sanity.cli.ts      # CLI config (pinned appId f29rstgk2wj4wv88zfb9dd3s)
│   └── schemaTypes/       # agency, category, city
├── public/
│   └── robots.txt         # allows all, points at sitemap-index.xml
└── src/
    ├── layouts/
    │   └── Base.astro     # the only layout — header, footer, global CSS, design tokens
    ├── lib/
    │   └── sanity.ts      # client + GROQ queries (getAgencies/getCategories/getCities)
    ├── pages/
    │   ├── index.astro    # directory: filters by category/city, grid/list view toggle, JSON-LD
    │   ├── about.astro    # static copy
    │   ├── submit.astro   # form (front-end only — submits to console.log)
    │   └── 404.astro      # branded not-found page
    ├── styles/
    │   └── gallery-system.css  # copied from stoyanov-works-website/shared-styles
    └── components/        # currently empty — extract here when a pattern repeats

public/fonts/
└── Telegraf-Regular.woff2   # copied from stoyanov-works-website/public/fonts
```

## Design tokens

Two layered sources:

1. **`gallery-system.css`** (imported in `Base.astro` frontmatter) provides the shared semantic tokens: `--bg`, `--fg`, `--fg-dim`, `--fg-faint`, `--border`, `--font-sans`, `--font-mono`, `--label-sm/md/lg`. Defaults are dark-theme.
2. **`Base.astro` `:root`** runs after and overrides for BDA's light theme + keeps the legacy named greys.

Reference via `var(--token)` — don't hard-code colors or font stacks.

| Token             | Value                                              | Usage                          |
|-------------------|----------------------------------------------------|--------------------------------|
| `--bg`            | `#fff`                                             | page background                |
| `--fg`            | `#000`                                             | primary text                   |
| `--fg-dim`        | `rgba(0, 0, 0, 0.55)`                              | muted text (subtitles, meta)   |
| `--fg-faint`      | `rgba(0, 0, 0, 0.25)`                              | very low-emphasis text         |
| `--border`        | `rgba(0, 0, 0, 0.12)`                              | hairlines, list-view dividers  |
| `--font-sans`     | `'Telegraf', ui-sans-serif, system-ui, …`          | body, headings, all type       |
| `--font-mono`     | aliased to `var(--font-sans)`                      | utility classes that asked for mono now resolve to Telegraf |
| `--black`         | `#000`                                             | active filter pill bg          |
| `--white`         | `#fff`                                             | active filter pill text        |
| `--grey-100`      | `#f5f5f5`                                          | filter-tag bg, search hover    |
| `--grey-200`      | `#e5e5e5`                                          | view-toggle border             |
| `--grey-300`      | `#d4d4d4`                                          | search input border, clear-btn border |
| `--grey-500`      | `#737373`                                          | clear-btn text (legacy; prefer `--fg-dim`) |
| `--grey-700`      | `#404040`                                          | clear-btn text default (legacy) |
| `--font`          | `'Inter', -apple-system, …`                        | only form controls (search, clear, view-toggle, filter pills) still reference it. Body, headings, agency names, footer all use Telegraf via `--font-sans`. Plan: migrate the buttons to `--font-sans`, then drop both `--font` and the Inter `<link>`. |
| `--max-width`     | `1200px`                                           | container width                |

**Utility classes** (from `gallery-system.css`, available globally):

- `.chrome` — uppercase, letter-spacing 0.08em, `var(--font-mono)` (= Telegraf in BDA), 11px
- `.chrome.dim` / `.chrome.faint` — apply muted/faint foreground
- `.label` — stacked label rows
- `.num` — tabular figures, 9px, uppercase, dim — used for counts and numeric chrome
- `.mono`, `.tabular` — single-purpose helpers
- `.hairline`, `.hairline-t`, `.hairline-b` — 0.5px borders using `--border`

**Typography:** Telegraf 400 self-hosted at `/fonts/Telegraf-Regular.woff2`. Headings use `letter-spacing: -0.02em` to `-0.035em`, h1 at `clamp(2rem, 5vw, 3.25rem)` weight 500.

**Container pattern:** `max-width: var(--max-width); margin: 0 auto; padding: 0 1.5rem;` — repeat per section, not via a wrapper component.

## Conventions

- **Astro static, all data fetched at build.** Sanity client uses CDN (`useCdn: true`). To pick up new content, redeploy.
- **Site language is Bulgarian (`<html lang="bg">`).** All UI copy is in Cyrillic. Don't translate to English without being asked.
- **GROQ queries live in `src/lib/sanity.ts`** as exported async functions. Pages call them in frontmatter — don't fetch from inline scripts.
- **Image source: native Sanity image assets.** Query via `image{ asset->{ url } }`. There is a legacy `imageUrl` fallback in `Agency` type and index.astro for safety, but new agencies should use `image` only — the migration in `migrate-images.mjs` already converted existing docs.
- **Styling is scoped per `.astro` file.** Global tokens and reset live in `Base.astro` only. No Tailwind, no CSS modules, no PostCSS plugins.
- **Shared design system.** `gallery-system.css` and `Telegraf-Regular.woff2` are **copies** from [stoyanov-works-website](../stoyanov-works-website/), not symlinks. To sync updates: re-`cp` from the source repo's `shared-styles/` and `public/fonts/`. Never edit `src/styles/gallery-system.css` here directly — your changes will be overwritten on next sync. Edit the source repo first.
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
- JSON-LD `ItemList` of agencies is emitted from `index.astro` body (one `Organization` per agency, with `logo`/`description` only when present). No structured data on other pages.

## Content workflow

How content updates ship to production:

1. Yordan edits an agency/category/city at https://bda-studio.sanity.studio and clicks **Publish**.
2. Sanity webhook (configured in Manage → API → Webhooks) POSTs to a Vercel deploy hook.
3. Vercel rebuilds `bda-site` from the latest `main` and deploys the new static output.
4. `bda.stoyanov.works` reflects the change within ~30 seconds.

If a content edit doesn't show up:
- Check Sanity webhook delivery log (same Manage → API → Webhooks page).
- Check Vercel deployments — the auto-fired one is labeled "Deploy Hook".
- Drafts don't trigger webhooks (by design); only published changes do.

## Maintenance

The site is fully static and effectively zero-maintenance. Things that genuinely require periodic attention:

- **Annual:** renew `stoyanov.works` domain registration at Namecheap. If the apex expires, the `bda.` subdomain dies with it.
- **Watch for Sanity free-tier quotas** if traffic spikes: 100K API requests/month, 5 GB asset storage, 10 GB bandwidth/month. Current usage is well under.

Things that do *not* need manual upkeep:
- SSL certs — Vercel auto-renews.
- Vercel free tier — no expiry.
- The Sanity dataset — persists indefinitely on the free plan as long as the project isn't deleted.
- Footer year — computed from `new Date()`, never goes stale.

If the site is left untouched for months, it keeps serving the last build with no degradation. The only "decay" is content getting stale because new agencies aren't being added — that's a content choice, not a maintenance failure.

## Reference

- **Production:** https://bda.stoyanov.works
- **Repo:** https://github.com/yordanstoyanovworks/bda-site
- **Vercel project:** `bda-site` (id `prj_eRXA0M6r7wSShQJhYzPiLtjIh4k0`, team `yordans-projects-6ce72501`)
- **Sanity Studio (visual CMS):** https://bda-studio.sanity.studio
- **Sanity Manage (admin):** https://www.sanity.io/manage/project/dq09sslz
- **DNS:** Namecheap (apex `stoyanov.works`), `bda` subdomain → A `76.76.21.21`
- **Contact:** yordan@stoyanov.works

## Up next

Open improvement items, ordered by impact (last audited 2026-05-01, after the design-system adoption batch):

1. **Image performance.** Sanity image URLs are emitted raw — full-resolution originals (some 3000+px wide) downloaded for ~280px thumbs. Add `?w=560&auto=format&fit=max` query params at the GROQ/template layer.
2. **Image dimensions on `<img>`.** Sanity asset has `metadata.dimensions.width`/`height` — query and emit to kill CLS.
3. **Submit form is a no-op.** [src/pages/submit.astro](src/pages/submit.astro) only does `console.log`. Wire to Resend / Formspree / Sanity write API.
4. **Remove legacy `imageUrl` fallback.** Sanity audit on 2026-05-01 confirmed 0/81 docs use it — safe to delete from `Agency` interface, GROQ query, and template.
5. **Per-page meta description + OG/Twitter card.** Currently every page shares one Bulgarian description; sharing a URL produces a blank preview.
6. **Agency detail pages.** `/agency/[slug]` doesn't exist — `description` field is never rendered, slug is unused, and there's no indexable content per agency.
7. **17 agencies have no image.** They now render as a bordered tile with the name in faint mono — placeholder treatment, not a final design. Decide whether to require an image at the schema level or invest in the empty-state card.
8. **Subagents for adding new BDA entries.** Build Claude Code subagents that take an agency name + URL and handle the rest: scrape site for description, pull a logo/screenshot, classify into existing categories/cities, draft a Sanity document for review. Goal: drop friction so adding 10 agencies costs minutes, not an hour each.
9. **Drop Inter, finish the Telegraf migration.** Form controls in `index.astro` (`.search-input`, `.clear-btn`, `.view-btn`, `.filter-tag`) still reference `var(--font)`. Swap them to `var(--font-sans)`, then remove the Inter `<link>` in `Base.astro` and the `--font` token. Saves a Google Fonts request per page.

## Known traps

- **The submit form doesn't submit anywhere.** `src/pages/submit.astro` `form.addEventListener` does `console.log(entries)` and shows a success message. No backend is wired up. Don't claim "submission works" until a real handler (Sanity write API, Formspree, Resend, etc.) is connected.
- **Agency `imageUrl` is legacy.** Still in the `Agency` interface and the `index.astro` template falls back to it. As of 2026-05-01 a Sanity audit confirmed 0 of 81 agencies use `imageUrl` — the fallback is safe to remove (type, GROQ, template).
- **`useCdn: true` means new Sanity content can lag a minute or two** before showing on the next build. Not a bug.
- **No env file template.** `scripts/migrate-images.mjs` requires `SANITY_TOKEN` (Editor permissions) but the runtime client uses no token. Don't add a token to the runtime client unless writes from the site are intended.
- **Sanity → Vercel deploy hook is not wired.** Adding an agency in Sanity does nothing until someone pushes; production is stale by default. Wire a Sanity webhook to a Vercel deploy hook to fix.
- **Image URLs are raw `cdn.sanity.io` with no transform params.** Cards on the home page download originals (some thousands of pixels wide). Add `?w=560&auto=format&fit=max` at minimum when reading from `image.asset.url`.
