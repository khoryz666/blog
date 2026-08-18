import { defineConfig } from 'astro/config'
import remarkGfm from 'remark-gfm'

// https://astro.build/config
export default defineConfig({
  // Set your deployed URL (e.g. https://your-site.pages.dev) for canonical links
  // site: 'https://your-site.pages.dev',
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
