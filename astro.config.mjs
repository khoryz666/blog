import { defineConfig } from 'astro/config'
import { site } from './src/config.ts'

// https://astro.build/config
export default defineConfig({
  site: site.url,
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
