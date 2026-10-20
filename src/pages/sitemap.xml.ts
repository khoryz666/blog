import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { site } from '../config'
import { escapeHtml, slugifyTag } from '../lib/list'
import { getPublishedPosts } from '../lib/posts'

/**
 * Lists every HTML route under src/pages by hand (404 excluded), so a new page
 * route has to be added here too.
 */
export const GET: APIRoute = async (context) => {
  const base = context.site ?? site.url
  const posts = await getPublishedPosts()
  const pages = await getCollection('pages')
  const tags = new Set(posts.flatMap((post) => post.data.tags.map(slugifyTag)))

  const urls: { path: string; lastmod?: Date }[] = [
    { path: '/' },
    ...pages.map((page) => ({ path: `/${page.id}/` })),
    ...posts.map((post) => ({
      path: `/post/${post.id}/`,
      lastmod: post.data.lastmod ?? post.data.date,
    })),
    ...[...tags].map((tag) => ({ path: `/tags/${tag}/` })),
  ]

  const entries = urls.map(({ path, lastmod }) => {
    const loc = `<loc>${escapeHtml(new URL(path, base).href)}</loc>`
    return `<url>${loc}${lastmod ? `<lastmod>${lastmod.toISOString()}</lastmod>` : ''}</url>`
  })
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}</urlset>`
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
