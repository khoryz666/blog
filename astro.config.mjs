import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
  site: 'https://hongyeblog.pages.dev',
  integrations: [sitemap()],
  markdown: {
    // GitHub-flavored Markdown is on by default (Astro's Sätteri processor), so
    // no remark-gfm plugin is needed anymore.
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
})
