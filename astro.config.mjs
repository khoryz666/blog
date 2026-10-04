import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import { site } from './src/config.ts'

/**
 * @astrojs/sitemap only sees built URLs, so per-post `lastmod` has to be read
 * from the frontmatter that produced each /post/<slug>/ route.
 */
function postLastmods() {
  const postsDir = fileURLToPath(new URL('./content/posts', import.meta.url))
  const lastmods = new Map()

  const walk = (dir, prefix) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(full, prefix ? `${prefix}/${entry.name}` : entry.name)
        continue
      }
      if (!entry.name.endsWith('.md') || entry.name === '_templates') continue

      const slug =
        entry.name === 'index.md'
          ? prefix
          : `${prefix ? `${prefix}/` : ''}${entry.name.replace(/\.md$/, '')}`
      if (!slug) continue

      const front = readFileSync(full, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)
      if (!front) continue
      const field = (name) =>
        front[1]
          .match(new RegExp(`^${name}:\\s*([^\\s#]+)`, 'm'))?.[1]
          .replace(/^['"]|['"]$/g, '')
      if (field('draft') === 'true') continue

      const value = field('lastmod') ?? field('date')
      const date = value ? new Date(value) : null
      if (date && !Number.isNaN(date.getTime())) lastmods.set(`/post/${slug}/`, date)
    }
  }

  walk(postsDir, '')
  return lastmods
}

// https://astro.build/config
let lastmodsByPath
export default defineConfig({
  site: site.url,
  integrations: [
    sitemap({
      serialize(item) {
        lastmodsByPath ??= postLastmods()
        const path = item.url.startsWith('http') ? new URL(item.url).pathname : item.url
        const lastmod = lastmodsByPath.get(path)
        if (lastmod) item.lastmod = lastmod
        return item
      },
    }),
  ],
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
