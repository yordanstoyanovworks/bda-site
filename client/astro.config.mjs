import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://bda.stoyanov.works',
  // Mostly static; pages opt in via `export const prerender = true`.
  // The /api/submit-agency endpoint runs as a Vercel serverless function.
  output: 'server',
  adapter: vercel(),
  integrations: [sitemap()],
});
