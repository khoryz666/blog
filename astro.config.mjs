import { defineConfig } from 'astro/config'
import remarkGfm from 'remark-gfm'
import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
  site: 'https://hongyeblog.pages.dev',
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkGfm],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
})
